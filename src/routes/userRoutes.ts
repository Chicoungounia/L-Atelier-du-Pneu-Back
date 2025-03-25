import express from 'express';
import { modifierUser, modifierStatusUser, modifierRoleUser, afficherAllUsers, afficherUsersActif, afficherUser, searchUsers } from '../controllers/userController'; // Importation des contrôleurs pour register et login
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { isAdmin } from '../middlewares/verifyAdminMiddleware';

const router = express.Router();


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
 *     summary: Modifier le rôle d'un utilisateur (réservé aux administrateurs)
 *     description: Seuls les administrateurs peuvent modifier le rôle d'un utilisateur.
 *     tags:
 *       - Utilisateurs
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
 * /users/afficher/allactifs:
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
router.get("/afficher/allactifs", verifyTokenMiddleware, afficherUsersActif);

/**
 * @swagger
 * /users/afficher/allusers:
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
router.get("/afficher/allusers", verifyTokenMiddleware, afficherAllUsers);

/**
 * @swagger
 * /users/afficher/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     description: Permet de récupérer les informations d'un utilisateur spécifique en excluant son mot de passe. L'accès est restreint aux utilisateurs authentifiés.
 *     tags: 
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à récupérer
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur récupéré avec succès"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
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
 *                       enum: [Admin, Ouvrier, Employé]
 *                     status:
 *                       type: string
 *                       enum: [Actif, Inactif]
 *       401:
 *         description: Accès refusé, token manquant
 *       403:
 *         description: Accès interdit, token invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/afficher/:id", verifyTokenMiddleware, afficherUser );

/**
 * @swagger
 * /users/recherche:
 *   get:
 *     summary: Recherche des utilisateurs avec des filtres optionnels.
 *     description: Permet de rechercher des utilisateurs par ID, nom, prénom ou email.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur recherché.
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         description: Recherche par nom (partielle et insensible à la casse).
 *       - in: query
 *         name: prenom
 *         schema:
 *           type: string
 *         description: Recherche par prénom (partielle et insensible à la casse).
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Recherche par email (partielle et insensible à la casse).
 *     responses:
 *       200:
 *         description: Liste des utilisateurs correspondant aux filtres.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nom:
 *                     type: string
 *                     example: Dupont
 *                   prenom:
 *                     type: string
 *                     example: Jean
 *                   email:
 *                     type: string
 *                     example: jean.dupont@example.com
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get("/recherche", verifyTokenMiddleware, searchUsers);


export default router;
