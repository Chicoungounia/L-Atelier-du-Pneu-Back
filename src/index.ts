import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // ✅ Import correct
import { testConnection } from './config/database';
import { syncDatabase } from './models/syncModels';
import swaggerDocs from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes';
import produitRoutes from './routes/produitRoutes';
import clientRoutes from './routes/clientRoutes';
import rendezVousRoutes from './routes/rendezVousRoutes';
import prestationRoutes from './routes/prestationRoutes';
import factureRoutes from './routes/factureRoutes';
import { v2 as cloudinary } from 'cloudinary';

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
app.use('/users', authRoutes);
app.use('/produits', produitRoutes);
app.use('/clients', clientRoutes);
app.use("/rendezvous", rendezVousRoutes);
app.use("/prestation", prestationRoutes);
app.use("/factures", factureRoutes);

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

    try {
        // ✅ Upload d'une image
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
            { public_id: 'shoes' }
        );
        console.log(uploadResult);

        // ✅ Optimisation de l'image
        console.log(cloudinary.url('shoes', { fetch_format: 'auto', quality: 'auto' }));

        // ✅ Transformation (recadrage auto)
        console.log(cloudinary.url('shoes', { crop: 'auto', gravity: 'auto', width: 500, height: 500 }));
    } catch (error) {
        console.error("Erreur Cloudinary :", error);
    }
})();
