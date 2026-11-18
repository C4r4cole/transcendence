import { randomUUID } from "node:crypto";
import type { Game, Player, Key, GameErrorCode } from "../../shared/types.js";
import {
	FINISH_DISTANCE,
	COUNTDOWN_MS,
	BLOCK_MS,
	MIN_PLAYERS,
	MAX_PLAYERS,
	RACE_ENDS_MS
} from "./constants.js";

export class GameError extends Error {
	readonly code: GameErrorCode;

	constructor(code: GameErrorCode, message?: string) {
		super(message ?? code);
		this.name = "GameError";
		this.code = code;
	}
}

export function createGame(): Game {
	return {
		id: randomUUID(),
		players: [],
		status: "waiting",
		finishDistance: FINISH_DISTANCE,
		countdownEndsAt: null,
		startedAt: null,
		winnerId: null,
		raceEndsAt: null,
	};
}

export function addPlayer(game: Game, playerId: string): Player {
	const existing = findPlayer(game, playerId);
	if (existing)
		return existing;

	if (game.status !== "waiting")
		throw new GameError("GAME_NOT_WAITING");
	if (game.players.length >= MAX_PLAYERS)
		throw new GameError("GAME_FULL");

	const player: Player = {
		id: playerId,
		position: 0,
		lastKey: null,
		blockedUntil: 0,
		status: "active",
		finishedAt: null,
	};
	game.players.push(player);
	return player;
}

export function startGame(game: Game, now: number): Game {
	if (game.status !== "waiting")
		throw new GameError("GAME_NOT_WAITING");
	if (game.players.length < MIN_PLAYERS)
		throw new GameError("NOT_ENOUGH_PLAYERS");

	game.status = "countdown";
	game.countdownEndsAt = now + COUNTDOWN_MS;
	return game;
}

export function handleInput(
	game: Game,
	playerId: string,
	key: Key,
	now: number
): Player {
	const player = findPlayer(game, playerId);
	if (!player)
		throw new GameError("UNKNOWN_PLAYER");

	advance(game, now);
	if (game.status !== "running"
		|| player.status !== "active"
		|| now < player.blockedUntil) {
		return player;
	}

	if (player.lastKey !== key) {
		player.position++;
		player.lastKey = key;
	} else {
		player.blockedUntil = now + BLOCK_MS;
		player.lastKey = null;
	}

	if (player.position >= game.finishDistance) {
		finishPlayer(game, player, now);
		checkRaceEnd(game);
	}
	return player;
}

export function updateGame(game: Game, now: number): Game {
	advance(game, now);
	return game;
}

export function abandonPlayer(game: Game, playerId: string, now: number): Player {
	const player = findPlayer(game, playerId);
	if (!player)
		throw new GameError("UNKNOWN_PLAYER");

	advance(game, now);
	if (game.status !== "finished" && player.status === "active") {
		player.status = "abandoned";
		checkRaceEnd(game);
	}
	return player;
}

function advance(game: Game, now: number): void {
	if (game.status === "countdown"
		&& game.countdownEndsAt !== null
		&& now >= game.countdownEndsAt) {
		game.status = "running";
		game.startedAt = game.countdownEndsAt;
	}

	if (game.status === "running"
	   && game.raceEndsAt !== null
	   && now >= game.raceEndsAt) {
		   for (const p of game.players) {
			   if (p.status === "active")
				   p.status = "dnf";
		   }
		   game.status = "finished";
	   }
}

function finishPlayer(game: Game, player: Player, now: number): void {
	player.status = "finished";
	player.finishedAt = now;

	if (game.winnerId === null) {
		game.winnerId = player.id;
		if (game.players.length > 2)
			game.raceEndsAt = now + RACE_ENDS_MS;
	}
}

function checkRaceEnd(game: Game): void {
	const active = game.players.filter(p => p.status === "active");

	if (game.players.length === 2) {
		if (game.winnerId === null && active.length === 1)
			game.winnerId = active[0].id;
		game.status = "finished";
		return;
	}

	if (active.length === 0)
		game.status = "finished";
}

function findPlayer(game: Game, playerId: string): Player | undefined {
	return game.players.find(p => p.id === playerId);
}

