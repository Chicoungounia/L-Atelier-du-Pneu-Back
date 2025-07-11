import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/pwdUtils';
import { generateToken } from '../utils/JWTUtils';
import { User } from '../models/userModels';

export async function register(req: Request, res: Response) {
    try {
        const { nom, prenom, email, password } = req.body;

        if (!nom || !prenom || !email || !password) {
            res.status(400).json({ message: "Veuillez remplir tous les champs requis." });
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
            email,
            hashedpassword: await hashPassword(password),
            speudo: ''
        });

        const { hashedpassword, ...userWithoutPassword } = newUser.toJSON();
        console.log("Utilisateur créé :", userWithoutPassword);
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: userWithoutPassword
          });
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
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
        return;
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

export async function logout(req: Request, res: Response) {
    try {
        // Supprimer le cookie JWT en le remplaçant par un cookie vide avec une expiration immédiate
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });
        
        res.status(200).json({ message: "Déconnexion réussie" });
        return;
    } catch (err: any) {
        res.status(500).json({ message: "Erreur lors de la déconnexion", error: err.message });
        return;
    }
}



