# Script auto intégration planning MyGes dans google Calendar

## présentation 

Le script récupère les événements du planning sur MyGes pour après les mettre dans google agenda avec l'api google

Tout est fait de façon automatique.

Les événements sont récupérés semaine après semaine 
Attention les événements présents sur google agenda sont supprimer avant insertion des nouveaux événements de MyGes


## prérequis 

### credentials google

générer un projet google cloud pour utiliser l'api 

utiliser le _set up 1_ sur [developers google quickstart nodejs](https://developers.google.com/calendar/quickstart/nodejs?hl=fr)

### google agenda

créer un agenda spécialement pour cette application (car tous les événements sont supprimés)
Récupérer l'id de cet agenda dans les paramètres de celui-ci

## utilisation 

- télécharger le repo 
- avoir node js d'installé 
- faire un `npm install` a l'emplacement des fichiers
- renommer `exemple.env` en `.env`
- compléter les informations dedans (voir Config)
- mettre le fichier credentials.json avec les fichiers (voir credentials google)


## config 

USER_LOGIN= login de myGes
USER_PASSWORD= password myGes
CALENDAR_ID= id de calendrier
NUMBER_WEEK=3 nombre de semaines récupère semaine en cour + les 2 suivantes (mettre moins de 5 de préférence) 

## utilisation 

Faire `node .` dans la console 
Attendre que le google agenda soit remplis :D 

à la première utilisation un lien est donné, c'est pour l'autorisation de l'api google allez dessus et suivre les instructions puis copier-coller dans la console le code donné