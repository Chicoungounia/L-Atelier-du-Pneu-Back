import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utilis/pwdUtils';
import { generateToken, verifyToken } from '../utilis/JWTUtils';
import { User } from '../models/userModels';

export async function register(req: Request, res: Response) {
    try {
        const { nom, prenom, speudo, email, password, role, status } = req.body;

        if (!nom || !prenom || !speudo || !email || !password) {
            res.status(400).json({ message: "Veuillez remplir tous les champs requis." });
            return;
        }

        const validRoles = ["Admin", "Ouvrier", "Employé"];
        if (role && !validRoles.includes(role)) {
            res.status(400).json({ message: `Le rôle doit être l'un des suivants : ${validRoles.join(", ")}` });
            return;
        }

        const validStatus = ["Actif", "Inactif"];
        if (status && !validStatus.includes(status)) {
            res.status(400).json({ message: "Le statut doit être 'Actif' ou 'Inactif'." });
            return;
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Cet utilisateur existe déjà !" });
            return;
        }

        const newUser = await User.create({
            nom,
            prenom,
            speudo,
            email,
            role: role || "Employé",
            status: status || "Actif", // Valeur par défaut
            hashedpassword: await hashPassword(password),
        });

        const { hashedpassword, ...userWithoutPassword } = newUser.toJSON();
        res.status(201).json(userWithoutPassword);
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
        return;
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Veuillez remplir tous les champs." });
            return;
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé." });
            return;
        }

        if (user.status === "Inactif") {
            res.status(403).json({ message: "Compte inactif. Veuillez contacter l'administrateur." });
            return;
        }

        const isPasswordValid = await verifyPassword(password, user.hashedpassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Mot de passe incorrect." });
            return;
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
        res.status(200).json({ message: "Connexion réussie", token });
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
    }
}

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


