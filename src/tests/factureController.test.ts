import { 
    ajouterFacture, 
    modifierFacture, 
    modifierTypeEtPayement, 
    afficherAllFactures, 
    afficherUne, 
    afficherTypeDevis, 
    afficherTypeFactures, 
    afficherAllApayer,
    sommeTotalFactureParJour,
    sommeTotalFactureParMois,
    sommeTotalFactureParAn,
    searchChiffreAffaire,
    searchPeriodeChiffreAffaire
} from "../controllers/factureController";
import Facture from "../models/factureModels";
import FactureProduit from "../models/factureProduitModel";
import FacturePrestation from "../models/facturePrestationModel";
import Produit from "../models/produitModel";
import Prestation from "../models/prestationModels";
import RendezVous from "../models/rendezVousModel";
import { User } from "../models/userModels";
import Client from "../models/clientModel";
import sequelize from "../config/database";

// Mock console.error pour éviter les sorties dans les tests
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe("Facture Controller", () => {
    let req: any;
    let res: any;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
    let mockTransaction: any;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        req = { params: {}, body: {}, query: {} };
        res = { status: statusMock, json: jsonMock };
        
        // Mock de la transaction
        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn()
        };
        
        // Mock des méthodes Sequelize
        jest.spyOn(sequelize, 'transaction').mockResolvedValue(mockTransaction);
        jest.spyOn(Facture, 'create').mockImplementation();
        jest.spyOn(Facture, 'findByPk').mockImplementation();
        jest.spyOn(Facture, 'findAll').mockImplementation();
        jest.spyOn(Facture, 'sum').mockImplementation();
        jest.spyOn(FactureProduit, 'create').mockImplementation();
        jest.spyOn(FactureProduit, 'findAll').mockImplementation();
        jest.spyOn(FactureProduit, 'destroy').mockImplementation();
        jest.spyOn(FacturePrestation, 'create').mockImplementation();
        jest.spyOn(FacturePrestation, 'destroy').mockImplementation();
        jest.spyOn(Produit, 'findByPk').mockImplementation();
        jest.spyOn(Prestation, 'findByPk').mockImplementation();
        jest.spyOn(User, 'findByPk').mockImplementation();
        jest.spyOn(Client, 'findByPk').mockImplementation();
        jest.spyOn(RendezVous, 'findByPk').mockImplementation();
        
        jest.clearAllMocks();
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("Ajouter une facture", () => {
        const factureComplete = {
            type: "Facture",
            userId: 1,
            clientId: 1,
            rendezVousId: 1,
            produits: [
                { produitId: 1, quantite: 2, remise: 10 }
            ],
            prestations: [
                { prestationId: 1, quantite: 1, remise: 0 }
            ],
            status_payement: "A payer",
            mode_payement: "Carte bancaire"
        };

        it("devrait retourner une erreur 403 si l'utilisateur est inactif", async () => {
            req.body = factureComplete;
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 1, status: "Inactif" });
            
            await ajouterFacture(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Utilisateur inactif, création de facture interdite" 
            });
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        it("devrait retourner une erreur 400 si le produit n'existe pas", async () => {
            req.body = factureComplete;
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 1, status: "Actif" });
            (Produit.findByPk as jest.Mock).mockResolvedValue(null);
            
            await ajouterFacture(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Produit 1 introuvable ou inactif" 
            });
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        it("devrait retourner une erreur 400 si le stock est insuffisant", async () => {
            req.body = factureComplete;
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 1, status: "Actif" });
            (Produit.findByPk as jest.Mock).mockResolvedValue({ 
                id: 1, 
                prix_htva: 100, 
                stock: 1, 
                status: true 
            });
            
            await ajouterFacture(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Stock insuffisant pour le produit 1" 
            });
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        it("devrait créer une facture avec succès", async () => {
            const mockFacture = {
                id: 1,
                type: "Facture",
                userId: 1,
                clientId: 1,
                total_htva: 0,
                total_remise: 0,
                total_tva: 0,
                total: 0,
                status_payement: "A payer",
                mode_payement: "Carte bancaire",
                update: jest.fn()
            };
            
            const mockProduit = {
                id: 1,
                prix_htva: 100,
                stock: 5,
                status: true,
                save: jest.fn()
            };
            
            const mockPrestation = {
                id: 1,
                prix_htva: 50,
                status: true
            };
            
            const mockRendezVous = {
                id: 1,
                update: jest.fn()
            };
            
            req.body = factureComplete;
            (User.findByPk as jest.Mock).mockResolvedValue({ id: 1, status: "Actif" });
            (Facture.create as jest.Mock).mockResolvedValue(mockFacture);
            (Produit.findByPk as jest.Mock).mockResolvedValue(mockProduit);
            (Prestation.findByPk as jest.Mock).mockResolvedValue(mockPrestation);
            (RendezVous.findByPk as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await ajouterFacture(req, res);
            
            expect(Facture.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Facture",
                    userId: 1,
                    clientId: 1,
                    rendezVousId: 1,
                    status_payement: "A payer",
                    mode_payement: "Carte bancaire"
                }),
                { transaction: mockTransaction }
            );
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(201);
        });

        it("devrait gérer les erreurs et effectuer un rollback", async () => {
            req.body = factureComplete;
            (User.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await ajouterFacture(req, res);
            
            expect(mockTransaction.rollback).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Erreur lors de la création de la facture", 
                error: expect.any(Error) 
            });
        });
    });

    describe("Modifier une facture", () => {
        it("devrait retourner une erreur 404 si la facture n'existe pas", async () => {
            req.params = { id: "999" };
            req.body = { produits: [], prestations: [] };
            (Facture.findByPk as jest.Mock).mockResolvedValue(null);
            
            await modifierFacture(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Facture introuvable" });
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        it("devrait retourner une erreur 400 si on essaie de modifier un devis", async () => {
            req.params = { id: "1" };
            req.body = { produits: [], prestations: [] };
            (Facture.findByPk as jest.Mock).mockResolvedValue({ id: 1, type: "Devis" });
            
            await modifierFacture(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Impossible de modifier un devis" });
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        it("devrait modifier une facture avec succès", async () => {
            const mockFacture = {
                id: 1,
                type: "Facture",
                update: jest.fn()
            };
            
            req.params = { id: "1" };
            req.body = { 
                produits: [], 
                prestations: [], 
                status_payement: "Payer",
                mode_payement: "Espèces"
            };
            
            (Facture.findByPk as jest.Mock).mockResolvedValue(mockFacture);
            (FactureProduit.findAll as jest.Mock).mockResolvedValue([]);
            (FactureProduit.destroy as jest.Mock).mockResolvedValue(true);
            (FacturePrestation.destroy as jest.Mock).mockResolvedValue(true);
            
            await modifierFacture(req, res);
            
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Facture mise à jour avec succès",
                facture: mockFacture
            });
        });
    });

    describe("Modifier le type et le paiement", () => {
        it("devrait retourner une erreur 404 si la facture n'existe pas", async () => {
            req.params = { id: "999" };
            req.body = { type: "Facture" };
            (Facture.findByPk as jest.Mock).mockResolvedValue(null);
            
            await modifierTypeEtPayement(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Facture introuvable" });
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        it("devrait retourner une erreur 400 pour un statut de paiement invalide", async () => {
            req.params = { id: "1" };
            req.body = { status_payement: "Invalide" };
            (Facture.findByPk as jest.Mock).mockResolvedValue({ id: 1, type: "Devis" });
            
            await modifierTypeEtPayement(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Statut de paiement invalide" });
            expect(mockTransaction.rollback).toHaveBeenCalled();
        });

        it("devrait convertir un devis en facture avec succès", async () => {
            const mockFacture = {
                id: 1,
                type: "Devis",
                rendezVousId: 1,
                status_payement: "A payer",
                mode_payement: "Carte bancaire",
                save: jest.fn()
            };
            
            const mockRendezVous = {
                id: 1,
                update: jest.fn()
            };
            
            req.params = { id: "1" };
            req.body = { 
                type: "Facture", 
                status_payement: "Payer",
                mode_payement: "Espèces"
            };
            
            (Facture.findByPk as jest.Mock).mockResolvedValue(mockFacture);
            (FactureProduit.findAll as jest.Mock).mockResolvedValue([]);
            (RendezVous.findByPk as jest.Mock).mockResolvedValue(mockRendezVous);
            
            await modifierTypeEtPayement(req, res);
            
            expect(mockFacture.type).toBe("Facture");
            expect(mockFacture.status_payement).toBe("Payer");
            expect(mockFacture.mode_payement).toBe("Espèces");
            expect(mockRendezVous.update).toHaveBeenCalledWith(
                { status: "Effectuer" },
                { transaction: mockTransaction }
            );
            expect(mockTransaction.commit).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
        });
    });

    describe("Afficher toutes les factures", () => {
        it("devrait retourner toutes les factures avec succès", async () => {
            const mockFactures = [
                { id: 1, type: "Facture", total: 100 },
                { id: 2, type: "Devis", total: 200 }
            ];
            
            (Facture.findAll as jest.Mock).mockResolvedValue(mockFactures);
            
            await afficherAllFactures(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Toutes les factures récupérées avec succès",
                factures: mockFactures
            });
        });

        it("devrait gérer les erreurs", async () => {
            (Facture.findAll as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await afficherAllFactures(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Erreur lors de la récupération des factures", 
                error: expect.any(Error) 
            });
        });
    });

    describe("Afficher une facture", () => {
        it("devrait retourner une erreur 404 si la facture n'existe pas", async () => {
            req.params = { id: "999" };
            (Facture.findByPk as jest.Mock).mockResolvedValue(null);
            
            await afficherUne(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Facture introuvable" });
        });

        it("devrait retourner une facture avec succès", async () => {
            const mockFacture = {
                id: 1,
                type: "Facture",
                total: 100,
                Client: { nom: "Dupont", prenom: "Jean" },
                User: { speudo: "admin" }
            };
            
            req.params = { id: "1" };
            (Facture.findByPk as jest.Mock).mockResolvedValue(mockFacture);
            
            await afficherUne(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Facture récupérée avec succès",
                facture: mockFacture
            });
        });
    });

    describe("Afficher les devis", () => {
        it("devrait retourner tous les devis", async () => {
            const mockDevis = [
                { id: 1, type: "Devis", total: 100 },
                { id: 2, type: "Devis", total: 200 }
            ];
            
            (Facture.findAll as jest.Mock).mockResolvedValue(mockDevis);
            
            await afficherTypeDevis(req, res);
            
            expect(Facture.findAll).toHaveBeenCalledWith({ where: { type: "Devis" } });
            expect(jsonMock).toHaveBeenCalledWith(mockDevis);
        });

        it("devrait gérer les erreurs", async () => {
            (Facture.findAll as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await afficherTypeDevis(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Erreur lors de la récupération des devis", 
                error: expect.any(Error) 
            });
        });
    });

    describe("Afficher les factures", () => {
        it("devrait retourner toutes les factures", async () => {
            const mockFactures = [
                { id: 1, type: "Facture", total: 100 },
                { id: 2, type: "Facture", total: 200 }
            ];
            
            (Facture.findAll as jest.Mock).mockResolvedValue(mockFactures);
            
            await afficherTypeFactures(req, res);
            
            expect(Facture.findAll).toHaveBeenCalledWith({ where: { type: "Facture" } });
            expect(jsonMock).toHaveBeenCalledWith(mockFactures);
        });
    });

    describe("Afficher les factures à payer", () => {
        it("devrait retourner les factures à payer", async () => {
            const mockFactures = [
                { id: 1, type: "Facture", status_payement: "A payer", total: 100 }
            ];
            
            (Facture.findAll as jest.Mock).mockResolvedValue(mockFactures);
            
            await afficherAllApayer(req, res);
            
            expect(Facture.findAll).toHaveBeenCalledWith({
                where: {
                    type: "Facture",
                    status_payement: "A payer"
                }
            });
            expect(jsonMock).toHaveBeenCalledWith(mockFactures);
        });
    });

    describe("Calculs des totaux", () => {
        beforeEach(() => {
            // Mock de la date pour les tests
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2025-01-15T10:00:00.000Z'));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it("devrait calculer le total des factures par jour", async () => {
            (Facture.sum as jest.Mock).mockResolvedValue(1500);
            
            await sommeTotalFactureParJour(req, res);
            
            expect(Facture.sum).toHaveBeenCalledWith("total", expect.objectContaining({
                where: expect.objectContaining({
                    type: "Facture"
                })
            }));
            expect(jsonMock).toHaveBeenCalledWith({
                jour: "15-01-2025",
                total: 1500
            });
        });

        it("devrait calculer le total des factures par mois", async () => {
            (Facture.sum as jest.Mock).mockResolvedValue(25000);
            
            await sommeTotalFactureParMois(req, res);
            
            expect(jsonMock).toHaveBeenCalledWith({
                mois: "01-2025",
                total: 25000
            });
        });

        it("devrait calculer le total des factures par an", async () => {
            (Facture.sum as jest.Mock).mockResolvedValue(120000);
            
            await sommeTotalFactureParAn(req, res);
            
            expect(jsonMock).toHaveBeenCalledWith({
                annee: 2025,
                total: 120000
            });
        });
    });

    describe("Recherche de chiffre d'affaires", () => {
        it("devrait retourner le chiffre d'affaires pour un jour spécifique", async () => {
            req.query = { jour: "2025-01-15" };
            (Facture.sum as jest.Mock).mockResolvedValue(1500);
            
            await searchChiffreAffaire(req, res);
            
            expect(jsonMock).toHaveBeenCalledWith({
                totalJour: 1500,
                totalMois: 0,
                totalAn: 0
            });
        });

        it("devrait retourner une erreur 400 pour un format de jour invalide", async () => {
            req.query = { jour: "invalid-date" };
            
            await searchChiffreAffaire(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Le format du jour est invalide. Utilisez YYYY-MM-DD." 
            });
        });
    });

    describe("Recherche de chiffre d'affaires par période", () => {
        it("devrait retourner le chiffre d'affaires pour une période", async () => {
            req.query = { 
                dateDebut: "2025-01-01", 
                dateFin: "2025-01-31" 
            };
            (Facture.sum as jest.Mock).mockResolvedValue(15000);
            
            await searchPeriodeChiffreAffaire(req, res);
            
            expect(jsonMock).toHaveBeenCalledWith({
                totalFacture: 15000
            });
        });

        it("devrait retourner une erreur 400 si les dates sont manquantes", async () => {
            req.query = { dateDebut: "2025-01-01" }; // dateFin manquante
            
            await searchPeriodeChiffreAffaire(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Les paramètres 'dateDebut' et 'dateFin' sont requis." 
            });
        });

        it("devrait retourner une erreur 400 si la date de début est après la date de fin", async () => {
            req.query = { 
                dateDebut: "2025-01-31", 
                dateFin: "2025-01-01" 
            };
            
            await searchPeriodeChiffreAffaire(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "La date de fin doit être après la date de début." 
            });
        });
    });
});
