import { Router } from "express";
import { ajouterRendezVous, modifierRendezVous } from "../controllers/rendezVousController";

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
 *                 enum: ["réserver", "annuler"]
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

router.post("/ajouter", ajouterRendezVous);



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
 *                 enum: ["réserver", "annuler"]
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


router.put("/modifier/:id", modifierRendezVous);



// /**
//  * @swagger
//  * /rendezvous/delete/{id}:
//  *   delete:
//  *     summary: Supprimer un rendez-vous
//  *     description: Permet de supprimer un rendez-vous par son ID.
//  *     tags: [RendezVous]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID du rendez-vous à supprimer
//  *         example: 1
//  *     responses:
//  *       200:
//  *         description: Rendez-vous supprimé avec succès
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Rendez-vous supprimé avec succès"
//  *       404:
//  *         description: Rendez-vous non trouvé
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Rendez-vous non trouvé"
//  *       500:
//  *         description: Erreur interne du serveur
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Erreur interne du serveur"
//  */
// router.delete("/delete/:id", supprimerRendezVous);
// router.get("/all", obtenirTousLesRendezVous);
// router.get("/rd/:id", obtenirRendezVousParId);

export default router;
