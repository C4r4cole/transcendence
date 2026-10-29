# ft_transcendence — Cahier des charges fonctionnel

**Version :** 1.0  
**Type :** Jeu de course à pied multijoueur en 2D  
**Statut :** Règles principales définies — paramètres d'équilibrage à préciser

## 1. Présentation du projet

Le projet consiste à développer un jeu de course à pied en 2D, jouable seul, à deux en local ou à plusieurs en ligne.

Les joueurs contrôlent leur personnage en alternant le plus rapidement possible deux touches de leur clavier.

L'objectif est de franchir la ligne d'arrivée avant ses adversaires, tout en évitant les erreurs de manipulation susceptibles de provoquer un trébuchement.

Le jeu repose sur deux compétences principales :

- **La rapidité :** alterner les touches le plus rapidement possible.
- **La précision :** éviter les erreurs d'alternance qui ralentissent le personnage.

## 2. Modes de jeu

Trois modes de jeu sont prévus.

| Mode | Joueurs | Configuration |
|---|---|---|
| Solo | 1 | Une machine |
| Multijoueur local | 2 | Une machine, un clavier |
| Multijoueur en ligne | 2 à 4 | Plusieurs machines |

### 2.1. Mode solo

Un joueur effectue une course seul, avec pour objectif de franchir la ligne d'arrivée le plus rapidement possible.

### 2.2. Mode multijoueur local

Deux joueurs s'affrontent simultanément sur un même ordinateur et utilisent le même clavier.

Les commandes sont réparties entre les joueurs afin qu'ils puissent jouer simultanément.

### 2.3. Mode multijoueur en ligne

Deux à quatre joueurs participent à une même course depuis plusieurs ordinateurs.

Les déplacements et l'état de la course sont synchronisés entre tous les participants.

**Le système de matchmaking est automatique :** les joueurs rejoignent une file d'attente et sont regroupés dans une partie sans devoir saisir de code de salon.

## 3. Commandes

### Joueur 1

- Flèche gauche (←)
- Flèche droite (→)

### Joueur 2 en local

- A
- D

Pour avancer, chaque joueur doit appuyer alternativement sur ses deux touches.

Une alternance correcte permet au personnage de progresser.

Une répétition incorrecte entraîne un trébuchement.

## 4. Déroulement d'une course

### 4.1. Préparation

Les joueurs accèdent au mode de jeu souhaité.

En multijoueur en ligne, le matchmaking automatique regroupe les participants avant le début de la course.

### 4.2. Départ

Un compte à rebours apparaît avant chaque course :

**3 — 2 — 1 — GO !**

Aucun personnage ne peut commencer à avancer avant le signal de départ.

### 4.3. Déplacement

Chaque appui valide, respectant l'alternance des touches, fait avancer le personnage.

Plus le joueur alterne rapidement, plus son personnage progresse vite.

La distance exacte parcourue à chaque appui sera définie pendant le développement.

### 4.4. Trébuchement

Si un joueur appuie deux fois consécutivement sur la même touche, son personnage trébuche.

**Conséquence : blocage temporaire du personnage.**

Pendant cette période, le personnage ne peut pas progresser, même si le joueur continue à appuyer sur les touches.

Une fois le blocage terminé, le joueur peut reprendre sa course.

La durée exacte du blocage reste à déterminer.

### 4.5. Distance de course

La distance de course n'est pas encore définie.

Elle sera choisie ultérieurement, notamment en fonction des premiers tests de gameplay et de la durée souhaitée des parties.

## 5. Conditions de victoire et fin de partie

### 5.1. Mode solo

La course se termine lorsque le joueur franchit la ligne d'arrivée.

Son temps de course est enregistré.

### 5.2. Course à deux joueurs

Applicable au multijoueur local et en ligne.

- Le premier joueur à franchir la ligne d'arrivée est déclaré vainqueur.
- La partie se termine immédiatement.
- Le second joueur n'a pas besoin de terminer son parcours.

### 5.3. Course à trois ou quatre joueurs

Applicable au multijoueur en ligne.

- Le premier joueur qui franchit la ligne d'arrivée est déclaré vainqueur.
- Les autres joueurs continuent leur course.
- Le classement est établi dans l'ordre de franchissement de la ligne d'arrivée.
- La partie se termine lorsque tous les joueurs ont terminé ou lorsqu'un temps limite est atteint.

### 5.4. Temps limite

Pour éviter qu'une partie ne reste bloquée lorsqu'un joueur ne termine pas sa course, un temps limite est déclenché après l'arrivée du premier joueur.

À l'expiration de ce délai, la partie se termine automatiquement.

La durée du délai et le classement des joueurs n'ayant pas terminé restent à définir.

## 6. Gestion des déconnexions

En multijoueur en ligne, lorsqu'un joueur se déconnecte pendant une course, il est considéré comme ayant abandonné.

- Le joueur déconnecté ne participe plus à la course.
- Son abandon est pris en compte dans les résultats.
- Les autres participants peuvent poursuivre la course, sauf si une règle de fin de partie s'applique.

Le comportement exact d'une course à deux joueurs lorsqu'un participant abandonne sera précisé ultérieurement.

## 7. Résultats et historique

À la fin de chaque course, un écran récapitulatif présente :

- Le vainqueur, lorsqu'il y a plusieurs participants.
- Le classement des joueurs.
- Les temps de course disponibles.
- Les éventuels abandons.
- Les joueurs n'ayant pas terminé dans le temps imparti.

Les résultats des parties seront exploités par le module *Game statistics and match history* prévu dans ft_transcendence.

## 8. Principes de conception

Le développement devra privilégier :

1. La simplicité des commandes et des règles.
2. La réactivité des déplacements.
3. Une expérience multijoueur fluide.
4. L'équité entre les participants.
5. La cohérence des résultats et du classement.
6. Une architecture permettant l'évolution du jeu.

## 9. Paramètres restant à définir

Les éléments suivants seront déterminés au cours du prototypage et des tests :

- La distance de course.
- La distance parcourue par appui valide.
- La durée du blocage après un trébuchement.
- La durée limite après l'arrivée du vainqueur.
- Le classement des joueurs n'ayant pas terminé.
- Le nombre de joueurs requis pour lancer automatiquement une partie.
- Le comportement en cas d'abandon ou de déconnexion dans une course à deux.
- Les modalités d'enregistrement des résultats en mode solo et local.

---

**Fin du cahier des charges fonctionnel — Version 1.0**