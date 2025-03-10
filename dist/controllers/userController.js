"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.modifyUser = modifyUser;
exports.deleteUser = deleteUser;
exports.searchUsers = searchUsers;
const database_1 = __importDefault(require("../config/database"));
const UtilisateurModel_1 = __importDefault(require("../models/UtilisateurModel"));
async function createUser(req, res) {
    try {
        // Validation des champs
        const { nom, email } = req.body;
        const utilisateur = await UtilisateurModel_1.default.create({ nom, email });
        res.json(utilisateur);
    }
    catch (err) {
        // Gestion des erreurs
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}
async function getAllUsers(req, res) {
    try {
        // Utilisation de .findAll() 
        const utilisateurs = await UtilisateurModel_1.default.findAll();
        res.json(utilisateurs);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}
async function modifyUser(req, res) {
    try {
        // Récupérer l'ID de l'utilisateur à modifier
        const { id } = req.params;
        // Valider si l'ID est bien un nombre
        if (isNaN(Number(id))) {
            res.status(400).json({ message: 'L\'ID doit être un nombre valide.' });
            return;
        }
        // Rechercher l'utilisateur par son ID
        const utilisateur = await UtilisateurModel_1.default.findByPk(id);
        // Si l'utilisateur n'existe pas
        if (!utilisateur) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        // Récupérer les nouveaux champs à modifier (nom et email)
        const { nom, email } = req.body;
        // Si un nom est fourni, on le met à jour
        if (nom) {
            if (typeof nom !== 'string' || nom.trim().length === 0) {
                res.status(400).json({ message: 'Le nom doit être une chaîne de caractères non vide.' });
                return;
            }
            utilisateur.nom = nom;
        }
        // Si un email est fourni, on le valide
        if (email) {
            if (typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
                res.status(400).json({ message: 'L\'email est invalide.' });
                return;
            }
            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            const existingEmail = await UtilisateurModel_1.default.findOne({ where: { email } });
            if (existingEmail && existingEmail.id !== utilisateur.id) {
                res.status(400).json({ message: 'L\'email est déjà utilisé par un autre utilisateur.' });
                return;
            }
            utilisateur.email = email;
        }
        // Si aucune donnée n'est fournie pour modification, retourner une erreur
        if (!nom && !email) {
            res.status(400).json({ message: 'Aucune donnée valide à modifier.' });
            return;
        }
        // Sauvegarder les modifications dans la base de données
        await utilisateur.save();
        // Retourner la réponse avec l'utilisateur modifié
        res.json(utilisateur);
    }
    catch (err) {
        // Gestion des erreurs internes
        console.error(err); // Optionnel, pour loguer l'erreur sur le serveur
        res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
    }
}
async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        // Vérification que l'ID est un nombre valide
        if (isNaN(Number(id))) {
            res.status(400).json({ message: 'L\'ID doit être un nombre valide.' });
            return;
        }
        // Trouver l'utilisateur avec l'ID
        const utilisateur = await UtilisateurModel_1.default.findByPk(id);
        // Si l'utilisateur n'existe pas, retourner une erreur 404
        if (!utilisateur) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return;
        }
        // Supprimer l'utilisateur de la base de données
        await utilisateur.destroy();
        // Retourner un message de succès
        res.json({ message: 'Utilisateur supprimé avec succès.' });
    }
    catch (err) {
        // Gestion des erreurs internes
        res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
    }
}
async function searchUsers(req, res) {
    try {
        const { nom, email, createdAfter } = req.query;
        //Créé une requête formatée pour que sequelize puisse insérer des variables à l'intérieur
        const query = `
 SELECT id, nom, email, "createdAt"
 FROM utilisateurs
 WHERE
 (:nom IS NULL OR nom ILIKE :nom) AND
 (:email IS NULL OR email ILIKE :email) AND
 (:createdAfter IS NULL OR "createdAt" >= :createdAfter)
 ORDER BY nom ASC;
 `;
        //insère dynamiquement les variables dans la requête et l'éxécute
        //sequelize.query avec replacements protège contre les injections sql
        const utilisateurs = await database_1.default.query(query, {
            replacements: {
                nom: nom ? `%${nom}%` : null, // Recherche partielle insensible à la casse
                email: email ? `%${email}%` : null,
                createdAfter: createdAfter || null,
            },
            type: "SELECT"
        });
        res.json(utilisateurs);
    }
    catch (error) {
        console.error("Erreur lors de la recherche :", error);
        res.status(500).json({ message: error.message });
    }
}
