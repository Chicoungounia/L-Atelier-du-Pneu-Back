import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { testConnection } from './config/database';
import { syncDatabase } from './models/syncModels';
import swaggerDocs from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import produitRoutes from './routes/produitRoutes';
import clientRoutes from './routes/clientRoutes';
import rendezVousRoutes from './routes/rendezVousRoutes';
import prestationRoutes from './routes/prestationRoutes';
import factureRoutes from './routes/factureRoutes';
import authRoutes from './routes/authRoutes';
import { v2 as cloudinary } from 'cloudinary';
// import dashboardRoutes from './routes/dashboardRoutes';

// ✅ Charger les variables d’environnement en premier
dotenv.config();

// ✅ Création du serveur Express
const app = express();

// ✅ Utilisation de cookie-parser
app.use(cookieParser());

// ✅ Connecter Sequelize
testConnection().then(() => syncDatabase());

// ✅ Définition du port du serveur
const PORT = process.env.PORT || 3000;

console.log("Lancement du serveur...");

// ✅ Configuration des middlewares
app.use(express.json());

// ✅ Ajout des routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/produits', produitRoutes);
app.use('/clients', clientRoutes);
app.use("/rendezvous", rendezVousRoutes);
app.use("/prestation", prestationRoutes);
app.use("/factures", factureRoutes);
// app.use("/dashboard", dashboardRoutes);

// ✅ Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ✅ Lancement du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// ✅ Configuration de Cloudinary
(async function () {
    cloudinary.config({ 
        cloud_name: 'dl3in2brl', 
        api_key: '235871692275173', 
        api_secret: 'r-Fzl9fiVspIT3cEjsMvqBStPZA' 
    });


})();
