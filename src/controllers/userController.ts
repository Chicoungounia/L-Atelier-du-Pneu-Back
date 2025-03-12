import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utilis/pwdUtils';
import { generateToken } from '../utilis/JWTUtils';
import { User } from '../models/userModels';

export async function register(req:Request, res:Response) {
    try {
        const{first_name,surname,email,password} = req.body;
        if (!first_name || !surname || !email || !password) {
            res.status(400).json({message: "Veuillez remplir tous les champs"});
            return;

    }
    const user = await User.create({
        first_name,
        surname,
        email,
        hashedpassword : await hashPassword(password),
    });
    res.status(201).json(user);
    }catch (err:any) {
        if(err.code===11000){
            res.status(400).json({message: 'Cet utilisateur existe déjà !'});
            return 
        }
    res.status(500).json({message: "Erreur Interne", error: err.message});
    }
}

export async function login(req:Request, res:Response) {
    const{email,password} = req.body;
    try {
        if ( !email || !password) {
            res.status(400).json({message: "Veuillez remplir tous les champs"});
            return;
        }

        const user= await  User.findOne({ where: { email } });
        if(!user){
            res.status(404).json({message: 'Utilisateur non trouvé'});
            return;
        }

    const isPasswordValid= await verifyPassword(password, user.hashedpassword);
    if(!isPasswordValid){
        res.status(401).json({message: 'Mot de passe incorrect'});
        return 
    }
    const token = generateToken({id:user.id,email:user.email});
            res.cookie("jwt", token, {httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production"});
            res.status(200).json({message: 'Connexion réussie'});
    return

    }catch (err:any) {
    res.status(500).json({message: "Erreur Interne", error: err.message});
    return
    }
} 