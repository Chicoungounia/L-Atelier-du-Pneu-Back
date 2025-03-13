import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utilis/pwdUtils';
import { generateToken } from '../utilis/JWTUtils';
import { User } from '../models/userModels';

export async function register(req: Request, res: Response) {
    try {
        const { nom, prenom, speudo, email, password } = req.body;

        // Vérification des champs obligatoires
        if (!nom || !prenom || !speudo || !email || !password) {
            res.status(400).json({ message: "Veuillez remplir tous les champs requis." });
            return 
        }

        // Vérification de l'existence de l'utilisateur
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Cet utilisateur existe déjà !" });
            return 
        }

        // Création de l'utilisateur
        const newUser = await User.create({
            nom,
            prenom,
            speudo,
            email,
            hashedpassword: await hashPassword(password), // Hash du mot de passe
        });

        // Suppression du hashedpassword dans la réponse pour la sécurité
        const { hashedpassword, ...userWithoutPassword } = newUser.toJSON();

        res.status(201).json(userWithoutPassword);
        return 

    } catch (err: any) {
        console.error("Erreur lors de l'inscription :", err);

        if (err.name === "SequelizeValidationError") {
            res.status(400).json({ message: "Données invalides", errors: err.errors.map((e: any) => e.message) });
            return 
        }

        if (err.name === "SequelizeUniqueConstraintError") {
           res.status(400).json({ message: "Cet email est déjà utilisé." });
           return 
        }

       res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
       return 
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // Vérification des champs obligatoires
        if (!email || !password) {
            res.status(400).json({ message: "Veuillez remplir tous les champs." });
            return 
        }

        // Vérification si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
           res.status(404).json({ message: "Utilisateur non trouvé." });
           return 
        }

        // Vérification du mot de passe
        const isPasswordValid = await verifyPassword(password, user.hashedpassword);
        if (!isPasswordValid) {
           res.status(401).json({ message: "Mot de passe incorrect." });
           return 
        }

        // Génération du token JWT
        const token = generateToken({ id: user.id, email: user.email });

        // Configuration du cookie sécurisé
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

    res.status(200).json({ message: "Connexion réussie", token });
    return 

    } catch (err: any) {
        console.error("Erreur lors de la connexion :", err);

        if (err.name === "SequelizeDatabaseError") {
          res.status(500).json({ message: "Erreur de base de données", error: err.message });
          return 
        }

        if (err.name === "SequelizeConnectionError") {
           res.status(500).json({ message: "Problème de connexion à la base de données", error: err.message });
           return 
        }

       res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
       return 
    }
}