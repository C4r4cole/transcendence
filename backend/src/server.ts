import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import type { WebSocket } from "ws";

const app = fastify();

const clients = new Set<WebSocket>();

const start = async () => {
	try {
		await app.register(fastifyWebsocket);

		app.get("/ws", { websocket: true }, (socket, request) => {
			clients.add(socket);
			console.log("Clients connected:", clients.size);
			socket.on("message", (data) => {
				const message = data.toString();

				for (const client of clients)
					client.send(message);
				
				console.log(message);
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
