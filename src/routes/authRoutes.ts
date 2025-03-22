import express from 'express';
import { login, modifierPassword, register } from '../controllers/authController';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec le rôle par défaut "Employé".
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - speudo
 *               - email
 *               - password
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Dupont"
 *               prenom:
 *                 type: string
 *                 example: "Jean"
 *               speudo:
 *                 type: string
 *                 example: "jdupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Motdepasse123!"
 *               status:
 *                 type: string
 *                 enum: ["Actif", "Inactif"]
 *                 default: "Actif"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nom:
 *                   type: string
 *                   example: "Dupont"
 *                 prenom:
 *                   type: string
 *                   example: "Jean"
 *                 speudo:
 *                   type: string
 *                   example: "jdupont"
 *                 email:
 *                   type: string
 *                   example: "jean.dupont@example.com"
 *                 role:
 *                   type: string
 *                   example: "Employé"
 *                 status:
 *                   type: string
 *                   example: "Actif"
 *       400:
 *         description: Requête invalide (champs manquants, utilisateur existant...).
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentifie un utilisateur et retourne un token JWT
 *     tags: 
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsIn..."
 *       400:
 *         description: Requête invalide, champs manquants.
 *       401:
 *         description: Mot de passe incorrect.
 *       403:
 *         description: Compte inactif.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/login', login);

/**
* @swagger
* /auth/modifier/password:
*   put:
*     summary: Modifier le mot de passe de l'utilisateur connecté
*     description: Permet à un utilisateur authentifié de modifier son mot de passe.
*     tags:
*       - Authentification
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - ancienPassword
*               - nouveauPassword
*             properties:
*               ancienPassword:
*                 type: string
*                 description: L'ancien mot de passe de l'utilisateur.
*               nouveauPassword:
*                 type: string
*                 description: Le nouveau mot de passe souhaité.
*     responses:
*       200:
*         description: Mot de passe mis à jour avec succès.
*       400:
*         description: Requête invalide (mot de passe manquant).
*       401:
*         description: Ancien mot de passe incorrect ou utilisateur non authentifié.
*       404:
*         description: Utilisateur non trouvé.
*       500:
*         description: Erreur interne du serveur.
*/
router.put('/modifier/password', verifyTokenMiddleware, modifierPassword);



export default router;
