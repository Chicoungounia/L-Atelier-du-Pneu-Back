"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
//chargement des variables d'environnement
dotenv_1.default.config();
console.log(" DATABASE_URL utilisée par Sequelize :", process.env.DATABASE_URL);
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false, // Désactiver les logs SQL (optionnel)
});
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connecté à PostgreSQL avec Sequelize");
    }
    catch (error) {
        console.error("Erreur de connexion à PostgreSQL :", error);
    }
};
exports.testConnection = testConnection;
exports.default = sequelize;
