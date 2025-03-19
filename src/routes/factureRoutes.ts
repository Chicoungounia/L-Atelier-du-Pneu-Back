import { Router } from "express";
import { ajouterFacture, modifierFacture, supprimerFacture } from "../controllers/factureController";

const router = Router();

/**
 * @swagger
 * /factures/ajouter:
 *   post:
 *     summary: Créer une nouvelle facture ou un devis
 *     description: Cette route permet d'ajouter une facture ou un devis pour un client avec les produits et prestations associées.
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
 *               - produitId
 *               - prestationId
 *               - prix_htva_produit
 *               - quantite_produit
 *               - remise_produit
 *               - tva_produit
 *               - total_ttc_produit
 *               - prix_htva_prestation
 *               - quantite_prestation
 *               - remise_prestation
 *               - tva_prestation
 *               - total_ttc_prestation
 *               - total_htva
 *               - total_remise
 *               - total_tva
 *               - total
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ["Devis", "Facture"]
 *                 description: Type du document (Facture ou Devis).
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur qui crée la facture.
 *               clientId:
 *                 type: integer
 *                 description: ID du client concerné par la facture.
 *               produitId:
 *                 type: integer
 *                 description: ID du produit facturé.
 *               prestationId:
 *                 type: integer
 *                 description: ID de la prestation facturée.
 *               prix_htva_produit:
 *                 type: number
 *                 format: float
 *                 description: Prix hors taxes du produit.
 *               quantite_produit:
 *                 type: integer
 *                 description: Quantité du produit facturée.
 *               remise_produit:
 *                 type: number
 *                 format: float
 *                 description: Remise appliquée sur le produit.
 *               tva_produit:
 *                 type: number
 *                 format: float
 *                 description: TVA appliquée sur le produit.
 *               total_ttc_produit:
 *                 type: number
 *                 format: float
 *                 description: Total TTC du produit.
 *               prix_htva_prestation:
 *                 type: number
 *                 format: float
 *                 description: Prix hors taxes de la prestation.
 *               quantite_prestation:
 *                 type: integer
 *                 description: Quantité de la prestation facturée.
 *               remise_prestation:
 *                 type: number
 *                 format: float
 *                 description: Remise appliquée sur la prestation.
 *               tva_prestation:
 *                 type: number
 *                 format: float
 *                 description: TVA appliquée sur la prestation.
 *               total_ttc_prestation:
 *                 type: number
 *                 format: float
 *                 description: Total TTC de la prestation.
 *               total_htva:
 *                 type: number
 *                 format: float
 *                 description: Total hors taxes global.
 *               total_remise:
 *                 type: number
 *                 format: float
 *                 description: Remise totale appliquée.
 *               total_tva:
 *                 type: number
 *                 format: float
 *                 description: TVA totale appliquée.
 *               total:
 *                 type: number
 *                 format: float
 *                 description: Montant total TTC de la facture.
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
 *                   example: Facture ajoutée avec succès
 *                 facture:
 *                   type: object
 *                   description: Les détails de la facture créée.
 *       400:
 *         description: Stock insuffisant ou données invalides.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock insuffisant pour ce produit
 *       404:
 *         description: Produit ou prestation introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produit introuvable
 *       500:
 *         description: Erreur interne du serveur lors de la création de la facture.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la création de la facture
 */
router.post("/ajouter", ajouterFacture);
/**
 * @swagger
 * /factures/modifier/{id}:
 *   put:
 *     summary: Modifier une facture existante
 *     description: Met à jour une facture en modifiant ses informations et ajuste le stock du produit si nécessaire.
 *     tags:
 *       - Factures
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la facture à modifier
 *         schema:
 *           type: integer
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
 *               - produitId
 *               - prestationId
 *               - prix_htva_produit
 *               - quantite_produit
 *               - remise_produit
 *               - tva_produit
 *               - total_ttc_produit
 *               - prix_htva_prestation
 *               - quantite_prestation
 *               - remise_prestation
 *               - tva_prestation
 *               - total_ttc_prestation
 *               - total_htva
 *               - total_remise
 *               - total_tva
 *               - total
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Devis, Facture]
 *                 description: Type de facture (Devis ou Facture)
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur associé
 *               clientId:
 *                 type: integer
 *                 description: ID du client associé
 *               produitId:
 *                 type: integer
 *                 description: ID du produit associé
 *               prestationId:
 *                 type: integer
 *                 description: ID de la prestation associée
 *               prix_htva_produit:
 *                 type: number
 *                 format: float
 *                 description: Prix HTVA du produit
 *               quantite_produit:
 *                 type: integer
 *                 description: Quantité du produit
 *               remise_produit:
 *                 type: number
 *                 format: float
 *                 description: Remise sur le produit
 *               tva_produit:
 *                 type: number
 *                 format: float
 *                 description: TVA du produit
 *               total_ttc_produit:
 *                 type: number
 *                 format: float
 *                 description: Total TTC du produit
 *               prix_htva_prestation:
 *                 type: number
 *                 format: float
 *                 description: Prix HTVA de la prestation
 *               quantite_prestation:
 *                 type: integer
 *                 description: Quantité de la prestation
 *               remise_prestation:
 *                 type: number
 *                 format: float
 *                 description: Remise sur la prestation
 *               tva_prestation:
 *                 type: number
 *                 format: float
 *                 description: TVA de la prestation
 *               total_ttc_prestation:
 *                 type: number
 *                 format: float
 *                 description: Total TTC de la prestation
 *               total_htva:
 *                 type: number
 *                 format: float
 *                 description: Total HTVA
 *               total_remise:
 *                 type: number
 *                 format: float
 *                 description: Total des remises
 *               total_tva:
 *                 type: number
 *                 format: float
 *                 description: Total de la TVA
 *               total:
 *                 type: number
 *                 format: float
 *                 description: Montant total de la facture
 *     responses:
 *       200:
 *         description: Facture mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Facture mise à jour avec succès
 *                 facture:
 *                   $ref: '#/components/schemas/Facture'
 *       400:
 *         description: Stock insuffisant ou requête invalide
 *       404:
 *         description: Facture ou produit/prestation introuvable
 *       500:
 *         description: Erreur serveur lors de la mise à jour
 */
router.put("/modifier/:id", modifierFacture);
/**
 * @swagger
 * /factures/supprimer/{id}:
 *   delete:
 *     summary: Supprimer une facture
 *     description: Supprime une facture et remet à jour le stock du produit si nécessaire.
 *     tags:
 *       - Factures
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la facture à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facture supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Facture supprimée avec succès
 *       404:
 *         description: Facture introuvable
 *       500:
 *         description: Erreur serveur lors de la suppression
 */
router.delete("/supprimer/:id", supprimerFacture); // Supprimer une facture
// router.get("/", FactureController.getAllFactures); // Récupérer toutes les factures
// router.get("/:id", FactureController.getFactureById); // Récupérer une facture par ID


export default router;
