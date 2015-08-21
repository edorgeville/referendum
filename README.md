# Urbania : Referendum
## Le grand moment est arrivé !

### Comment utiliser 
```
npm install
npm start
```

### Endpoints
- ```GET /``` :  page d'accueil
- ```POST /sms``` : utilisée par Twilio pour les SMS reçus
- ```GET /triche/oui``` et ```GET /triche/non``` : pour faire de la fraude électorale  

### Développement Twilio local
Créer un fichier ```.env``` et remplir de la façon suivante : 
```
TWILIO_SID=xxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxx
TWILIO_NUMBER=+15141231234
``` 
Puis lancer le serveur avec ```npm start```.
Utiliser localtunnel (```npm install -g localtunnel```) pour exposer publiquement le endpoint pour Twilio : 
```
lt --port 1337
```
Utiliser l'URL retournée pour Twilio 

### Déploiement sur Heroku
```
heroku git:remote -a urbania-referendum -r production
git push production master
heroku config:set TWILIO_SID=xxxxxxxxxxxxxxx TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxx TWILIO_NUMBER=+15141231234 -r production
heroku open
```