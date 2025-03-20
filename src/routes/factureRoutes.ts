import { Router } from "express";
import { ajouterFacture, convertirTypeFacture, modifierFacture, recupererToutesLesFactures, recupererUneFacture, supprimerFacture } from "../controllers/factureController";

const router = Router();

/**
 * @swagger
/**
 * @swagger
 * /factures/ajouter:
 *   post:
 *     summary: Créer une nouvelle facture
 *     description: Ajoute une nouvelle facture avec les informations fournies.
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
 *                 description: Type de facture (Facture ou Devis).
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur qui crée la facture.
 *               clientId:
 *                 type: integer
 *                 description: ID du client associé à la facture.
 *               produitId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID du produit acheté (optionnel).
 *               prestationId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID de la prestation effectuée (optionnel).
 *               quantite_produit:
 *                 type: integer
 *                 default: 0
 *                 description: Quantité de produit achetée.
 *               remise_produit:
 *                 type: number
 *                 default: 0
 *                 description: Remise appliquée sur le produit (en pourcentage).
 *               quantite_prestation:
 *                 type: integer
 *                 default: 0
 *                 description: Quantité de prestation effectuée.
 *               remise_prestation:
 *                 type: number
 *                 default: 0
 *                 description: Remise appliquée sur la prestation (en pourcentage).
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
 *                 facture:
 *                   type: object
 *       400:
 *         description: Stock insuffisant ou données invalides.
 *       404:
 *         description: Produit ou prestation introuvable.
 *       500:
 *         description: Erreur serveur lors de la création de la facture.
 */
router.post("/ajouter", ajouterFacture);


/**
 * @swagger
 * /factures/modifier/{id}:
 *   put:
 *     summary: Modifier une facture existante
 *     description: Met à jour une facture par son ID. Gère les mises à jour de produits et prestations, ainsi que la gestion du stock si nécessaire.
 *     tags:
 *       - Factures
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la facture à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Devis, Facture]
 *               userId:
 *                 type: integer
 *               clientId:
 *                 type: integer
 *               produitId:
 *                 type: integer
 *                 nullable: true
 *               prestationId:
 *                 type: integer
 *                 nullable: true
 *               quantite_produit:
 *                 type: integer
 *                 default: 0
 *               remise_produit:
 *                 type: number
 *                 format: float
 *                 default: 0
 *               quantite_prestation:
 *                 type: integer
 *                 default: 0
 *               remise_prestation:
 *                 type: number
 *                 format: float
 *                 default: 0
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
 *                   $ref: "#/components/schemas/Facture"
 *       400:
 *         description: "Erreur de validation (ex: stock insuffisant)"
 *       404:
 *         description: Facture, produit ou prestation introuvable
 *       500:
 *         description: Erreur serveur lors de la mise à jour
 */


router.put("/modifier/:id", modifierFacture);

/**
 * @swagger
 * /factures/convertir/{id}:
 *   put:
 *     summary: Convertit un devis en facture
 *     description: Cette route permet de convertir un devis en facture en recalculant les prix et en mettant à jour le stock des produits si nécessaire.
 *     tags:
 *       - Factures
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du devis à convertir en facture
 *     responses:
 *       200:
 *         description: Facture convertie avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Facture convertie avec succès
 *                 facture:
 *                   $ref: '#/components/schemas/Facture'
 *       400:
 *         description: Erreur de validation (stock insuffisant, type incorrect, etc.)
 *       404:
 *         description: Facture ou produit introuvable
 *       500:
 *         description: Erreur serveur lors de la conversion
 */


router.put("/convertir/:id/", convertirTypeFacture);



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
router.delete("/supprimer/:id", supprimerFacture); 

/**
 * @swagger
 * /factures/recuperer/toute:
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

router.get("/recuperer/toute", recupererToutesLesFactures);

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

router.get("/recuperer/:id", recupererUneFacture);




export default router;
