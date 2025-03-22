import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utilis/pwdUtils';
import { generateToken } from '../utilis/JWTUtils';
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

export async function modifierPassword(req: Request, res: Response) {
    try {
        const userId = req.user?.id; // Récupération de l'ID utilisateur depuis le token
        const { ancienPassword, nouveauPassword } = req.body;

        if (!ancienPassword || !nouveauPassword) {
            res.status(400).json({ message: "Veuillez fournir l'ancien et le nouveau mot de passe." });
            return;
        }

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "Utilisateur non trouvé." });
            return;
        }

        const isPasswordValid = await verifyPassword(ancienPassword, user.hashedpassword);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Ancien mot de passe incorrect." });
            return;
        }

        user.hashedpassword = await hashPassword(nouveauPassword);
        await user.save();

        res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
        return;
    }
}



