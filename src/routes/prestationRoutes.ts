import express from 'express';
import { ajouterPrestation, deletePrestation, modifierPrestation } from '../controllers/prestationController';

const router = express.Router();

/**
 * @swagger
 * /prestation/ajouter:
 *   post:
 *     summary: Ajouter une nouvelle prestation
 *     description: Crée une nouvelle prestation avec les données fournies.
 *     tags:
 *       - Prestations
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
router.post('/ajouter', ajouterPrestation);

/**
 * @swagger
 * /prestation/modifier/{id}:
 *   put:
 *     summary: Modifier une prestation existante
 *     description: Met à jour une prestation avec les champs fournis. Les champs non envoyés ne seront pas modifiés.
 *     tags:
 *       - Prestations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la prestation à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travail:
 *                 type: string
 *                 example: "Montage équilibrage"
 *               description:
 *                 type: string
 *                 example: "Montage et équilibrage de pneus neufs"
 *               prix:
 *                 type: number
 *                 example: 60.00
 *     responses:
 *       200:
 *         description: Prestation mise à jour avec succès
 *       400:
 *         description: Erreur de validation des données
 *       404:
 *         description: Prestation non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/modifier/:id", modifierPrestation);

/**
 * @swagger
 * /prestation/supprimer/{id}:
 *   delete:
 *     summary: Supprimer une prestation
 *     description: Supprime une prestation existante en fonction de son ID.
 *     tags:
 *       - Prestations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la prestation à supprimer
 *     responses:
 *       200:
 *         description: Prestation supprimée avec succès
 *       404:
 *         description: Prestation non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/supprimer/:id", deletePrestation);

export default router;
