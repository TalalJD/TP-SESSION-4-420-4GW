# TP-SESSION-4

# Creation de la base de donnée
## Créer la base de donnée energymizeBD;
Après avoir créer votre serveur local docker sur le port 3307:3306, connectez vous à MySQL et éxécutez les commandes dans /Model Remake/creerBD.sql
## Créer les tables de la base de donnée energymizeBD;
Après avoir donné les droits à scott, et après avoir créer la base de donnée en ayant suivi les commandes de creerBD.sql, naviguez au fichier ddlGenMySQL et lancez toutes les commandes.

# Fonctionnement de la base de donnée
## Base de donnée non-SQL
Une partie de la base donnée, précisement celle contenant les données utilisateurs ainsi que leur abonnement n'utilise pas une base de donnée SQL, et n'utilise pas une base de donnée locale comme docker. Les tables sont storés à l'aide du service MongoDB Atlas, et aucune étape est à faire afin de pouvoir y accéder à partir d'un nouvel ordinateur.
## Base de donnée SQL
Le reste de la base de donnée, soit les exercices sauvegardées localement, ceux executées ou les entrainements en entier sont sauvegardée en SQL afin d'utiliser la fonctionnalité des foreign keys que ce type de base de donnée offre.
# Lancement du site web
Ouvrir le dossier Prototype 1 dans Visual Studio et ouvrir un terminal.
Dans le terminal, executer la commande node serveur.js
! IMPORTANT : Assurez vous que le serveur docker est running et configuré