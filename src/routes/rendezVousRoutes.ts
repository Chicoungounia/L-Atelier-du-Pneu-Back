import { Router } from "express";
import { afficherAllRendezVous, afficherAllRendezVousClient, afficherAllRendezVousReserver, afficherRendezVous, ajouterRendezVous, deleteRendezVous, modifierRendezVous, searchRendezVous } from "../controllers/rendezVousController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();


/**
 * @swagger
 * /rendezvous/ajouter:
 *   post:
 *     summary: Ajouter un rendez-vous
 *     description: Crée un nouveau rendez-vous après avoir vérifié la disponibilité du pont et de l'ouvrier.
 *     tags: 
 *       - Rendez-vous
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: integer
 *                 example: 1
 *                 description: ID du client associé au rendez-vous
 *               userId:
 *                 type: integer
 *                 example: 2
 *                 description: ID de l'ouvrier qui effectuera le rendez-vous
 *               pont:
 *                 type: integer
 *                 example: 3
 *                 description: Numéro du pont utilisé pour l'intervention (1, 2 ou 3)
 *               dateDebut:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-16T09:00:00Z"
 *                 description: Date et heure de début du rendez-vous (format ISO 8601)
 *               dateFin:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-16T10:00:00Z"
 *                 description: Heure de fin du rendez-vous (format ISO 8601)
 *               status:
 *                 type: string
 *                 enum: ["Réserver", "Annuler", "Effectuer"]
 *                 example: "réserver"
 *                 description: Statut du rendez-vous
 *     responses:
 *       201:
 *         description: Rendez-vous ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rendez-vous ajouté avec succès"
 *                 rendezVous:
 *                   $ref: '#/components/schemas/RendezVous'
 *       400:
 *         description: Erreur de validation (ex. créneau indisponible, ouvrier non valide, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "L'ouvrier est déjà occupé à cette heure."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur interne du serveur."
 */
router.post("/ajouter", verifyTokenMiddleware, ajouterRendezVous);

/**
 * @swagger
 * /rendezvous/modifier/{id}:
 *   put:
 *     summary: Modifier un rendez-vous
 *     description: Met à jour un rendez-vous existant après vérification des disponibilités du pont et de l'ouvrier.
 *     tags:
 *       - Rendez-vous
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rendez-vous à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: integer
 *                 example: 1
 *                 description: ID du client associé au rendez-vous
 *               userId:
 *                 type: integer
 *                 example: 2
 *                 description: ID de l'ouvrier qui effectuera le rendez-vous
 *               pont:
 *                 type: integer
 *                 example: 3
 *                 description: Numéro du pont utilisé pour l'intervention (1, 2 ou 3)
 *               dateDebut:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-16T09:00:00Z"
 *                 description: Date et heure de début du rendez-vous (format ISO 8601)
 *               dateFin:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-16T10:00:00Z"
 *                 description: Heure de fin du rendez-vous (format ISO 8601)
 *               status:
 *                 type: string
 *                 enum: ["Réserver", "Annuler", "Effectuer"]
 *                 example: "réserver"
 *                 description: Statut du rendez-vous
 *     responses:
 *       200:
 *         description: Rendez-vous modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rendez-vous modifié avec succès"
 *                 rendezVous:
 *                   $ref: '#/components/schemas/RendezVous'
 *       400:
 *         description: Erreur de validation (ex. créneau indisponible, ouvrier non valide, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "L'ouvrier est déjà occupé à cette heure."
 *       404:
 *         description: Rendez-vous non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rendez-vous non trouvé."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur interne du serveur."
 */
router.put("/modifier/:id",verifyTokenMiddleware, modifierRendezVous);

/**
 * @swagger
 * /rendezvous/delete/{id}:
 *   delete:
 *     summary: Supprime un rendez-vous
 *     description: Supprime un rendez-vous existant à partir de son ID.
 *     tags:
 *       - Rendez-vous
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rendez-vous à supprimer
 *     responses:
 *       200:
 *         description: Rendez-vous supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rendez-vous supprimé avec succès."
 *       404:
 *         description: Rendez-vous non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rendez-vous non trouvé."
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/delete/:id",verifyTokenMiddleware, deleteRendezVous);

/**
 * @swagger
 * /rendezvous/afficher/{id}:
 *   get:
 *     summary: Récupérer un rendez-vous par son ID
 *     description: Permet de récupérer les informations d'un rendez-vous spécifique.
 *     tags: 
 *       - Rendez-vous
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rendez-vous à récupérer
 *     responses:
 *       200:
 *         description: Rendez-vous récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rendez-vous récupéré avec succès"
 *                 rendezVous:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     clientId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     pont:
 *                       type: integer
 *                     dateDebut:
 *                       type: string
 *                       format: date-time
 *                     dateFin:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                       enum: [Réserver, Annuler, Effectuer]
 *       404:
 *         description: Rendez-vous non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/afficher/:id", verifyTokenMiddleware, afficherRendezVous);

/**
 * @swagger
 * /rendezvous/afficher/all:
 *   get:
 *     summary: Récupère tous les rendez-vous
 *     description: Retourne la liste de tous les rendez-vous enregistrés dans la base de données.
 *     tags:
 *       - Rendez-vous
 *     responses:
 *       200:
 *         description: Liste de tous les rendez-vous récupérée avec succès.
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
 *                   clientId:
 *                     type: integer
 *                     example: 5
 *                   userId:
 *                     type: integer
 *                     example: 2
 *                   pont:
 *                     type: integer
 *                     enum: [1, 2, 3]
 *                     example: 1
 *                   dateDebut:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-01T08:00:00.000Z"
 *                   dateFin:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-01T09:00:00.000Z"
 *                   status:
 *                     type: string
 *                     enum: ["Réserver", "Annuler", "Effectuer"]
 *                     example: "Réserver"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-22T12:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-22T12:30:00.000Z"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get("/afficher/all", verifyTokenMiddleware, afficherAllRendezVous);

/**
 * @swagger
 * /rendezvous/afficher/all/reserver:
 *   get:
 *     summary: Récupère tous les rendez-vous avec le statut "Réserver"
 *     description: Retourne la liste des rendez-vous ayant le statut "Réserver".
 *     tags:
 *       - Rendez-vous
 *     responses:
 *       200:
 *         description: Liste des rendez-vous réservés récupérée avec succès.
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
 *                   clientId:
 *                     type: integer
 *                     example: 5
 *                   userId:
 *                     type: integer
 *                     example: 2
 *                   pont:
 *                     type: integer
 *                     enum: [1, 2, 3]
 *                     example: 1
 *                   dateDebut:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-01T08:00:00.000Z"
 *                   dateFin:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-01T09:00:00.000Z"
 *                   status:
 *                     type: string
 *                     example: "Réserver"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-22T12:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-22T12:30:00.000Z"
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get("/afficher/all/reserver", verifyTokenMiddleware, afficherAllRendezVousReserver);

/**
 * @swagger
 * /rendezvous/client/{clientId}:
 *   get:
 *     summary: Récupère tous les rendez-vous d'un client spécifique
 *     description: Retourne la liste des rendez-vous d'un client donné en fonction de son `clientId`.
 *     tags:
 *       - Rendez-vous
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du client dont on veut récupérer les rendez-vous
 *     responses:
 *       200:
 *         description: Liste des rendez-vous du client récupérée avec succès.
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
 *                   clientId:
 *                     type: integer
 *                     example: 5
 *                   userId:
 *                     type: integer
 *                     example: 2
 *                   pont:
 *                     type: integer
 *                     enum: [1, 2, 3]
 *                     example: 1
 *                   dateDebut:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-01T08:00:00.000Z"
 *                   dateFin:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-01T09:00:00.000Z"
 *                   status:
 *                     type: string
 *                     example: "Réserver"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-22T12:00:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-22T12:30:00.000Z"
 *       400:
 *         description: ID client invalide.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get("/afficher/:clientId", verifyTokenMiddleware, afficherAllRendezVousClient);

/**
 * @swagger
 * /rendezvous/recherche:
 *   get:
 *     summary: Recherche des rendez-vous avec des filtres optionnels.
 *     description: Retourne une liste de rendez-vous en fonction des filtres fournis. Affiche les dates et le statut du rendez-vous sans possibilité de filtrage sur ces champs.
 *     tags:
 *       - Rendez-vous
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID du rendez-vous (optionnel).
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: integer
 *         description: ID du client (optionnel).
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: ID de l'ouvrier (optionnel).
 *     responses:
 *       200:
 *         description: Liste des rendez-vous récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   clientId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   dateDebut:
 *                     type: string
 *                     format: date-time
 *                   dateFin:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get("/recherche/", verifyTokenMiddleware, searchRendezVous);


export default router;
