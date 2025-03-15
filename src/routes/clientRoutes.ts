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
 *                 example: "Dupont"
 *               prenom:
 *                 type: string
 *                 description: Prénom du client (optionnel)
 *                 example: "Jean"
 *               adresse:
 *                 type: string
 *                 description: Adresse du client
 *                 example: "12 rue des Fleurs, 75000 Paris"
 *               email:
 *                 type: string
 *                 description: Email du client (optionnel)
 *                 example: "jean.dupont@example.com"
 *               telephone:
 *                 type: string
 *                 description: Numéro de téléphone du client (optionnel)
 *                 example: "+33612345678"
 *               status:
 *                 type: string
 *                 enum: ["privé", "professionnel"]
 *                 description: Statut du client
 *                 example: "privé"
 *     responses:
 *       201:
 *         description: Client ajouté avec succès
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
 *                 adresse:
 *                   type: string
 *                   example: "12 rue des Fleurs, 75000 Paris"
 *                 email:
 *                   type: string
 *                   example: "jean.dupont@example.com"
 *                 telephone:
 *                   type: string
 *                   example: "+33612345678"
 *                 status:
 *                   type: string
 *                   example: "privé"
 *       400:
 *         description: Requête invalide (champs requis manquants ou erreur de validation)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Veuillez remplir tous les champs requis."
 *       401:
 *         description: Non autorisé (problème d'authentification)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Accès non autorisé. Veuillez vous authentifier."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur interne du serveur. Veuillez réessayer plus tard."
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
 *       201:
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
