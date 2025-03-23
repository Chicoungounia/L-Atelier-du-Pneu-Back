import { Router } from "express";
import { ajouterFacture, modifierTypeFacture, modifierFacture, modifierStatusModePayement, recupererToutesLesFactures, recupererUneFacture, supprimerFacture } from "../controllers/factureController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { isAdmin } from "../middlewares/verifyAdminMiddleware";

const router = Router();

/**
 * @swagger
 * /factures/ajouter:
 *   post:
 *     summary: Ajouter une nouvelle facture
 *     description: Crée une nouvelle facture avec les informations fournies et met à jour le stock ou le statut du rendez-vous si nécessaire.
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
 *               - status_payement
 *               - mode_payement
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Facture, Devis]
 *                 description: Type de la facture (Facture ou Devis).
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur qui crée la facture.
 *               clientId:
 *                 type: integer
 *                 description: ID du client associé à la facture.
 *               rendezVousId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID du rendez-vous lié (si applicable).
 *               produitId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID du produit associé (si applicable).
 *               prestationId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID de la prestation associée (si applicable).
 *               quantite_produit:
 *                 type: number
 *                 default: 0
 *                 description: Quantité du produit acheté.
 *               remise_produit:
 *                 type: number
 *                 default: 0
 *                 description: Remise appliquée sur le produit (en pourcentage).
 *               quantite_prestation:
 *                 type: number
 *                 default: 0
 *                 description: Quantité de la prestation effectuée.
 *               remise_prestation:
 *                 type: number
 *                 default: 0
 *                 description: Remise appliquée sur la prestation (en pourcentage).
 *               status_payement:
 *                 type: string
 *                 enum: [Payer, A payer]
 *                 description: Statut du paiement de la facture.
 *               mode_payement:
 *                 type: string
 *                 enum: [Espèces, Carte, Virement, chèque]
 *                 description: Mode de paiement utilisé.
 *     responses:
 *       201:
 *         description: Facture ajoutée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Facture ajoutée avec succès"
 *                 facture:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     type:
 *                       type: string
 *                       example: "Facture"
 *                     total:
 *                       type: number
 *                       example: 120.50
 *       400:
 *         description: Erreur de validation ou stock insuffisant.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stock insuffisant"
 *       403:
 *         description: Utilisateur inactif, création de facture interdite.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur inactif, création de facture interdite"
 *       404:
 *         description: Produit ou prestation introuvable.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit introuvable"
 *       500:
 *         description: Erreur serveur lors de la création de la facture.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la création de la facture"
 */
router.post("/ajouter", verifyTokenMiddleware, ajouterFacture);

/**
 * @swagger
 * /factures/modifier/{id}:
 *   put:
 *     summary: Modifier une facture existante
 *     description: Met à jour les informations d'une facture en s'assurant qu'un devis ne puisse pas être converti en facture.
 *     tags:
 *       - Factures
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la facture à modifier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur associé à la facture
 *               clientId:
 *                 type: integer
 *                 description: ID du client associé à la facture
 *               produitId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID du produit facturé (si applicable)
 *               prestationId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID de la prestation facturée (si applicable)
 *               quantite_produit:
 *                 type: integer
 *                 default: 0
 *                 description: Quantité de produits achetés
 *               remise_produit:
 *                 type: number
 *                 default: 0
 *                 description: Remise en pourcentage sur le produit
 *               quantite_prestation:
 *                 type: integer
 *                 default: 0
 *                 description: Quantité de prestations achetées
 *               remise_prestation:
 *                 type: number
 *                 default: 0
 *                 description: Remise en pourcentage sur la prestation
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
 *                 facture:
 *                   $ref: '#/components/schemas/Facture'
 *       400:
 *         description: "Erreur de validation (ex: tentative de conversion d'un devis en facture)"
 *       404:
 *         description: "Facture ou produit/prestation introuvable"
 *       500:
 *         description: "Erreur serveur lors de la mise à jour"
 */
router.put("/modifier/:id", verifyTokenMiddleware, modifierFacture);

/**
 * @swagger
 * /factures/convertir/type/{id}:
 *   put:
 *     summary: Convertir un devis en facture
 *     description: Convertit un devis en facture et met à jour le stock des produits et prestations associées. Met également à jour le statut du rendez-vous si la facture est payée.
 *     tags:
 *       - Factures
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du devis à convertir
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facture convertie avec succès
 *       400:
 *         description: Requête invalide ou stock insuffisant
 *       404:
 *         description: Facture, produit ou prestation introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put("/modifier/type/:id/",verifyTokenMiddleware, modifierTypeFacture);

/**
* @swagger
* /factures/modifier/paiement/{id}:
*   put:
*     summary: Modifier le statut et le mode de paiement d'une facture
*     description: Permet de mettre à jour le statut de paiement et le mode de paiement d'une facture existante.
*     tags:
*       - Factures
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID de la facture à mettre à jour
*         schema:
*           type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               status_payement:
*                 type: string
*                 enum: ["Payer", "A payer", "Annulé"]
*                 description: Le statut du paiement.
*               mode_payement:
*                 type: string
*                 example: "Carte bancaire"
*                 description: Le mode de paiement utilisé.
*     responses:
*       200:
*         description: Mise à jour réussie du statut et du mode de paiement.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Statut et mode de paiement mis à jour avec succès"
*                 facture:
*                   $ref: "#/components/schemas/Facture"
*       400:
*         description: "Requête invalide (ex: statut de paiement non valide)."
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Statut de paiement invalide"
*       404:
*         description: Facture non trouvée.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Facture introuvable"
*       500:
*         description: Erreur serveur.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "Erreur lors de la mise à jour du paiement"
*/
router.put("/modifier/paiement/:id", verifyTokenMiddleware, modifierStatusModePayement)

/**
 * @swagger
 * /factures/supprimer/{id}:
 *   delete:
 *     summary: Supprimer une facture existante
 *     description: Supprime une facture par son ID. Si c'est une facture et qu'un produit est lié, le stock du produit est restauré.
 *     tags:
 *       - Factures
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la facture à supprimer
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
 *       404:
 *         description: Facture introuvable
 *       500:
 *         description: Erreur serveur lors de la suppression
 */
router.delete("/supprimer/:id", verifyTokenMiddleware, isAdmin, supprimerFacture); 

/**
 * @swagger
 * /factures/recuperer/all:
 *   get:
 *     summary: Récupérer toutes les factures
 *     description: Retourne la liste complète des factures enregistrées dans la base de données.
 *     tags:
 *       - Factures
 *     responses:
 *       200:
 *         description: Liste des factures récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Liste des factures récupérée avec succès
 *                 factures:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Facture'
 *       500:
 *         description: Erreur lors de la récupération des factures
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la récupération des factures
 *                 error:
 *                   type: object
 */

router.get("/recuperer/all", verifyTokenMiddleware, recupererToutesLesFactures);

/**
 * @swagger
 * /factures/recuperer/{id}:
 *   get:
 *     summary: Récupérer une facture par ID
 *     description: Retourne une facture spécifique en fonction de l'ID fourni.
 *     tags:
 *       - Factures
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la facture à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Facture récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Facture récupérée avec succès
 *                 facture:
 *                   $ref: '#/components/schemas/Facture'
 *       404:
 *         description: Facture introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Facture introuvable
 *       500:
 *         description: Erreur lors de la récupération de la facture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la récupération de la facture
 *                 error:
 *                   type: object
 */

router.get("/recuperer/:id", verifyTokenMiddleware, recupererUneFacture);




export default router;
