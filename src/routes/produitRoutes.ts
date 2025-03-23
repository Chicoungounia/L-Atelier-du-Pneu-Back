import express from 'express';
import { afficherAllProduit, afficherAllTrueProduit, ajouterProduit, modifierProduit } from '../controllers/produitController';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { isAdmin } from '../middlewares/verifyAdminMiddleware';

const router = express.Router();

/**
 * @swagger
 * /produits/ajouter:
 *   post:
 *     summary: Ajouter un nouveau produit
 *     description: Permet d'ajouter un nouveau produit avec un statut par défaut à true.
 *     tags:
 *       - Produits
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - saison
 *               - marque
 *               - modele
 *               - largeur_pneu
 *               - profil_pneu
 *               - type_pneu
 *               - diametre
 *               - indice_charge
 *               - indice_vitesse
 *               - renfort
 *               - stock
 *               - prix
 *             properties:
 *               saison:
 *                 type: string
 *                 enum: [été, hiver, 4_saisons]
 *                 example: "été"
 *               marque:
 *                 type: string
 *                 enum: [Michelin, Bridgestone, Hankook, Goodyear]
 *                 example: "Michelin"
 *               modele:
 *                 type: string
 *                 example: "Pilot Sport 4"
 *               largeur_pneu:
 *                 type: integer
 *                 example: 225
 *               profil_pneu:
 *                 type: integer
 *                 example: 45
 *               type_pneu:
 *                 type: string
 *                 enum: [R, D]
 *                 example: "R"
 *               diametre:
 *                 type: integer
 *                 example: 18
 *               indice_charge:
 *                 type: integer
 *                 example: 95
 *               indice_vitesse:
 *                 type: string
 *                 enum: [H, T, V, W, Y]
 *                 example: "W"
 *               renfort:
 *                 type: string
 *                 enum: [XL, C, LT, RF, RS]
 *                 example: "XL"
 *               stock:
 *                 type: integer
 *                 example: 10
 *               prix_htva:
 *                 type: number
 *                 format: float
 *                 example: 120.50
 *               image:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Produit ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit ajouté avec succès"
 *                 produit:
 *                   $ref: '#/components/schemas/Produit'
 *       400:
 *         description: Erreur de validation des champs obligatoires.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/ajouter', verifyTokenMiddleware, isAdmin, ajouterProduit);

/**
 * @swagger
 * /produits/modifier/{id}:
 *   put:
 *     summary: Modifier un produit existant
 *     description: Met à jour les informations d'un produit sans obliger à entrer le statut.
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à modifier
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saison:
 *                 type: string
 *                 enum: [été, hiver, 4_saisons]
 *                 example: "hiver"
 *               marque:
 *                 type: string
 *                 example: "Bridgestone"
 *               modele:
 *                 type: string
 *                 example: "Blizzak LM005"
 *               largeur_pneu:
 *                 type: integer
 *                 example: 205
 *               profil_pneu:
 *                 type: integer
 *                 example: 55
 *               type_pneu:
 *                 type: string
 *                 enum: [R, D]
 *                 example: "R"
 *               diametre:
 *                 type: integer
 *                 example: 16
 *               indice_charge:
 *                 type: integer
 *                 example: 91
 *               indice_vitesse:
 *                 type: string
 *                 enum: [H, T, V, W, Y]
 *                 example: "H"
 *               renfort:
 *                 type: string
 *                 enum: [XL, C, LT, RF, RS]
 *                 example: "RF"
 *               stock:
 *                 type: integer
 *                 example: 20
 *               prix_htva:
 *                 type: number
 *                 format: float
 *                 example: 95.99
 *               image:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/image.jpg"
 *               status:
 *                 type: boolean
 *                 description: Actif (true) ou inactif (false)
 *                 example: true
 *     responses:
 *       200:
 *         description: Produit modifié avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit modifié avec succès"
 *                 produit:
 *                   $ref: '#/components/schemas/Produit'
 *       400:
 *         description: ID invalide ou erreur de validation.
 *       404:
 *         description: Produit non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.put('/modifier/:id', verifyTokenMiddleware, isAdmin, modifierProduit);

/**
 * @swagger
 * /produits/afficher/true:
 *   get:
 *     summary: Récupérer tous les produits actifs
 *     description: Retourne la liste des produits dont le statut est "true".
 *     tags:
 *       - Produits
 *     responses:
 *       200:
 *         description: Liste des produits actifs récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produit'
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/afficher/true',verifyTokenMiddleware, afficherAllTrueProduit);

/**
 * @swagger
 * /produits/afficher/all:
 *   get:
 *     summary: Récupérer tous les produits
 *     description: Retourne la liste complète des produits, qu'ils soient actifs ou non.
 *     tags:
 *       - Produits
 *     responses:
 *       200:
 *         description: Liste complète des produits récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produit'
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/afficher/all',verifyTokenMiddleware, isAdmin, afficherAllProduit);



export default router;