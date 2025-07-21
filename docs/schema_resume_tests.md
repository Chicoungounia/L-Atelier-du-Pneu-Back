# Schéma résumé des tests principaux

## AuthController
- Vérification des champs obligatoires (email, password)
- Utilisateur non trouvé
- Compte inactif
- Mot de passe incorrect
- Génération du token et cookie
- Gestion des erreurs serveur

## UserController
- Modification utilisateur : token manquant, rôle non admin, utilisateur non trouvé, succès, erreur serveur
- Modification statut : token manquant, rôle non admin, succès
- Affichage utilisateur : token manquant, token invalide, utilisateur non trouvé, succès

## ClientController
- Ajout client : champs obligatoires, succès, erreur serveur
- Modification client : ID invalide, client non trouvé, aucun champ, succès, erreur serveur
- Modification statut : ID invalide, client non trouvé, statut invalide, succès
- Affichage clients actifs/tous/un : ID invalide, client non trouvé, succès, erreur serveur
- Recherche client : succès, erreur serveur

## ProduitController
- Ajout produit : champs obligatoires, stock/prix undefined, succès (stock=0, image), erreur serveur
- Modification produit : ID invalide, produit non trouvé, succès, erreur serveur
- Modification statut : ID invalide, produit non trouvé, toggle statut, erreur serveur
- Affichage produits actifs/tous/un : ID invalide, produit non trouvé, succès, erreur serveur
- Récupération stocks : succès, erreur serveur
- Recherche produit : paramètres simples, référence, format invalide, erreur serveur

## PrestationController
- Ajout prestation : champs obligatoires, prix_htva=0, succès, erreur serveur
- Modification prestation : prestation non trouvée, succès (tous champs/statut), erreur serveur
- Modification statut : ID invalide, prestation non trouvée, toggle statut, erreur serveur
- Affichage prestation/actives/toutes : ID invalide, prestation non trouvée, succès, erreur serveur

## RendezVousController
- Ajout rendez-vous : champs obligatoires, rôle ouvrier, date passée/dimanche/horaire, succès, erreur serveur
- Modification rendez-vous : date passée, succès, erreur serveur
- Suppression rendez-vous : non trouvé, succès, erreur serveur
- Affichage rendez-vous/tous/réservés/client : ID invalide, non trouvé, succès, erreur serveur
- Recherche rendez-vous : avec/sans paramètres, erreur serveur

## FactureController
- Ajout facture : utilisateur inactif, produit non trouvé, stock insuffisant, succès, rollback erreur
- Modification facture : non trouvée, type devis, succès
- Modification type/paiement : non trouvée, statut invalide, conversion devis->facture, succès
- Affichage factures/devis/une/à payer : non trouvée, succès, erreur serveur
- Calculs totaux : jour/mois/an/période, format date invalide, succès, erreur serveur

---

**Ce schéma synthétise les cas principaux testés pour chaque domaine métier.**
