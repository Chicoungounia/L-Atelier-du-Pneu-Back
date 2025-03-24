import express from 'express';
import { afficherAllClients, afficherClientsActifs, afficherUnClient, ajouterClient, modifierClient, modifierStatusClient, searchClient } from '../controllers/clientController';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware';

const router = express.Router();

/**
 * @swagger
 * /clients/ajouter:
 *   post:
 *     summary: Ajouter un nouveau client
 *     description: Crée un nouveau client dans la base de données. Nécessite une authentification avec un token JWT.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - type
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Dupont"
 *               prenom:
 *                 type: string
 *                 example: "Jean"
 *               adresse:
 *                 type: string
 *                 example: "12 rue des Fleurs, 75000 Paris"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@example.com"
 *               telephone:
 *                 type: string
 *                 example: "0601020304"
 *               type:
 *                 type: string
 *                 enum: ["Privé", "Professionnel"]
 *                 example: "privé"
 *     responses:
 *       201:
 *         description: Client ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Client ajouté avec succès"
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Requête invalide (données manquantes ou incorrectes)
 *       401:
 *         description: Non autorisé (JWT manquant ou invalide)
 *       500:
 *         description: Erreur interne du serveur
 */

router.post('/ajouter',verifyTokenMiddleware, ajouterClient);

/**
 * @swagger
 * /clients/modifier/{id}:
 *   put:
 *     summary: Modifier un client existant
 *     description: Met à jour les informations d'un client. Nécessite une authentification avec un token JWT.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du client à modifier
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
 *               adresse:
 *                 type: string
 *                 example: "12 rue des Fleurs, 75000 Paris"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@example.com"
 *               telephone:
 *                 type: string
 *                 example: "0601020304"
 *               type:
 *                 type: string
 *                 enum: ["Privé", "Rrofessionnel"]
 *                 example: "professionnel"
 *               status:
 *                 type: string
 *                 enum: ["Actif", "Inactif"]
 *                 example: "Actif"
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
 *         description: ID invalide ou requête incorrecte
 *       401:
 *         description: Non autorisé (JWT manquant ou invalide)
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/modifier/:id',verifyTokenMiddleware, modifierClient);

/**
 * @swagger
 * /clients/modifier/status/{id}:
 *   put:
 *     summary: Modifier uniquement le statut d'un client
 *     description: Permet de mettre à jour uniquement le statut d'un client existant (Actif/Inactif). Nécessite une authentification avec un token JWT.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du client à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Actif", "Inactif"]
 *                 example: "Inactif"
 *     responses:
 *       200:
 *         description: Statut du client modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Statut du client modifié avec succès"
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Requête invalide (ID ou statut incorrect)
 *       401:
 *         description: Non autorisé (JWT manquant ou invalide)
 *       404:
 *         description: Client non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/modifier/status/:id',verifyTokenMiddleware, modifierStatusClient);

/**
 * @swagger
 * /clients/afficher/actifs:
 *   get:
 *     summary: Récupérer la liste des clients actifs
 *     description: Permet d'afficher uniquement les clients ayant le statut "Actif". Nécessite une authentification avec un token JWT.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients actifs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Liste des clients actifs récupérée avec succès"
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/afficher/actifs', verifyTokenMiddleware, afficherClientsActifs);

/**
 * @swagger
 * /clients/afficher/all:
 *   get:
 *     summary: Récupérer tous les clients
 *     description: Récupère la liste complète des clients enregistrés. Nécessite une authentification avec un token JWT.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Liste des clients récupérée avec succès"
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/afficher/all', verifyTokenMiddleware, afficherAllClients);

/**
 * @swagger
 * /clients/afficher/{id}:
 *   get:
 *     summary: Récupérer un client par ID
 *     description: Retourne les informations d'un client spécifique.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Client récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client récupéré avec succès
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ID invalide
 *       404:
 *         description: Client non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client non trouvé
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur interne du serveur
 */
router.get('/afficher/:id', verifyTokenMiddleware, afficherUnClient);

/**
 * @swagger
 * /clients/recherche:
 *   get:
 *     summary: Recherche des clients avec filtres dynamiques
 *     description: Permet de rechercher des clients en fonction de leur ID, nom, prénom, email, téléphone ou type.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID unique du client
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         description: Nom du client (recherche partielle)
 *       - in: query
 *         name: prenom
 *         schema:
 *           type: string
 *         description: Prénom du client (recherche partielle)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email du client (recherche partielle)
 *       - in: query
 *         name: telephone
 *         schema:
 *           type: string
 *         description: Téléphone du client (recherche partielle)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ["Privé", "Professionnel"]
 *         description: Type du client (Privé ou Professionnel)
 *     responses:
 *       200:
 *         description: Liste des clients correspondant aux critères
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
 *                   prenom:
 *                     type: string
 *                     example: "Jean"
 *                   email:
 *                     type: string
 *                     example: "jean.dupont@example.com"
 *                   telephone:
 *                     type: string
 *                     example: "+33612345678"
 *                   type:
 *                     type: string
 *                     example: "Privé"
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/recherche', verifyTokenMiddleware, searchClient);


export default router;
