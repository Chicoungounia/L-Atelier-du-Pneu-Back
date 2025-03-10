"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un utilisateur
 *     description: Ajoute un nouvel utilisateur avec son nom et son email.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "dupont@example.com"
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
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
 *                 email:
 *                   type: string
 *                   example: "dupont@example.com"
 *       500:
 *         description: Erreur serveur
 */
router.post("/", userController_1.createUser);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Récupère une liste de tous les utilisateurs.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
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
 *                     example: "Dupont"
 *                   email:
 *                     type: string
 *                     example: "dupont@example.com"
 *       500:
 *         description: Erreur serveur
 */
router.get("/", userController_1.getAllUsers); // Route pour récupérer tous les utilisateurs
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Modifier un utilisateur
 *     description: Modifie les informations d'un utilisateur, comme son nom ou son email.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur à modifier.
 *         schema:
 *           type: integer
 *           example: 1
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "dupont@example.com"
 *             required:
 *               - nom
 *               - email
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès
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
 *                 email:
 *                   type: string
 *                   example: "dupont@example.com"
 *       400:
 *         description: Données invalides ou non fournies
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:id", userController_1.modifyUser);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Supprime un utilisateur en fonction de son ID.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID de l'utilisateur à supprimer.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur supprimé avec succès."
 *       400:
 *         description: L'ID fourni n'est pas valide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", userController_1.deleteUser);
/**
* @swagger
* /users/searchUsers:
*   get:
*     summary: Recherche avancée d'utilisateurs
*     description: Recherche un utilisateur en fonction du nom, de l'email et de la date de création.
*     tags:
*       - Utilisateurs
*     parameters:
*       - in: query
*         name: nom
*         schema:
*           type: string
*         description: Nom de l'utilisateur (recherche partielle insensible à la casse).
*       - in: query
*         name: email
*         schema:
*           type: string
*         description: Email de l'utilisateur (recherche partielle insensible à la casse).
*     responses:
*       200:
*         description: Liste des utilisateurs correspondant aux critères
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
*                     example: "Dupont"
*                   email:
*                     type: string
*                     format: email
*                     example: "dupont@example.com"
*                   createdAt:
*                     type: string
*                     format: date-time
*                     example: "2024-02-15T10:30:00.000Z"
*       500:
*         description: Erreur serveur
*/
router.get('/searchUsers', userController_1.searchUsers);
exports.default = router;
