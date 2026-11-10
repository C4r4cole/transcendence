import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";

const app = fastify();

const start = async () => {
	try {
		await app.register(fastifyWebsocket);

		app.get("/ws", { websocket: true }, (socket, request) => {
			console.log("Client connected");
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
