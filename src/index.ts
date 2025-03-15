import express from 'express';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { syncDatabase } from './models/syncModels';
import swaggerDocs from './config/swagger';
import swaggerUi from 'swagger-ui-express'
import authRoutes from './routes/authRoutes';
import produitRoutes from './routes/produitRoutes';
import clientRoutes from './routes/clientRoutes';
import rendezVousRoutes from './routes/rendezVousRoutes';
import { v2 as cloudinary } from 'cloudinary';


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
app.use('/produits', produitRoutes)
app.use('/clients', clientRoutes)
app.use("/rendezvous", rendezVousRoutes);


// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le

//port indiqué
app.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
});

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: 'dl3in2brl', 
        api_key: '235871692275173', 
        api_secret: 'r-Fzl9fiVspIT3cEjsMvqBStPZA' // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
    const uploadResult = await cloudinary.uploader
    .upload(
        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
            public_id: 'shoes',
        }
    )
    .catch((error) => {
        console.log(error);
    });
 
 console.log(uploadResult);
 
 // Optimize delivery by resizing and applying auto-format and auto-quality
 const optimizeUrl = cloudinary.url('shoes', {
     fetch_format: 'auto',
     quality: 'auto'
 });
 
 console.log(optimizeUrl);
 
 // Transform the image: auto-crop to square aspect_ratio
 const autoCropUrl = cloudinary.url('shoes', {
     crop: 'auto',
     gravity: 'auto',
     width: 500,
     height: 500,
 });
 
 console.log(autoCropUrl);    
})();