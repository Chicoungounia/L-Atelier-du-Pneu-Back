import { 
    ajouterProduit, 
    modifierProduit, 
    modifierStatusProduit, 
    afficherAllTrueProduit, 
    afficherProduit, 
    afficherAllProduit,
    getStocks,
    searchProduit
} from "../controllers/produitController";
import Produit from "../models/produitModel";
import sequelize from "../config/database";

// Mock console.error pour éviter les sorties dans les tests
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

describe("Produit Controller", () => {
    let req: any;
    let res: any;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        req = { params: {}, body: {}, query: {} };
        res = { status: statusMock, json: jsonMock };
        
        // Mock des méthodes Sequelize
        jest.spyOn(Produit, 'create').mockImplementation();
        jest.spyOn(Produit, 'findByPk').mockImplementation();
        jest.spyOn(Produit, 'findAll').mockImplementation();
        jest.spyOn(sequelize, 'query').mockImplementation();
        
        jest.clearAllMocks();
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
    });

    describe("Ajouter un produit", () => {
        const produitComplet = {
            saison: "été",
            marque: "Michelin",
            modele: "Primacy 4",
            largeur_pneu: 225,
            profil_pneu: 45,
            type_pneu: "R",
            diametre: 16,
            indice_charge: 91,
            indice_vitesse: "V",
            renfort: "XL",
            stock: 10,
            prix_htva: 120.50
        };

        it("devrait retourner une erreur 400 si des champs obligatoires sont manquants", async () => {
            req.body = { saison: "été", marque: "Michelin" }; // Champs manquants
            
            await ajouterProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Tous les champs obligatoires doivent être remplis." 
            });
        });

        it("devrait retourner une erreur 400 si le stock est undefined", async () => {
            req.body = { ...produitComplet };
            delete req.body.stock;
            
            await ajouterProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Tous les champs obligatoires doivent être remplis." 
            });
        });

        it("devrait retourner une erreur 400 si le prix_htva est undefined", async () => {
            req.body = { ...produitComplet };
            delete req.body.prix_htva;
            
            await ajouterProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Tous les champs obligatoires doivent être remplis." 
            });
        });

        it("devrait créer un produit avec succès même avec stock = 0", async () => {
            const mockProduitData = {
                id: 1,
                ...produitComplet,
                stock: 0,
                image: null,
                status: true
            };
            
            req.body = { ...produitComplet, stock: 0 };
            (Produit.create as jest.Mock).mockResolvedValue(mockProduitData);
            
            await ajouterProduit(req, res);
            
            expect(Produit.create).toHaveBeenCalledWith({
                ...produitComplet,
                stock: 0,
                image: null,
                status: true
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Produit ajouté avec succès",
                produit: mockProduitData
            });
        });

        it("devrait créer un produit avec succès avec une image", async () => {
            const mockProduitData = {
                id: 1,
                ...produitComplet,
                image: "image.jpg",
                status: true
            };
            
            req.body = { ...produitComplet, image: "image.jpg" };
            (Produit.create as jest.Mock).mockResolvedValue(mockProduitData);
            
            await ajouterProduit(req, res);
            
            expect(Produit.create).toHaveBeenCalledWith({
                ...produitComplet,
                image: "image.jpg",
                status: true
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Produit ajouté avec succès",
                produit: mockProduitData
            });
        });

        it("devrait gérer les erreurs du serveur lors de l'ajout", async () => {
            req.body = produitComplet;
            (Produit.create as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await ajouterProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Modifier un produit", () => {
        it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
            req.params = { id: "invalid" };
            req.body = { saison: "hiver" };
            
            await modifierProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
        });

        it("devrait retourner une erreur 404 si le produit n'existe pas", async () => {
            req.params = { id: "999" };
            req.body = { saison: "hiver" };
            (Produit.findByPk as jest.Mock).mockResolvedValue(null);
            
            await modifierProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Produit non trouvé" });
        });

        it("devrait modifier un produit avec succès", async () => {
            const mockProduitInstance = {
                id: 1,
                saison: "été",
                marque: "Michelin",
                stock: 10,
                prix_htva: 120.50,
                update: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            req.body = { saison: "hiver", stock: 15 };
            (Produit.findByPk as jest.Mock).mockResolvedValue(mockProduitInstance);
            
            await modifierProduit(req, res);
            
            expect(mockProduitInstance.update).toHaveBeenCalledWith(expect.objectContaining({
                saison: "hiver",
                stock: 15
            }));
            expect(statusMock).toHaveBeenCalledWith(200);
        });

        it("devrait gérer les erreurs du serveur lors de la modification", async () => {
            req.params = { id: "1" };
            req.body = { saison: "hiver" };
            (Produit.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await modifierProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Modifier le statut d'un produit", () => {
        it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
            req.params = { id: "invalid" };
            
            await modifierStatusProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
        });

        it("devrait retourner une erreur 404 si le produit n'existe pas", async () => {
            req.params = { id: "999" };
            (Produit.findByPk as jest.Mock).mockResolvedValue(null);
            
            await modifierStatusProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Produit non trouvé" });
        });

        it("devrait inverser le statut d'un produit (true vers false)", async () => {
            const mockProduitInstance = {
                id: 1,
                status: true,
                save: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            (Produit.findByPk as jest.Mock).mockResolvedValue(mockProduitInstance);
            
            await modifierStatusProduit(req, res);
            
            expect(mockProduitInstance.status).toBe(false);
            expect(mockProduitInstance.save).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Statut du produit mis à jour avec succès",
                produit: mockProduitInstance
            });
        });

        it("devrait gérer les erreurs du serveur lors de la modification du statut", async () => {
            req.params = { id: "1" };
            (Produit.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await modifierStatusProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Afficher les produits actifs", () => {
        it("devrait retourner la liste des produits actifs", async () => {
            const mockProduits = [
                { id: 1, saison: "été", marque: "Michelin", status: true },
                { id: 2, saison: "hiver", marque: "Bridgestone", status: true }
            ];
            
            (Produit.findAll as jest.Mock).mockResolvedValue(mockProduits);
            
            await afficherAllTrueProduit(req, res);
            
            expect(Produit.findAll).toHaveBeenCalledWith({
                where: { status: true }
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockProduits);
        });

        it("devrait gérer les erreurs du serveur", async () => {
            (Produit.findAll as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await afficherAllTrueProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Afficher un produit", () => {
        it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
            req.params = { id: "invalid" };
            
            await afficherProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
        });

        it("devrait retourner une erreur 404 si le produit n'existe pas", async () => {
            req.params = { id: "999" };
            (Produit.findByPk as jest.Mock).mockResolvedValue(null);
            
            await afficherProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Produit non trouvé" });
        });

        it("devrait retourner le produit avec succès", async () => {
            const mockProduitData = {
                id: 1,
                saison: "été",
                marque: "Michelin",
                modele: "Primacy 4"
            };
            
            req.params = { id: "1" };
            (Produit.findByPk as jest.Mock).mockResolvedValue(mockProduitData);
            
            await afficherProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Produit récupéré avec succès",
                produit: mockProduitData
            });
        });

        it("devrait gérer les erreurs du serveur", async () => {
            req.params = { id: "1" };
            (Produit.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await afficherProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Afficher tous les produits", () => {
        it("devrait retourner tous les produits", async () => {
            const mockProduits = [
                { id: 1, saison: "été", marque: "Michelin", status: true },
                { id: 2, saison: "hiver", marque: "Bridgestone", status: false }
            ];
            
            (Produit.findAll as jest.Mock).mockResolvedValue(mockProduits);
            
            await afficherAllProduit(req, res);
            
            expect(Produit.findAll).toHaveBeenCalledWith();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockProduits);
        });

        it("devrait gérer les erreurs du serveur", async () => {
            (Produit.findAll as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await afficherAllProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Récupérer les stocks", () => {
        it("devrait retourner les stocks des produits", async () => {
            const mockStocks = [
                { id: 1, saison: "été", marque: "Michelin", modele: "Primacy 4", stock: 10 },
                { id: 2, saison: "hiver", marque: "Bridgestone", modele: "Blizzak", stock: 5 }
            ];
            
            (Produit.findAll as jest.Mock).mockResolvedValue(mockStocks);
            
            await getStocks(req, res);
            
            expect(Produit.findAll).toHaveBeenCalledWith({
                attributes: [
                    'id',
                    'saison',
                    'marque',
                    'modele',
                    'largeur_pneu',
                    'profil_pneu',
                    'diametre',
                    'stock'
                ],
                order: [['modele', 'ASC']]
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Stocks récupérés avec succès.",
                data: mockStocks
            });
        });

        it("devrait gérer les erreurs du serveur", async () => {
            (Produit.findAll as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await getStocks(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur." });
        });
    });

    describe("Rechercher des produits", () => {
        it("devrait effectuer une recherche avec des paramètres simples", async () => {
            const mockProduits = [
                { id: 1, saison: "été", marque: "Michelin", modele: "Primacy 4" }
            ];
            
            req.query = { saison: "été", marque: "Michelin" };
            (sequelize.query as jest.Mock).mockResolvedValue(mockProduits);
            
            await searchProduit(req, res);
            
            expect(sequelize.query).toHaveBeenCalledWith(
                expect.stringContaining("SELECT id, saison, marque, modele"),
                expect.objectContaining({
                    replacements: expect.objectContaining({
                        saison: "été",
                        marque: "Michelin"
                    }),
                    type: "SELECT",
                    raw: true
                })
            );
            expect(jsonMock).toHaveBeenCalledWith(mockProduits);
        });

        it("devrait effectuer une recherche avec référence valide", async () => {
            const mockProduits = [
                { id: 1, largeur_pneu: 225, profil_pneu: 45, diametre: 16 }
            ];
            
            req.query = { reference: "225/45/16" };
            (sequelize.query as jest.Mock).mockResolvedValue(mockProduits);
            
            await searchProduit(req, res);
            
            expect(sequelize.query).toHaveBeenCalledWith(
                expect.stringContaining("largeur_pneu = :largeur_pneu AND profil_pneu = :profil_pneu AND diametre = :diametre"),
                expect.objectContaining({
                    replacements: expect.objectContaining({
                        largeur_pneu: 225,
                        profil_pneu: 45,
                        diametre: 16
                    })
                })
            );
            expect(jsonMock).toHaveBeenCalledWith(mockProduits);
        });

        it("devrait retourner une erreur 400 pour une référence invalide", async () => {
            req.query = { reference: "invalid-format" };
            
            await searchProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Format de référence invalide. Utiliser '225/45/16'." 
            });
        });

        it("devrait gérer les erreurs de recherche", async () => {
            req.query = { saison: "été" };
            (sequelize.query as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await searchProduit(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });
});
