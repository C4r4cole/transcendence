import { useEffect, useState } from "react";

function App() {
	const [pos, setPos] = useState(0);

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:3000/ws");

		socket.onopen = () => {
			console.log("Connecté au backend !");
		};

		socket.onmessage = (event) => {
			console.log("Message reçu :", event.data);
			const pos: number = JSON.parse(event.data);
			setPos(pos);
		};

		socket.onerror = () => {
			console.error("Erreur WebSocket");
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
				socket.send('{ type: "input", key: "left" }')
			}
			if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
				socket.send('{ type: "input", key: "right" }')
			}
		};
		
		window.addEventListener("keydown", handleKeyDown);
		
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			socket.close();
		};
	}, []);

	return (
		<main>
			<h1>42 Choubidoux</h1>
			<p>bidou</p>

			<h2>Position : {pos}</h2>
		</main>
	);
}

export default App;
