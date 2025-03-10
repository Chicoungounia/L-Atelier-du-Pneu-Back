"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commande = exports.Produit = exports.Client = exports.Profil = exports.Utilisateur = exports.syncDatabase = void 0;
const database_1 = __importDefault(require("../config/database"));
const UtilisateurModel_1 = __importDefault(require("./UtilisateurModel"));
exports.Utilisateur = UtilisateurModel_1.default;
const profilModel_1 = __importDefault(require("./profilModel"));
exports.Profil = profilModel_1.default;
const clientModel_1 = __importDefault(require("./clientModel"));
exports.Client = clientModel_1.default;
const produitModel_1 = __importDefault(require("./produitModel"));
exports.Produit = produitModel_1.default;
const commandeModel_1 = __importDefault(require("./commandeModel"));
exports.Commande = commandeModel_1.default;
const syncDatabase = async () => {
    try {
        //alter: true Met à jour la structure automatiquement la structure de la base de données
        //à utiliser sans options pour utiliser les migrations en production.
        await database_1.default.sync({ alter: true });
        console.log("Base de données synchronisée");
    }
    catch (error) {
        console.error("Erreur lors de la synchronisation :", error);
    }
};
exports.syncDatabase = syncDatabase;
