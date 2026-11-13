import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import type { WebSocket } from "ws";
import type { Key, GameStatus } from "./shared/types.js";

const app = fastify();

const clients = new Set<WebSocket>();

interface InputMessage {
	type: "input";
	key: Key;
}

const start = async () => {
	try {
		await app.register(fastifyWebsocket);

		app.get("/ws", { websocket: true }, (socket, request) => {
			clients.add(socket);
			console.log("Clients connected:", clients.size);
			socket.on("message", (data) => {
				try{
					const message: InputMessage = JSON.parse(data.toString());
	
					console.log(message.type);
					console.log(message.key);
				}
				catch (err)
				{
					console.log("Invalid JSON");
				}
			})
			socket.on("close", () => {
				clients.delete(socket);
			})
		})
		
		await app.listen({port: 3000});
		console.log("server started");
	}
	catch (err)
	{
		console.error(err);
		process.exit(1);
	}
};

start();