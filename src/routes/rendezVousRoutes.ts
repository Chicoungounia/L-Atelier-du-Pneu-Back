import { Router } from "express";
import { ajouterRendezVous } from "../controllers/rendezVousController";

const router = Router();




/**
 * @swagger
 * /rendezvous/ajouter:
 *   post:
 *     summary: Ajoute un nouveau rendez-vous
 *     description: Crée un rendez-vous en vérifiant que l'heure choisie est dans les horaires d'ouverture (Lundi-Vendredi, 9h-12h30 et 13h30-19h).
 *     tags:
 *       - RendezVous
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - ouvrierId
 *               - dateHeure
 *               - heureFin
 *             properties:
 *               clientId:
 *                 type: integer
 *                 example: 1
 *                 description: ID du client qui prend le rendez-vous.
 *               ouvrierId:
 *                 type: integer
 *                 example: 2
 *                 description: ID de l'ouvrier qui effectuera le travail.
 *               dateHeure:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-15T09:30:00Z"
 *                 description: Date et heure de début du rendez-vous.
 *               heureFin:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-15T10:30:00Z"
 *                 description: Heure de fin du rendez-vous.
 *               status:
 *                 type: string
 *                 example: "Actif"
 *                 description: Statut du rendez-vous (optionnel, par défaut "Actif").
 *     responses:
 *       201:
 *         description: Rendez-vous ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rendez-vous ajouté avec succès"
 *                 rendezVous:
 *                   type: object
 *       400:
 *         description: Requête invalide (ex. heure en dehors des horaires d'ouverture).
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post("/ajouter", ajouterRendezVous);



// /**
//  * @swagger
//  * /rendezvous/modifier/{id}:
//  *   put:
//  *     summary: Modifier un rendez-vous
//  *     description: Permet de modifier un rendez-vous existant par son ID.
//  *     tags: [RendezVous]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID du rendez-vous à modifier
//  *         example: 1
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               clientId:
//  *                 type: integer
//  *                 description: ID du client
//  *                 example: 1
//  *               ouvrierId:
//  *                 type: integer
//  *                 description: ID de l'ouvrier
//  *                 example: 2
//  *               dateHeure:
//  *                 type: string
//  *                 format: date-time
//  *                 description: Nouvelle date et heure du rendez-vous (ISO 8601)
//  *                 example: "2025-03-20T10:00:00.000Z"
//  *               status:
//  *                 type: string
//  *                 enum: [Actif, Annulé, Terminé]
//  *                 description: Nouveau statut du rendez-vous
//  *                 example: "Terminé"
//  *     responses:
//  *       200:
//  *         description: Rendez-vous modifié avec succès
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Rendez-vous modifié avec succès"
//  *                 rendezVous:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: integer
//  *                       example: 1
//  *                     clientId:
//  *                       type: integer
//  *                       example: 1
//  *                     ouvrierId:
//  *                       type: integer
//  *                       example: 2
//  *                     dateHeure:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2025-03-20T10:00:00.000Z"
//  *                     status:
//  *                       type: string
//  *                       example: "Terminé"
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
// router.put("/modifier/:id", modifierRendezVous);



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
