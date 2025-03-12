import express from 'express';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { syncDatabase } from './models/syncModels';
import swaggerDocs from './config/swagger';
import swaggerUi from 'swagger-ui-express'
import authRoutes from './routes/authRoutes';


//Création d'un serveur Express
const app = express();

//chargement des variables d'environnement
dotenv.config();

// Connecter à Sequelize
testConnection().then(() => syncDatabase());

//Définition du port du serveur
const PORT = 3000;

console.log("lancement du serveur")
//Config du serveur par défaut

app.use(express.json());
//TODO ajouter ici connection à la BDD

//TODO ajouter ici les routes
app.use('/users', authRoutes)


// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le

//port indiqué
app.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
});