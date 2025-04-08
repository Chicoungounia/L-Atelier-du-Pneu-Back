import express from 'express';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { isAdmin } from '../middlewares/verifyAdminMiddleware';
import { afficherAllPrestations, afficherPrestation, afficherStatusAllTruePrestation, ajouterPrestation, modifierPrestation, modifierStatusPrestation } from '../controllers/prestationController';

const router = express.Router();

/**
 * @swagger
 * /prestation/ajouter/:
 *   post:
 *     summary: Ajouter une nouvelle prestation
 *     description: Crée une nouvelle prestation avec les données fournies.
 *     tags:
 *       - Prestations
 *     security:
 *       - cookieAuth: []  # Utilisation d'un token JWT pour authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Prestation"
 *     responses:
 *       201:
 *         description: Prestation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Prestation"
 *       400:
 *         description: Erreur de validation des données (champs obligatoires manquants)
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/ajouter/', verifyTokenMiddleware, isAdmin, ajouterPrestation);

/**
 * @swagger
 * /prestation/modifier/one/{id}:
 *   put:
 *     summary: Modifier une prestation (Admin uniquement)
 *     description: Met à jour les informations d'une prestation existante, y compris son statut.
 *     tags:
 *       - Prestations
 *     security:
 *       - cookieAuth: []  # Utilisation d'un token JWT pour authentification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la prestation à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Prestation"
 *     responses:
 *       200:
 *         description: Prestation modifiée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Prestation"
 *       400:
 *         description: Requête invalide.
 *       401:
 *         description: Non autorisé, connexion requise.
 *       403:
 *         description: Accès interdit, rôle Admin requis.
 *       404:
 *         description: Prestation non trouvée.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.put("/modifier/one/:id",verifyTokenMiddleware, isAdmin, modifierPrestation);

/**
 * @swagger
 * /prestation/modifier/status/{id}:
 *   put:
 *     summary: Inverser le statut d'une prestation
 *     description: Change le statut d'une prestation de `true` à `false` ou inversement.
 *     tags:
 *       - Prestations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la prestation à mettre à jour
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statut de la prestation modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Statut de la prestation mis à jour avec succès"
 *                 prestation:
 *                   $ref: "#/components/schemas/Prestation"
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID invalide"
 *       404:
 *         description: Prestation non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Prestation non trouvée"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.put("/modifier/status/:id",verifyTokenMiddleware, isAdmin, modifierStatusPrestation);


/**
 * @swagger
 * /prestations/afficher/tous:
 *   get:
 *     summary: Récupère toutes les prestations
 *     description: Retourne la liste de toutes les prestations disponibles.
 *     tags:
 *       - Prestations
 *     security:
 *       - cookieAuth: []  # Utilisation d'un token JWT pour authentification
 *     responses:
 *       200:
 *         description: Liste des prestations récupérée avec succès.
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
 *                   travail:
 *                     type: string
 *                     example: "Changement de pneus"
 *                   description:
 *                     type: string
 *                     example: "Remplacement des pneus avant et arrière"
 *                   prix_htva:
 *                     type: number
 *                     format: float
 *                     example: 49.99
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get("/afficher/tous", verifyTokenMiddleware, afficherAllPrestations)

/**
 * @swagger
 * /prestation/afficher/actif:
 *   get:
 *     summary: Récupérer toutes les prestations actives
 *     description: Retourne la liste des prestations ayant un statut actif (status = true).
 *     tags:
 *       - Prestations
 *     responses:
 *       200:
 *         description: Liste des prestations actives récupérée avec succès.
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
 *                   travail:
 *                     type: string
 *                     example: "Changement de pneu"
 *                   description:
 *                     type: string
 *                     example: "Remplacement de pneu pour voiture"
 *                   prix_htva:
 *                     type: number
 *                     format: float
 *                     example: 50.00
 *                   status:
 *                     type: boolean
 *                     example: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erreur serveur lors de la récupération des prestations actives.
 */
router.get("/afficher/actif", verifyTokenMiddleware, afficherStatusAllTruePrestation);


/**
 * @swagger
 * /prestation/afficher/one/{id}:
 *   get:
 *     summary: Récupérer une prestation par son ID
 *     description: Retourne les détails d'une prestation spécifique.
 *     tags:
 *       - Prestations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la prestation à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prestation récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Prestation récupérée avec succès"
 *                 prestation:
 *                   $ref: "#/components/schemas/Prestation"
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID invalide"
 *       404:
 *         description: Prestation non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Prestation non trouvée"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 */
router.get("/afficher/one/:id",verifyTokenMiddleware, afficherPrestation);



export default router;
