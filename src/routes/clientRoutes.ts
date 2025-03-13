import express from 'express';
import { ajouterClient, deleteClient, modifierClient } from '../controllers/clientController';

const router = express.Router();

/**
 * @swagger
 * /clients/ajouter:
 *   post:
 *     summary: Ajouter un nouveau client
 *     description: Crée un nouveau client avec les informations fournies.
 *     tags:
 *       - Clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - status
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom du client
 *               prenom:
 *                 type: string
 *                 description: Prénom du client (optionnel)
 *               adresse:
 *                 type: string
 *                 description: Adresse du client
 *               email:
 *                 type: string
 *                 description: Email du client (optionnel)
 *               telephone:
 *                 type: string
 *                 description: Numéro de téléphone du client (optionnel)
 *               status:
 *                 type: string
 *                 enum: ["privé", "professionnel"]
 *                 description: Statut du client
 *     responses:
 *       201:
 *         description: Client ajouté avec succès
 *       400:
 *         description: Requête invalide (champs requis manquants)
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/ajouter', ajouterClient);

/**
 * @swagger
 * /clients/modifier/{id}:
 *   put:
 *     summary: Modifier un client existant
 *     description: Met à jour les informations d'un client en fonction de son ID.
 *     tags: 
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du client à modifier.
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
 *                 description: Nom du client
 *                 example: "Dupont"
 *               prenom:
 *                 type: string
 *                 description: Prénom du client
 *                 example: "Jean"
 *               adresse:
 *                 type: string
 *                 description: Adresse du client
 *                 example: "12 rue de Paris"
 *               email:
 *                 type: string
 *                 description: Email du client
 *                 example: "jean.dupont@email.com"
 *               telephone:
 *                 type: string
 *                 description: Numéro de téléphone du client
 *                 example: "0612345678"
 *               status:
 *                 type: string
 *                 enum: ["privé", "professionnel"]
 *                 description: Statut du client
 *                 example: "professionnel"
 *     responses:
 *       200:
 *         description: Client modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Client modifié avec succès"
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Requête invalide (champs requis manquants ou ID invalide)
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/modifier/:id', modifierClient);

/**
 * @swagger
 * /clients/supprimer/{id}:
 *   delete:
 *     summary: Supprime un client
 *     description: Supprime un client existant par son ID.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du client à supprimer
 *     responses:
 *       200:
 *         description: Client supprimé avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: "Client supprimé avec succès"
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             example:
 *               message: "ID invalide"
 *       404:
 *         description: Client non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Client non trouvé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur interne du serveur"
 */
router.delete('/supprimer/:id', deleteClient);

export default router;
