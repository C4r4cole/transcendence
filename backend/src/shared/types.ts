export type Key = "left" | "right";

export type GameStatus =
    "waiting" | "countdown" | "running" | "finished";

export type PlayerStatus =
    "active" | "finished" | "abandoned" | "dnf";

export interface Player {
    id: string;
    position: number;
    lastKey: Key | null;
    blockedUntil: number;
    status: PlayerStatus;
    finishedAt: number | null;
}

export interface Game {
    id: string;
    players: Player[];
    status: GameStatus;
    finishDistance: number;
    countdownEndsAt: number | null;
    startedAt: number | null;
    winnerId: string | null;
    raceEndsAt: number | null;
}