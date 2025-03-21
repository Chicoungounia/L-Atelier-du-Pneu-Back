import express from 'express';
import { register, login, modifierUser, modifierStatusUser, modifierRoleUser, afficherAllUsers, afficherUsersActif } from '../controllers/userController'; // Importation des contrôleurs pour register et login
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { isAdmin } from '../middlewares/verifyAdminMiddleware';

const router = express.Router();

/**
 * @swagger
 * /users/register:
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
 * /users/login:
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
 * /users/modifier/{id}:
 *   put:
 *     summary: Modifier un utilisateur (réservé aux administrateurs)
 *     tags: 
 *       - Utilisateurs
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               role:
 *                 type: string
 *                 enum: ["Admin", "Ouvrier", "Employé"]
 *                 example: "Ouvrier"
 *               status:
 *                 type: string
 *                 enum: ["Actif", "Inactif"]
 *                 example: "Actif"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès.
 *       400:
 *         description: Requête invalide.
 *       401:
 *         description: Accès refusé, token manquant.
 *       403:
 *         description: Accès interdit, seuls les administrateurs peuvent modifier un utilisateur.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.put("/modifier/:id", verifyTokenMiddleware, isAdmin, modifierUser);

/**
 * @swagger
 * /users/modifier/status/{id}:
 *   put:
 *     summary: Modifier le statut d'un utilisateur (Actif/Inactif) (réservé aux administrateurs)
 *     description: Seuls les administrateurs peuvent modifier le statut d'un utilisateur.
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à modifier
 *     responses:
 *       200:
 *         description: Statut modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Accès refusé, token manquant
 *       403:
 *         description: Accès interdit, seuls les administrateurs peuvent modifier le statut
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/modifier/status/:id",verifyTokenMiddleware, isAdmin, modifierStatusUser);

/**
 * @swagger
 * /users/modifier/role/{id}:
 *   put:
 *     summary: Modifier le rôle d'un utilisateur
 *     description: Seuls les administrateurs peuvent modifier le rôle d'un utilisateur.
 *     tags: [Utilisateurs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur dont le rôle doit être modifié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ["Admin", "Ouvrier", "Employé"]
 *                 description: Le nouveau rôle de l'utilisateur.
 *     responses:
 *       200:
 *         description: Rôle modifié avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nom:
 *                       type: string
 *                     prenom:
 *                       type: string
 *                     speudo:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Requête invalide (ex. rôle invalide).
 *       401:
 *         description: Accès refusé, token manquant.
 *       403:
 *         description: Accès interdit, seul un administrateur peut modifier le rôle.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.put("/modifier/role/:id",verifyTokenMiddleware, isAdmin, modifierRoleUser);

/**
 * @swagger
 * /users/afficher/all:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Renvoie la liste complète des utilisateurs enregistrés (nécessite une authentification via token JWT).
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Liste des utilisateurs récupérée avec succès"
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nom:
 *                         type: string
 *                         example: "Dupont"
 *                       prenom:
 *                         type: string
 *                         example: "Jean"
 *                       speudo:
 *                         type: string
 *                         example: "jdupont"
 *                       email:
 *                         type: string
 *                         example: "jean.dupont@example.com"
 *                       role:
 *                         type: string
 *                         example: "Employé"
 *                       status:
 *                         type: string
 *                         example: "Actif"
 *       401:
 *         description: Accès refusé, token manquant
 *       403:
 *         description: Accès interdit, token invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/afficher/all", verifyTokenMiddleware, afficherAllUsers )

/**
 * @swagger
 * /users/afficher/actifs:
 *   get:
 *     summary: Récupérer tous les utilisateurs actifs
 *     description: Renvoie la liste des utilisateurs ayant le statut "Actif" (nécessite une authentification via token JWT).
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs actifs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Liste des utilisateurs actifs récupérée avec succès"
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nom:
 *                         type: string
 *                         example: "Dupont"
 *                       prenom:
 *                         type: string
 *                         example: "Jean"
 *                       speudo:
 *                         type: string
 *                         example: "jdupont"
 *                       email:
 *                         type: string
 *                         example: "jean.dupont@example.com"
 *                       role:
 *                         type: string
 *                         example: "Employé"
 *                       status:
 *                         type: string
 *                         example: "Actif"
 *       401:
 *         description: Accès refusé, token manquant
 *       403:
 *         description: Accès interdit, token invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/afficher/actifs", afficherUsersActif);

export default router;
