
import sequelize from "../config/database";
import Utilisateur from "../models/utilisateurModel";
import { Request, Response } from 'express';

export async function createUser(req: Request, res: Response) {
    try {
    // Validation des champs
        const { nom, email } = req.body;
        const utilisateur = await Utilisateur.create({ nom, email });
        res.json(utilisateur);
    } catch (err: any) {
    // Gestion des erreurs
     res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
   }


   export async function getAllUsers(req: Request, res: Response) {
    try {
        // Utilisation de .findAll() 
        const utilisateurs = await Utilisateur.findAll();
        res.json(utilisateurs); 
    } catch (err: any) {
        res.status(500).json({ message: 'Erreur interne', error: err.message });
    }
}

export async function modifyUser(req: Request, res: Response) {
    try {
        // Récupérer l'ID de l'utilisateur à modifier
        const { id } = req.params;

        // Valider si l'ID est bien un nombre
        if (isNaN(Number(id))) {
           res.status(400).json({ message: 'L\'ID doit être un nombre valide.' });
           return 
        }

        // Rechercher l'utilisateur par son ID
        const utilisateur = await Utilisateur.findByPk(id);

        // Si l'utilisateur n'existe pas
        if (!utilisateur) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return 
        }

        // Récupérer les nouveaux champs à modifier (nom et email)
        const { nom, email } = req.body;

        // Si un nom est fourni, on le met à jour
        if (nom) {
            if (typeof nom !== 'string' || nom.trim().length === 0) {
                res.status(400).json({ message: 'Le nom doit être une chaîne de caractères non vide.' });
                return 
            }
            utilisateur.nom = nom;
        }

        // Si un email est fourni, on le valide
        if (email) {
            if (typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
               res.status(400).json({ message: 'L\'email est invalide.' });
               return 
            }

            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            const existingEmail = await Utilisateur.findOne({ where: { email } });
            if (existingEmail && existingEmail.id !== utilisateur.id) {
                res.status(400).json({ message: 'L\'email est déjà utilisé par un autre utilisateur.' });
                return 
            }

            utilisateur.email = email;
        }

        // Si aucune donnée n'est fournie pour modification, retourner une erreur
        if (!nom && !email) {
            res.status(400).json({ message: 'Aucune donnée valide à modifier.' });
            return 
        }

        // Sauvegarder les modifications dans la base de données
        await utilisateur.save();

        // Retourner la réponse avec l'utilisateur modifié
        res.json(utilisateur);
    } catch (err: any) {
        // Gestion des erreurs internes
        console.error(err); // Optionnel, pour loguer l'erreur sur le serveur
        res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
    }
}

 export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;

        // Vérification que l'ID est un nombre valide
        if (isNaN(Number(id))) {
            res.status(400).json({ message: 'L\'ID doit être un nombre valide.' });
            return
        }

        // Trouver l'utilisateur avec l'ID
        const utilisateur = await Utilisateur.findByPk(id);

        // Si l'utilisateur n'existe pas, retourner une erreur 404
        if (!utilisateur) {
            res.status(404).json({ message: 'Utilisateur non trouvé.' });
            return
        }

        // Supprimer l'utilisateur de la base de données
        await utilisateur.destroy();

        // Retourner un message de succès
        res.json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (err: any) {
        // Gestion des erreurs internes
        res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
    }
}



export async function searchUsers(req: Request, res: Response) {
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
 const utilisateurs = await sequelize.query(query, {
 replacements: {
 nom: nom ? `%${nom}%` : null, // Recherche partielle insensible à la casse
 email: email ? `%${email}%` : null,
 createdAfter: createdAfter || null,
 },
 type: "SELECT"
 });
 res.json(utilisateurs);
 } catch (error: any) {
 console.error("Erreur lors de la recherche :", error);
 res.status(500).json({ message: error.message });
 }
}