import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import type { WebSocket, RawData } from "ws";
import type { Key, GameStatus, Game, Player, GameErrorCode } from "./shared/types.js";
import * as engine from "./game/engine.js"

const TICK_MS = 50;

const app = Fastify();

await app.register(fastifyWebsocket);

const clients = new Map<string, WebSocket>();

const games = new Map<string, Game>();
let game = engine.createGame();
games.set(game.id, game);


interface InputMessage {
	type: "input";
	playerId: string;
	key: Key;
}

function isInputMessage(value: unknown): value is InputMessage {
	if (value === null || typeof value !== "object")
		return false;

	if (!("type" in value) || !("playerId" in value) || !("key" in value))
		return false;

	if (value.type !== "input")
		return false;
	if (value.key !== "left" && value.key !== "right")
		return false;
	if (typeof value.playerId !== "string")
		return false;

	return true;
}

function tryEngine(
	gameId: string,
	call: () => void,
	onRefused: (code: GameErrorCode) => void,
): void {
	try {
		call();
	} catch (e) {
		if (e instanceof engine.GameError) {
			onRefused(e.code);
			return;
		}
		console.error(`[game ${gameId}] engine bug:`, e);
		// closeGame(gameId);
	}
}

const onConnection = (socket: WebSocket) => {
	const playerId = String(clients.size);

	clients.set(playerId, socket);

	console.log("Clients connected:", clients.size);

	tryEngine(
		game.id,
		() => {
			engine.addPlayer(game, playerId);
			if (game.players.length >= 2) {
				engine.startGame(game, performance.now());
			}
		},
		(code) => socket.send(JSON.stringify({ type: "error", code })),
	);

	socket.on("message", (raw) => {
		const message: unknown = JSON.parse(raw.toString());

		if (!isInputMessage(message)) {
			console.error("ERROR: Invalid message");
			return;
		}

		tryEngine(
			game.id,
			() => {
				engine.handleInput(game, message.playerId,
					message.key, performance.now()
				);
				console.log("position" + game.players[+playerId].position);
			},
			(code) => socket.send(JSON.stringify({ type: "error", code })),
		);

		console.log(message.type);
		console.log(message.playerId);
		console.log(message.key);
	});
	socket.on("close", () => {
		clients.delete(playerId);
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

setInterval(() => {
	const now = performance.now();
	for (const game of games.values()) {
		tryEngine(game.id, () => engine.updateGame(game, now), () => { })
	}
}, TICK_MS);
