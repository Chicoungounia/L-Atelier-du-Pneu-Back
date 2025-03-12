import express from 'express';
import { register, login } from '../controllers/userController'; // Importation des contrôleurs pour register et login

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Permet de créer un nouvel utilisateur avec un mot de passe haché.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - first_name
 *               - surname
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: L'utilisateur a été créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 first_name:
 *                   type: string
 *                 surname:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: L'utilisateur existe déjà ou des champs sont manquants
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/register', register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     description: Permet à un utilisateur de se connecter avec son email et son mot de passe.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie, un token JWT est renvoyé
 *       400:
 *         description: L'email ou le mot de passe sont manquants
 *       401:
 *         description: Le mot de passe est incorrect
 *       404:
 *         description: L'utilisateur n'a pas été trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/login', login);

export default router;
