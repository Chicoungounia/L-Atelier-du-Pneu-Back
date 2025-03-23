import { Router } from "express";
import { ajouterFacture, modifierFacture, modifierTypeEtPayement, afficherTypeFactures, afficherAllFactures, afficherUne, afficherTypeDevis, afficherAllApayer, } from "../controllers/factureController";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();

/**
 * @swagger
 * /factures/ajouter:
 *   post:
 *     summary: Ajouter une nouvelle facture
 *     description: Crée une facture avec des produits et/ou prestations associés.
 *     tags:
 *       - Factures
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ["Facture", "Devis"]
 *                 description: Type de facture
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur créant la facture
 *               clientId:
 *                 type: integer
 *                 description: ID du client
 *               rendezVousId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID du rendez-vous associé (si applicable)
 *               produits:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produitId:
 *                       type: integer
 *                     quantite:
 *                       type: integer
 *                     remise:
 *                       type: number
 *                       default: 0
 *                 description: Liste des produits inclus
 *               prestations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     prestationId:
 *                       type: integer
 *                     quantite:
 *                       type: integer
 *                     remise:
 *                       type: number
 *                       default: 0
 *                 description: Liste des prestations incluses
 *               status_payement:
 *                 type: string
 *                 enum: ["Payer", "A payer", "Annulé"]
 *                 description: Statut du paiement
 *               mode_payement:
 *                 type: string
 *                 description: Mode de paiement utilisé
 *     responses:
 *       201:
 *         description: Facture ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 facture:
 *                   $ref: "#/components/schemas/Facture"
 *       400:
 *         description: Erreur dans les données fournies
 *       403:
 *         description: Utilisateur inactif, création de facture interdite
 *       500:
 *         description: Erreur serveur
 */
router.post("/ajouter", verifyTokenMiddleware, ajouterFacture);

/**
 * @swagger
 * /factures/modifier/{id}:
 *   put:
 *     summary: Modifier une facture existante
 *     description: Permet de modifier une facture en mettant à jour les produits, prestations, et le statut de paiement.
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
 *             properties:
 *               produits:
 *                 type: array
 *                 description: Liste des produits dans la facture
 *                 items:
 *                   type: object
 *                   properties:
 *                     produitId:
 *                       type: integer
 *                       description: ID du produit
 *                     quantite:
 *                       type: integer
 *                       description: Quantité du produit
 *                     remise:
 *                       type: number
 *                       format: float
 *                       description: Remise appliquée sur le produit (en pourcentage)
 *               prestations:
 *                 type: array
 *                 description: Liste des prestations dans la facture
 *                 items:
 *                   type: object
 *                   properties:
 *                     prestationId:
 *                       type: integer
 *                       description: ID de la prestation
 *                     quantite:
 *                       type: integer
 *                       description: Quantité de la prestation
 *                     remise:
 *                       type: number
 *                       format: float
 *                       description: Remise appliquée sur la prestation (en pourcentage)
 *               status_payement:
 *                 type: string
 *                 description: "Statut du paiement (ex: 'Payé', 'A payer')"
 *               mode_payement:
 *                 type: string
 *                 description: "Mode de paiement (ex: 'Carte bancaire', 'Espèces')"
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
 *         description: Requête invalide ou stock insuffisant
 *       404:
 *         description: Facture non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put("/modifier/:id", verifyTokenMiddleware, modifierFacture);

/**
 * @swagger
 * /factures/modifier/type/{id}:
 *   put:
 *     summary: Modifier le type, le statut et le mode de paiement d'une facture
 *     description: |
 *       Permet de modifier le type d'une facture (de Devis à Facture), ainsi que son statut de paiement et son mode de paiement.
 *       - Seuls les devis peuvent être convertis en facture.
 *       - Lorsqu'une facture est créée, les stocks des produits sont mis à jour.
 *       - Si la facture est payée, le statut du rendez-vous lié passe à "Effectuer".
 *     tags:
 *       - Factures
 *     security:
 *       - BearerAuth: []
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
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Facture, Devis]
 *                 description: |
 *                   Type de la facture. Seuls les devis peuvent être convertis en factures.
 *               status_payement:
 *                 type: string
 *                 enum: [Payer, A payer]
 *                 description: Statut du paiement de la facture.
 *               mode_payement:
 *                 type: string
 *                 description: Mode de paiement utilisé
 *     responses:
 *       200:
 *         description: Mise à jour réussie
 *         content:
 *           application/json:
 *             example:
 *               message: "Facture mise à jour avec succès, stock et rendez-vous ajustés"
 *               facture:
 *                 id: 8
 *                 type: "Facture"
 *                 status_payement: "Payer"
 *                 mode_payement: "Virement"
 *       400:
 *         description: "Requête invalide (ex: stock insuffisant, type incorrect)"
 *         content:
 *           application/json:
 *             examples:
 *               stock_insuffisant:
 *                 summary: Stock insuffisant
 *                 value:
 *                   message: "Stock insuffisant pour le produit 12"
 *               type_invalide:
 *                 summary: Changement de type non autorisé
 *                 value:
 *                   message: "Seuls les devis peuvent être convertis en facture"
 *               statut_invalide:
 *                 summary: Statut de paiement invalide
 *                 value:
 *                   message: "Statut de paiement invalide"
 *       404:
 *         description: Facture non trouvée
 *         content:
 *           application/json:
 *             example:
 *               message: "Facture introuvable"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour de la facture"
 */
router.put("/modifier/type/:id", verifyTokenMiddleware, modifierTypeEtPayement)

/**
 * @swagger
 * /factures/afficher/{id}:
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
router.get("/afficher/:id", verifyTokenMiddleware, afficherUne);


/**
 * @swagger
 * /factures/afficher/all/factures:
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
router.get("/afficher/all/factures", verifyTokenMiddleware, afficherAllFactures);

/**
 * @swagger
 * /factures/afficher/type/devis:
 *   get:
 *     summary: Récupérer tous les devis
 *     description: Renvoie la liste de tous les devis avec le type "Devis".
 *     tags:
 *       - Factures
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des devis récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Identifiant unique du devis.
 *                   type:
 *                     type: string
 *                     description: Type du document ("Devis").
 *                   userId:
 *                     type: integer
 *                     description: Identifiant de l'utilisateur associé.
 *                   clientId:
 *                     type: integer
 *                     description: Identifiant du client associé.
 *                   status_payement:
 *                     type: string
 *                     description: Statut du paiement.
 *                   mode_payement:
 *                     type: string
 *                     description: Mode de paiement.
 *                   total_htva:
 *                     type: number
 *                     description: Montant total hors TVA.
 *                   total_tva:
 *                     type: number
 *                     description: Montant total de la TVA.
 *                   total:
 *                     type: number
 *                     description: Montant total TTC.
 *       401:
 *         description: Non autorisé, token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de la récupération des devis.
 */
router.get("/afficher/type/devis", verifyTokenMiddleware, afficherTypeDevis);

/**
 * @swagger
 * /factures/afficher/type/factures:
 *   get:
 *     summary: Récupérer toutes les factures
 *     description: Renvoie la liste de toutes les factures avec le type "Facture".
 *     tags:
 *       - Factures
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des factures récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Identifiant unique de la facture.
 *                   type:
 *                     type: string
 *                     description: Type de la facture ("Facture").
 *                   userId:
 *                     type: integer
 *                     description: Identifiant de l'utilisateur associé.
 *                   clientId:
 *                     type: integer
 *                     description: Identifiant du client associé.
 *                   status_payement:
 *                     type: string
 *                     description: Statut du paiement.
 *                   mode_payement:
 *                     type: string
 *                     description: Mode de paiement.
 *                   total_htva:
 *                     type: number
 *                     description: Montant total hors TVA.
 *                   total_tva:
 *                     type: number
 *                     description: Montant total de la TVA.
 *                   total:
 *                     type: number
 *                     description: Montant total TTC.
 *       401:
 *         description: Non autorisé, token manquant ou invalide.
 *       500:
 *         description: Erreur serveur lors de la récupération des factures.
 */
router.get("/afficher/type/factures", verifyTokenMiddleware, afficherTypeFactures);


/**
 * @swagger
 * /factures/afficher/all/apayer:
 *   get:
 *     summary: Récupérer toutes les factures à payer
 *     description: Renvoie toutes les factures avec le type "Facture" et le statut de paiement "A Payer".
 *     tags:
 *       - Factures
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des factures à payer récupérée avec succès.
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
 *                   type:
 *                     type: string
 *                     example: "Facture"
 *                   status_payement:
 *                     type: string
 *                     example: "A Payer"
 *       500:
 *         description: Erreur serveur lors de la récupération des factures à payer.
 */
router.get("/afficher/all/apayer", verifyTokenMiddleware, afficherAllApayer);
  

export default router;
