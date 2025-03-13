import express from 'express';
import { ajouterProduit, deleteProduit, modifierProduit } from '../controllers/produitController';

const router = express.Router();

/**
 * @swagger
 * /produits/ajouter:
 *   post:
 *     summary: Ajouter un nouveau produit
 *     description: Crée un nouveau produit avec les informations fournies.
 *     tags:
 *       - Produits
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - marque
 *               - modele
 *               - Largeur_pneu
 *               - profil_pneu
 *               - type_pneu
 *               - diametre
 *               - indice_charge
 *               - indice_vitesse
 *               - renfort
 *               - stock
 *               - prix
 *             properties:
 *               marque:
 *                 type: string
 *                 enum: [Michelin, Bridgestone, Hankook, Goodyear]
 *                 example: Michelin
 *               modele:
 *                 type: string
 *                 example: Primacy 4
 *               Largeur_pneu:
 *                 type: integer
 *                 example: 205
 *               profil_pneu:
 *                 type: integer
 *                 example: 55
 *               type_pneu:
 *                 type: string
 *                 enum: [R, D]
 *                 example: R
 *               diametre:
 *                 type: integer
 *                 example: 16
 *               indice_charge:
 *                 type: integer
 *                 minimum: 85
 *                 maximum: 130
 *                 example: 91
 *               indice_vitesse:
 *                 type: string
 *                 enum: [H, T, V]
 *                 example: H
 *               renfort:
 *                 type: string
 *                 enum: [XL, C, LT, RF, RS]
 *                 example: XL
 *               stock:
 *                 type: integer
 *                 example: 50
 *               prix:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *     responses:
 *       201:
 *         description: Produit ajouté avec succès
 *       400:
 *         description: Données manquantes ou invalides
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/ajouter', ajouterProduit);

/**
 * @swagger
 * /produits/modifier/{id}:
 *   put:
 *     summary: Modifier un produit existant
 *     description: Met à jour les informations d'un produit existant en fonction de son ID.
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marque:
 *                 type: string
 *                 example: Michelin
 *               modele:
 *                 type: string
 *                 example: Primacy 4
 *               Largeur_pneu:
 *                 type: integer
 *                 example: 205
 *               profil_pneu:
 *                 type: integer
 *                 example: 55
 *               type_pneu:
 *                 type: string
 *                 example: R
 *               diametre:
 *                 type: integer
 *                 example: 16
 *               indice_charge:
 *                 type: integer
 *                 example: 91
 *               indice_vitesse:
 *                 type: string
 *                 example: H
 *               renfort:
 *                 type: string
 *                 example: XL
 *               stock:
 *                 type: integer
 *                 example: 50
 *               prix:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *     responses:
 *       200:
 *         description: Produit modifié avec succès
 *       400:
 *         description: Données invalides ou manquantes
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/modifier/:id', modifierProduit);


/**
 * @swagger
 * /produits/delete/{id}:
 *   delete:
 *     summary: Supprime un produit par ID
 *     description: Supprime un produit existant de la base de données en fonction de son ID.
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/delete/:id", deleteProduit);



export default router;