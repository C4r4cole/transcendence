# ft_transcendence — Backend Contract

**Version :** 0.1  
**Statut :** Proposition à valider par les deux développeurs  
**Périmètre :** Communication interne entre le serveur WebSocket et le Game Engine.

## 1. Architecture

Le backend comporte deux responsabilités distinctes.

**WebSocket Server**
- Gérer les connexions et déconnexions.
- Identifier les joueurs connectés et leur partie.
- Recevoir et valider les messages réseau.
- Appeler les fonctions du Game Engine.
- Diffuser les états du jeu aux navigateurs.

**Game Engine**
- Créer les parties et les joueurs.
- Appliquer les règles de déplacement.
- Gérer les trébuchements.
- Gérer le compte à rebours.
- Déterminer les arrivées, les abandons et les victoires.
- Mettre à jour l'état de chaque partie.

Le Game Engine doit fonctionner indépendamment de WebSocket.

## 2. Structures communes

Fichier : `backend/src/shared/types.ts`

```typescript
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
```

Les instants temporels sont exprimés en millisecondes, selon `Date.now()`.

`dnf` signifie *Did Not Finish* : le joueur n'a pas terminé dans le délai imparti.

## 3. Fonctions du Game Engine

Les fonctions suivantes seront exportées depuis `backend/src/game/engine.ts`.

### 3.1. createGame

**Signature :**
```typescript
createGame(): Game
```

**Comportement :**
- Créer une partie avec un identifiant unique.
- Initialiser un tableau `players` vide.
- Initialiser `status` à `"waiting"`.
- Initialiser `finishDistance` à `100` (valeur provisoire).
- Initialiser les propriétés temporelles et `winnerId` à `null`.
- Retourner la partie créée.

### 3.2. addPlayer

**Signature :**
```typescript
addPlayer(game: Game, playerId: string): Player
```

**Comportement :**
- Vérifier que la partie est en attente.
- Vérifier qu'elle contient moins de quatre joueurs.
- Vérifier que l'identifiant n'est pas déjà utilisé.
- Créer un joueur avec :
  - `position = 0`
  - `lastKey = null`
  - `blockedUntil = 0`
  - `status = "active"`
  - `finishedAt = null`
- Ajouter le joueur à `game.players`.
- Retourner le joueur créé.

Lever une erreur si l'ajout est impossible.

### 3.3. startGame

**Signature :**
```typescript
startGame(game: Game): Game
```

**Comportement :**
- Vérifier que la partie est en attente.
- Vérifier qu'au moins deux joueurs sont présents (pour le premier prototype).
- Passer `status` à `"countdown"`.
- Définir `countdownEndsAt` à l'instant actuel + 3 secondes.
- Retourner la partie mise à jour.

Lever une erreur si le démarrage est impossible.

Le mode solo sera pris en charge ultérieurement.

### 3.4. handleInput

**Signature :**
```typescript
handleInput(
    game: Game,
    playerId: string,
    key: Key
): Player
```

**Comportement :**
- Rechercher le joueur correspondant à `playerId`.
- Ignorer la commande si la course n'est pas en cours.
- Ignorer la commande si le joueur n'est plus actif.
- Ignorer la commande si le joueur est bloqué.
- Comparer la touche reçue avec `lastKey`.
- Si l'alternance est correcte, augmenter la position et actualiser `lastKey`.
- Si la touche est identique à `lastKey`, déclencher un trébuchement en mettant à jour `blockedUntil`, sans modifier `lastKey`.
- Si le joueur franchit la ligne d'arrivée, marquer son statut `"finished"` et enregistrer `finishedAt`.
- Actualiser les informations de victoire et de fin de partie si nécessaire.
- Retourner le joueur actualisé.

Si le joueur n'existe pas, lever une erreur.

**Règle retenue :** pendant un trébuchement, les commandes sont ignorées et `lastKey` ne change pas.

### 3.5. updateGame

**Signature :**
```typescript
updateGame(game: Game, now: number): Game
```

**Comportement :**
- Si le compte à rebours est terminé, passer la partie à `"running"`.
- Enregistrer l'instant de départ dans `startedAt`.
- Si un délai de fin de course est actif et expiré, marquer les joueurs restants comme `"dnf"` et terminer la partie.
- Retourner la partie mise à jour.

Le serveur est responsable d'appeler régulièrement `updateGame()`.

Le moteur reste responsable de décider des changements d'état.

### 3.6. abandonPlayer

**Signature :**
```typescript
abandonPlayer(game: Game, playerId: string): Player
```

**Comportement :**
- Rechercher le joueur.
- Marquer son statut `"abandoned"` s'il était actif.
- Empêcher tout nouveau déplacement.
- Mettre à jour les conditions de fin de partie.
- Retourner le joueur actualisé.

Lever une erreur si le joueur n'existe pas.

Pour une partie à deux déjà commencée, l'abandon d'un joueur entraîne la victoire de son adversaire encore actif.

La gestion d'un joueur quittant la file d'attente avant le départ sera traitée avec le matchmaking.

## 4. Règles communes de fin de course

**Course à deux joueurs :**
- Le premier arrivé remporte immédiatement la partie.
- Un abandon entraîne la victoire de l'autre joueur encore actif.
- `Game.status` passe à `"finished"`.

**Course à trois ou quatre joueurs :**
- Le premier arrivé devient le vainqueur.
- Les autres joueurs continuent.
- Un délai maximal commence après la première arrivée.
- La partie se termine lorsque tous les participants ont terminé ou abandonné, ou lorsque ce délai expire.
- Les joueurs encore actifs à l'expiration du délai sont marqués `"dnf"`.

La durée de blocage après trébuchement et le délai maximal de fin de course restent des paramètres à définir.

## 5. Convention d'implémentation

Pour cette première version :

- Les fonctions travaillent sur l'objet `Game` fourni.
- Elles peuvent modifier directement `Game` et ses joueurs.
- Les fonctions qui retournent `Game` renvoient le même objet mis à jour.
- Le Game Engine ne gère aucune connexion WebSocket.
- Le Game Engine n'envoie aucun message réseau.
- Le serveur WebSocket n'implémente aucune règle de déplacement ou de victoire.
- Les erreurs prévues par le contrat sont remontées au serveur, qui doit les traiter.

## 6. Hors périmètre du contrat initial

Les éléments suivants seront développés ultérieurement :

- Matchmaking automatique.
- Gestion simultanée de plusieurs parties.
- Gestion des comptes utilisateurs.
- PostgreSQL et Prisma.
- Historique et statistiques.
- Mode deux joueurs sur un même clavier.
- Protocole JSON entre les navigateurs et le serveur.
- Paramètres définitifs d'équilibrage.

## 7. Répartition du travail

**Développeur A — `feat/websocket`**

Implémentation du serveur WebSocket, gestion des connexions, routage des commandes vers le Game Engine et diffusion des états.

**Développeur B — `feat/game-engine`**

Implémentation et tests des fonctions définies dans ce contrat.

Les deux développeurs doivent valider ensemble toute modification du contrat partagé.

---

**Fin du contrat — Version 0.1**
