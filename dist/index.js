"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const syncModels_1 = require("./models/syncModels");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const swagger_1 = __importDefault(require("./config/swagger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
//Création d'un serveur Express
const app = (0, express_1.default)();
//chargement des variables d'environnement
dotenv_1.default.config();
// Connecter à Sequelize
(0, database_1.testConnection)().then(() => (0, syncModels_1.syncDatabase)());
//Définition du port du serveur
const PORT = 3000;
console.log("lancement du serveur");
//Config du serveur par défaut
app.use(express_1.default.json());
//TODO ajouter ici connection à la BDD
//TODO ajouter ici les routes
app.use('/users', userRoutes_1.default);
// Swagger route
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
