import { Request, Response } from 'express';
import { verifyToken } from '../utilis/JWTUtils';
import { User } from '../models/userModels';
import sequelize from '../config/database';


export async function modifierUser(req: Request, res: Response) {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            res.status(401).json({ message: "Accès refusé, token manquant" });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === "string" || decoded.role !== "Admin") {
            res.status(403).json({ message: "Accès interdit, seuls les administrateurs peuvent modifier un utilisateur" });
            return;
        }

        const userId = req.params.id;
        const { nom, prenom, speudo, email, role, status } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return;
        }

        await user.update({ nom, prenom, speudo, email, role, status });
        res.status(200).json({ message: "Utilisateur mis à jour avec succès", user });
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
}

export async function modifierStatusUser(req: Request, res: Response) {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            res.status(401).json({ message: "Accès refusé, token manquant" });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === "string" || decoded.role !== "Admin") {
            res.status(403).json({ message: "Accès interdit, seuls les administrateurs peuvent modifier le statut d'un utilisateur" });
            return;
        }

        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return;
        }

        // Alternance du statut
        const newStatus = user.status === "Actif" ? "Inactif" : "Actif";
        await user.update({ status: newStatus });

        res.status(200).json({ message: `Statut modifié avec succès : ${newStatus}`, user });
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
}


export async function modifierRoleUser(req: Request, res: Response) {
    try {
        // Vérification du token JWT
        const token = req.cookies?.jwt;
        if (!token) {
            res.status(401).json({ message: "Accès refusé, token manquant" });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === "string" || decoded.role !== "Admin") {
            res.status(403).json({ message: "Accès interdit, seuls les administrateurs peuvent modifier le rôle d'un utilisateur" });
            return;
        }

        // Récupération des paramètres et du body
        const userId = req.params.id;
        const { role } = req.body;

        console.log("Role reçu :", role); // Debug

        // Vérification du rôle
        const validRoles = ["Admin", "Ouvrier", "Employé"];
        if (typeof role !== "string" || !validRoles.includes(role.trim())) {
            res.status(400).json({ message: `Le rôle doit être l'un des suivants : ${validRoles.join(", ")}` });
            return;
        }

        // Vérification de l'existence de l'utilisateur
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return;
        }

        // Mise à jour du rôle avec récupération directe de l'utilisateur mis à jour
        const [updatedRows, updatedUsers] = await User.update(
            { role: role.trim() as "Admin" | "Ouvrier" | "Employé" },
            { where: { id: userId }, returning: true, logging: console.log }
        );

        if (updatedRows === 0) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du rôle" });
            return;
        }

        const updatedUser = updatedUsers[0]; // L'utilisateur mis à jour

        console.log("Utilisateur mis à jour :", updatedUser);

        res.status(200).json({ message: `Rôle modifié avec succès : ${role}`, user: updatedUser });
        return;

    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur interne du serveur", error });
        return;
    }
}

export async function afficherUser(req: Request, res: Response) {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            res.status(401).json({ message: "Accès refusé, token manquant" });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === "string") {
            res.status(403).json({ message: "Accès interdit, token invalide" });
            return;
        }

        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ["hashedpassword"] },
        });

        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé" });
            return;
        }

        res.status(200).json({ message: "Utilisateur récupéré avec succès", user });
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
}


export async function afficherAllUsers(req: Request, res: Response) {
    try {
        // Vérification du token JWT
        const token = req.cookies?.jwt;
        if (!token) {
            res.status(401).json({ message: "Accès refusé, token manquant" });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === "string") {
            res.status(403).json({ message: "Accès interdit, token invalide" });
            return;
        }

        // Récupération de tous les utilisateurs
        const users = await User.findAll({
            attributes: { exclude: ["hashedpassword"] }, // Exclure le mot de passe
        });

        res.status(200).json({ message: "Liste des utilisateurs récupérée avec succès", users });
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
}


export async function afficherUsersActif(req: Request, res: Response) {
    try {
        // Vérification du token JWT
        const token = req.cookies?.jwt;
        if (!token) {
            res.status(401).json({ message: "Accès refusé, token manquant" });
            return;
        }

        const decoded = verifyToken(token);
        if (!decoded || typeof decoded === "string") {
            res.status(403).json({ message: "Accès interdit, token invalide" });
            return;
        }

        // Récupération des utilisateurs actifs
        const users = await User.findAll({
            where: { status: "Actif" },
            attributes: { exclude: ["hashedpassword"] }, // Exclure le mot de passe
        });

        res.status(200).json({ message: "Liste des utilisateurs actifs récupérée avec succès", users });
    } catch (error) {
        res.status(500).json({ message: "Erreur interne du serveur", error });
    }
}

export async function searchUsers(req: Request, res: Response) {
    try {
        const { id, nom, prenom, email } = req.query;

        // Création d'une requête SQL dynamique avec filtres optionnels
        const query = `
        SELECT id, nom, prenom, email
        FROM users
        WHERE
        (:id IS NULL OR id = :id) AND
        (:nom IS NULL OR nom ILIKE :nom) AND
        (:prenom IS NULL OR prenom ILIKE :prenom) AND
        (:email IS NULL OR email ILIKE :email)
        ORDER BY nom ASC;
        `;

        // Exécution sécurisée avec les valeurs des paramètres
        const utilisateurs = await sequelize.query(query, {
            replacements: {
                id: id ? Number(id) : null,
                nom: nom ? `%${nom}%` : null,
                prenom: prenom ? `%${prenom}%` : null,
                email: email ? `%${email}%` : null,
            },
            type: "SELECT"
        });

        res.json(utilisateurs);
    } catch (error: any) {
        console.error("Erreur lors de la recherche :", error);
        res.status(500).json({ message: error.message });
    }
}



