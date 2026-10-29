## 1. Technologies retenues

|     Composant    |      Technologie     |                    Rôle                             |
|        ---       |          ---         |                    ---                              |
| Frontend         | React + TypeScript   | Interface, affichage du jeu et interactions clavier |
| Backend          | Node.js + Fastify    | API, logique du jeu et gestion des joueurs          |
| WebSocket        | @fastify/websocket   | Communication en temps réel                         |
| Base de données  | PostgreSQL           | Utilisateurs, résultats et statistiques             |
| ORM              | Prisma               | Communication entre le backend et PostgreSQL        |
| Reverse proxy    | NGINX                | HTTPS, routage et connexions WebSocket              |
| Containerisation | Docker Compose       | Lancement et gestion des services                   |
| Monitoring       | Prometheus + Grafana | Métriques, surveillance et alertes                  |

## 2. Architecture générale

```text
              NAVIGATEURS DES JOUEURS
                 React + TypeScript
                         |
                     HTTPS / WSS
                         |
                         v
                      NGINX
                  (Reverse proxy)
                         |
                         v
                 Node.js + Fastify
                 /              \
              API REST       WebSocket
                 \              /
                  \            /
                   Logique du jeu
                         |
                       Prisma
                         |
                         v
                    PostgreSQL


              MONITORING / DEVOPS

             Backend + Infrastructure
                         |
                         v
                    Prometheus
                         |
                         v
                     Grafana
```

### Responsabilités

**Frontend**
- Afficher les personnages et la piste.
- Capturer les commandes des joueurs.
- Communiquer avec le backend.
- Afficher les positions et les résultats.

**Backend**
- Gérer les connexions des joueurs.
- Organiser les parties et le matchmaking.
- Valider les commandes reçues.
- Calculer les positions et les trébuchements.
- Synchroniser les participants avec WebSocket.
- Déterminer les résultats.

**Base de données**
- Conserver les comptes utilisateurs.
- Enregistrer les résultats des courses.
- Stocker l'historique et les statistiques.

**Infrastructure**
- Héberger les différents services.
- Assurer les communications HTTPS/WSS.
- Déployer l'application avec Docker Compose.
- Surveiller l'application avec Prometheus et Grafana.
