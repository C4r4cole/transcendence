import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import type { WebSocket, RawData } from "ws";
import type { Key, GameStatus, Game, Player } from "./shared/types.js";
import * as engine from "./game/engine.js"

const app = Fastify();

await app.register(fastifyWebsocket);

const clients = new Set<WebSocket>();

const games = new Map<string, Game>();
let game = engine.createGame();
games.set(game.id, game);


interface InputMessage {
	type: "input";
	key: Key;
}

function isInputMessage(value: unknown): value is InputMessage {
	if (value === null || typeof value !== "object")
		return (false);

	if (!("type" in value))
		return (false);

	if (!("key" in value))
		return (false);

	if (value.type !== "input")
		return (false);

	if (value.key !== "left" && value.key !== "right")
		return (false);

	return (true);
}

const onMessage = (data: RawData) => {
	try {
		const message: unknown = JSON.parse(data.toString());

		if (!isInputMessage(message)) {
			console.log("Invalid message");
			return;
		}
		console.log(message.type);
		console.log(message.key);
	}
	catch (err) {
		console.log("Invalid JSON");
	}
}

const onConnection = (socket: WebSocket) => {
	clients.add(socket);
	console.log("Clients connected:", clients.size);

	engine.addPlayer(game, String(clients.size))
	if (game.players.length >= 2) {
		engine.startGame()
	}

	socket.on("message", onMessage);
	socket.on("close", () => {
		clients.delete(socket);
	})
}

const start = async () => {
	try {
		app.get("/ws", { websocket: true }, onConnection)

		await app.listen({ port: 3000 });
		console.log("server started");
	}
	catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();
