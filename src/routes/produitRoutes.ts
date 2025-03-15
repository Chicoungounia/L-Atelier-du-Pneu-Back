import express from 'express';
import { ajouterProduit, deleteProduit, modifierProduit } from '../controllers/produitController';

const router = express.Router();

/**
 * @swagger
 * /produits/ajouter:
 *   post:
 *     summary: Ajouter un nouveau produit
 *     description: Cette route permet d'ajouter un nouveau produit dans la base de données.
 *     tags:
 *       - Produits
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saison:
 *                 type: string
 *                 example: "été"
 *               marque:
 *                 type: string
 *                 example: "Michelin"
 *               modele:
 *                 type: string
 *                 example: "Primacy 5"
 *               Largeur_pneu:
 *                 type: string
 *                 example: "205"
 *               profil_pneu:
 *                 type: string
 *                 example: "55"
 *               type_pneu:
 *                 type: string
 *                 example: "R"
 *               diametre:
 *                 type: string
 *                 example: "16"
 *               indice_charge:
 *                 type: string
 *                 example: "91"
 *               indice_vitesse:
 *                 type: string
 *                 example: "V"
 *               renfort:
 *                 type: string
 *                 example: "XL"
 *               stock:
 *                 type: integer
 *                 example: 100
 *               prix:
 *                 type: number
 *                 example: 120.99
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Produit ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit ajouté avec succès"
 *                 produit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     saison:
 *                       type: string
 *                       example: "été"
 *                     marque:
 *                       type: string
 *                       example: "Michelin"
 *                     modele:
 *                       type: string
 *                       example: "Primacy 5"
 *                     Largeur_pneu:
 *                       type: string
 *                       example: "205"
 *                     profil_pneu:
 *                       type: string
 *                       example: "55"
 *                     type_pneu:
 *                       type: string
 *                       example: "R"
 *                     diametre:
 *                       type: string
 *                       example: "16"
 *                     indice_charge:
 *                       type: string
 *                       example: "91"
 *                     indice_vitesse:
 *                       type: string
 *                       example: "V"
 *                     renfort:
 *                       type: string
 *                       example: "XL"
 *                     stock:
 *                       type: integer
 *                       example: 100
 *                     prix:
 *                       type: number
 *                       example: 120.99
 *                     image:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *       400:
 *         description: Paramètres manquants ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tous les champs sont requis."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur interne du serveur"
 *       
 */
router.post('/ajouter', ajouterProduit);

/**
 * @swagger
 * /produits/modifier/{id}:
 *   put:
 *     summary: Modifier un produit existant
 *     description: Cette route permet de modifier un produit existant dans la base de données.
 *     tags:
 *       - Produits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saison:
 *                 type: string
 *                 example: "été"
 *               marque:
 *                 type: string
 *                 example: "Michelin"
 *               modele:
 *                 type: string
 *                 example: "Primacy 5"
 *               Largeur_pneu:
 *                 type: string
 *                 example: "205"
 *               profil_pneu:
 *                 type: string
 *                 example: "55"
 *               type_pneu:
 *                 type: string
 *                 example: "R"
 *               diametre:
 *                 type: string
 *                 example: "16"
 *               indice_charge:
 *                 type: string
 *                 example: "91"
 *               indice_vitesse:
 *                 type: string
 *                 example: "V"
 *               renfort:
 *                 type: string
 *                 example: "XL"
 *               stock:
 *                 type: integer
 *                 example: 100
 *               prix:
 *                 type: number
 *                 example: 120.99
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       200:
 *         description: Produit modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produit modifié avec succès"
 *                 produit:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     saison:
 *                       type: string
 *                       example: "été"
 *                     marque:
 *                       type: string
 *                       example: "Michelin"
 *                     modele:
 *                       type: string
 *                       example: "Primacy 5"
 *                     Largeur_pneu:
 *                       type: string
 *                       example: "205"
 *                     profil_pneu:
 *                       type: string
 *                       example: "55"
 *                     type_pneu:
 *                       type: string
 *                       example: "R"
 *                     diametre:
 *                       type: string
 *                       example: "16"
 *                     indice_charge:
 *                       type: string
 *                       example: "91"
 *                     indice_vitesse:
 *                       type: string
 *                       example: "V"
 *                     renfort:
 *                       type: string
 *                       example: "XL"
 *                     stock:
 *                       type: integer
 *                       example: 100
 *                     prix:
 *                       type: number
 *                       example: 120.99
 *                     image:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *       400:
 *         description: Paramètres manquants ou invalides
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/modifier/:id", modifierProduit);



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