import { Router } from "express";
import FactureController from "../controllers/factureController";

const router = Router();

/**
 * @swagger
 * /factures/ajouter:
 *   post:
 *     summary: Ajouter une facture avec produits et prestations
 *     description: Crée une nouvelle facture et associe les produits et prestations.
 *     tags:
 *       - Factures
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - userId
 *               - clientId
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ["Facture", "Devis"]
 *                 description: "Type de la facture (ex: 'Facture', 'Devis')."
 *               userId:
 *                 type: integer
 *                 description: "ID de l'utilisateur associé à la facture."
 *               clientId:
 *                 type: integer
 *                 description: "ID du client concerné."
 *               produits:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produitId:
 *                       type: integer
 *                       description: "ID du produit."
 *                     quantite:
 *                       type: integer
 *                       description: "Quantité du produit."
 *                     prix_htva:
 *                       type: number
 *                       description: "Prix HTVA du produit."
 *                     remise:
 *                       type: number
 *                       description: "Montant ou pourcentage de la remise."
 *                     remiseType:
 *                       type: string
 *                       enum: ["montant", "pourcentage"]
 *                       description: "Type de remise."
 *                     tva:
 *                       type: number
 *                       default: 20
 *                       description: "Taux de TVA (par défaut 20%)."
 *               prestations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     prestationId:
 *                       type: integer
 *                       description: "ID de la prestation."
 *                     quantite:
 *                       type: integer
 *                       description: "Quantité de la prestation."
 *                     prix_htva:
 *                       type: number
 *                       description: "Prix HTVA de la prestation."
 *                     remise:
 *                       type: number
 *                       description: "Montant ou pourcentage de la remise."
 *                     remiseType:
 *                       type: string
 *                       enum: ["montant", "pourcentage"]
 *                       description: "Type de remise."
 *                     tva:
 *                       type: number
 *                       default: 20
 *                       description: "Taux de TVA (par défaut 20%)."
 *     responses:
 *       201:
 *         description: Facture créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Facture créée avec succès"
 *                 facture:
 *                   type: object
 *       400:
 *         description: Erreur de validation des données.
 *       500:
 *         description: Erreur serveur lors de la création de la facture.
 */
router.post("/ajouter", FactureController.ajouterFacture); // Créer une facture
// router.get("/", FactureController.getAllFactures); // Récupérer toutes les factures
// router.get("/:id", FactureController.getFactureById); // Récupérer une facture par ID
// router.put("/:id", FactureController.updateFacture); // Mettre à jour une facture
// router.delete("/:id", FactureController.deleteFacture); // Supprimer une facture

export default router;
