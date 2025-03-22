import express from 'express';
import { afficherAllPrestations, afficherStatusAllTruePrestation, ajouterPrestation, modifierPrestation } from '../controllers/prestationController';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { isAdmin } from '../middlewares/verifyAdminMiddleware';

const router = express.Router();

/**
 * @swagger
 * /prestation/ajouter:
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
 *             type: object
 *             required:
 *               - travail
 *               - description
 *               - prix
 *             properties:
 *               travail:
 *                 type: string
 *                 example: "Montage de pneus"
 *               description:
 *                 type: string
 *                 example: "Montage de quatre pneus neufs sur jantes."
 *               prix:
 *                 type: number
 *                 example: 50.00
 *     responses:
 *       201:
 *         description: Prestation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 travail:
 *                   type: string
 *                   example: "Montage de pneus"
 *                 description:
 *                   type: string
 *                   example: "Montage de quatre pneus neufs sur jantes."
 *                 prix:
 *                   type: number
 *                   example: 50.00
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-16T10:20:30Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-16T10:20:30Z"
 *       400:
 *         description: Erreur de validation des données (champs obligatoires manquants)
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/ajouter',verifyTokenMiddleware, isAdmin, ajouterPrestation);

/**
 * @swagger
 * /prestation/modifier/{id}:
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
 *             type: object
 *             properties:
 *               travail:
 *                 type: string
 *                 example: "Réparation de pneu"
 *               description:
 *                 type: string
 *                 example: "Réparation rapide d'une crevaison"
 *               prix:
 *                 type: number
 *                 format: float
 *                 example: 19.99
 *               status:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Prestation modifiée avec succès.
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
router.put("/modifier/:id",verifyTokenMiddleware, isAdmin, modifierPrestation);

/**
 * @swagger
 * /prestations/affichet/status/true:
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
 *                   prix:
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
router.get("/affichet/status/true", afficherStatusAllTruePrestation);

/**
 * @swagger
 * /prestation/afficher/all:
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
 *                   prix:
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
router.get("/afficher/all", verifyTokenMiddleware, isAdmin, afficherAllPrestations)




export default router;
