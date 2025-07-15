import { 
    ajouterPrestation, 
    modifierPrestation, 
    modifierStatusPrestation, 
    afficherPrestation, 
    afficherStatusAllTruePrestation, 
    afficherAllPrestations 
} from "../controllers/prestationController";
import Prestation from "../models/prestationModels";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { isAdmin } from "../middlewares/verifyAdminMiddleware";

// Mock des dépendances
jest.mock("../models/prestationModels");

jest.mock("../middlewares/verifyTokenMiddleware", () => ({
    verifyTokenMiddleware: jest.fn((req: any, res: any, next: any) => next())
}));

jest.mock("../middlewares/verifyAdminMiddleware", () => ({
    isAdmin: jest.fn((req: any, res: any, next: any) => next())
}));

// Mock console.error pour éviter les sorties dans les tests
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe("Prestation Controller", () => {
    let req: any;
    let res: any;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
    const mockPrestation = Prestation as jest.Mocked<typeof Prestation>;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        req = { params: {}, body: {} };
        res = { status: statusMock, json: jsonMock };
        jest.clearAllMocks();
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    describe("Ajouter une prestation", () => {
        it("devrait retourner une erreur 400 si le travail est manquant", async () => {
            req.body = { description: "Description test", prix_htva: 50.00 };
            
            await ajouterPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Tous les champs sont obligatoires." });
        });

        it("devrait retourner une erreur 400 si la description est manquante", async () => {
            req.body = { travail: "Test", prix_htva: 50.00 };
            
            await ajouterPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Tous les champs sont obligatoires." });
        });

        it("devrait retourner une erreur 400 si prix_htva est undefined", async () => {
            req.body = { travail: "Test", description: "Description test" };
            
            await ajouterPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Tous les champs sont obligatoires." });
        });

        it("devrait créer une prestation avec succès même avec prix_htva = 0", async () => {
            const mockPrestationData = {
                id: 1,
                travail: "Test gratuit",
                description: "Service gratuit",
                prix_htva: 0,
                status: true
            };
            
            req.body = {
                travail: "Test gratuit",
                description: "Service gratuit",
                prix_htva: 0
            };
            
            mockPrestation.create.mockResolvedValue(mockPrestationData as any);
            
            await ajouterPrestation(req, res);
            
            expect(mockPrestation.create).toHaveBeenCalledWith({
                travail: "Test gratuit",
                description: "Service gratuit",
                prix_htva: 0
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(mockPrestationData);
        });

        it("devrait créer une prestation avec succès", async () => {
            const mockPrestationData = {
                id: 1,
                travail: "Changement de pneu",
                description: "Remplacement pneu avant",
                prix_htva: 75.50,
                status: true
            };
            
            req.body = {
                travail: "Changement de pneu",
                description: "Remplacement pneu avant",
                prix_htva: 75.50
            };
            
            mockPrestation.create.mockResolvedValue(mockPrestationData as any);
            
            await ajouterPrestation(req, res);
            
            expect(mockPrestation.create).toHaveBeenCalledWith({
                travail: "Changement de pneu",
                description: "Remplacement pneu avant",
                prix_htva: 75.50
            });
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(mockPrestationData);
        });

        it("devrait gérer les erreurs du serveur lors de l'ajout", async () => {
            req.body = {
                travail: "Test",
                description: "Description",
                prix_htva: 50.00
            };
            
            const error = new Error("Erreur base de données");
            mockPrestation.create.mockRejectedValue(error);
            
            await ajouterPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Erreur lors de l'ajout de la prestation", 
                error: error 
            });
        });
    });

    describe("Modifier une prestation", () => {
        it("devrait retourner une erreur 404 si la prestation n'existe pas", async () => {
            req.params = { id: "999" };
            req.body = { travail: "Test modifié" };
            
            mockPrestation.findByPk.mockResolvedValue(null);
            
            await modifierPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Prestation non trouvée." });
        });

        it("devrait modifier une prestation avec succès", async () => {
            const mockPrestationInstance = {
                id: 1,
                travail: "Ancien travail",
                description: "Ancienne description",
                prix_htva: 50.00,
                status: true,
                update: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            req.body = { 
                travail: "Nouveau travail", 
                description: "Nouvelle description",
                prix_htva: 75.00 
            };
            
            mockPrestation.findByPk.mockResolvedValue(mockPrestationInstance as any);
            
            await modifierPrestation(req, res);
            
            expect(mockPrestationInstance.update).toHaveBeenCalledWith({
                travail: "Nouveau travail",
                description: "Nouvelle description",
                prix_htva: 75.00
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockPrestationInstance);
        });

        it("devrait modifier seulement les champs fournis", async () => {
            const mockPrestationInstance = {
                id: 1,
                travail: "Ancien travail",
                description: "Ancienne description",
                prix_htva: 50.00,
                status: true,
                update: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            req.body = { travail: "Nouveau travail" };
            
            mockPrestation.findByPk.mockResolvedValue(mockPrestationInstance as any);
            
            await modifierPrestation(req, res);
            
            expect(mockPrestationInstance.update).toHaveBeenCalledWith({
                travail: "Nouveau travail"
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockPrestationInstance);
        });

        it("devrait modifier le statut", async () => {
            const mockPrestationInstance = {
                id: 1,
                travail: "Travail",
                description: "Description",
                prix_htva: 50.00,
                status: true,
                update: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            req.body = { status: false };
            
            mockPrestation.findByPk.mockResolvedValue(mockPrestationInstance as any);
            
            await modifierPrestation(req, res);
            
            expect(mockPrestationInstance.update).toHaveBeenCalledWith({
                status: false
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockPrestationInstance);
        });

        it("devrait gérer les erreurs du serveur lors de la modification", async () => {
            req.params = { id: "1" };
            req.body = { travail: "Test" };
            
            const error = new Error("Erreur base de données");
            mockPrestation.findByPk.mockRejectedValue(error);
            
            await modifierPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Erreur lors de la modification de la prestation", 
                error: error 
            });
        });
    });

    describe("Modifier le statut d'une prestation", () => {
        it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
            req.params = { id: "invalid" };
            
            await modifierStatusPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
        });

        it("devrait retourner une erreur 404 si la prestation n'existe pas", async () => {
            req.params = { id: "999" };
            
            mockPrestation.findByPk.mockResolvedValue(null);
            
            await modifierStatusPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Prestation non trouvée" });
        });

        it("devrait inverser le statut d'une prestation (true vers false)", async () => {
            const mockPrestationInstance = {
                id: 1,
                status: true,
                save: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            
            mockPrestation.findByPk.mockResolvedValue(mockPrestationInstance as any);
            
            await modifierStatusPrestation(req, res);
            
            expect(mockPrestationInstance.status).toBe(false);
            expect(mockPrestationInstance.save).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Statut de la prestation mis à jour avec succès",
                prestation: mockPrestationInstance
            });
        });

        it("devrait inverser le statut d'une prestation (false vers true)", async () => {
            const mockPrestationInstance = {
                id: 1,
                status: false,
                save: jest.fn().mockResolvedValue(true)
            };
            
            req.params = { id: "1" };
            
            mockPrestation.findByPk.mockResolvedValue(mockPrestationInstance as any);
            
            await modifierStatusPrestation(req, res);
            
            expect(mockPrestationInstance.status).toBe(true);
            expect(mockPrestationInstance.save).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Statut de la prestation mis à jour avec succès",
                prestation: mockPrestationInstance
            });
        });

        it("devrait gérer les erreurs du serveur lors de la modification du statut", async () => {
            req.params = { id: "1" };
            
            const error = new Error("Erreur base de données");
            mockPrestation.findByPk.mockRejectedValue(error);
            
            await modifierStatusPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Afficher une prestation", () => {
        it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
            req.params = { id: "invalid" };
            
            await afficherPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
        });

        it("devrait retourner une erreur 404 si la prestation n'existe pas", async () => {
            req.params = { id: "999" };
            
            mockPrestation.findByPk.mockResolvedValue(null);
            
            await afficherPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Prestation non trouvée" });
        });

        it("devrait retourner la prestation avec succès", async () => {
            const mockPrestationInstance = {
                id: 1,
                travail: "Changement de pneu",
                description: "Remplacement pneu avant",
                prix_htva: 75.50,
                status: true
            };
            
            req.params = { id: "1" };
            
            mockPrestation.findByPk.mockResolvedValue(mockPrestationInstance as any);
            
            await afficherPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Prestation récupérée avec succès",
                prestation: mockPrestationInstance
            });
        });

        it("devrait gérer les erreurs du serveur lors de l'affichage", async () => {
            req.params = { id: "1" };
            
            const error = new Error("Erreur base de données");
            mockPrestation.findByPk.mockRejectedValue(error);
            
            await afficherPrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
        });
    });

    describe("Afficher les prestations actives", () => {
        it("devrait retourner la liste des prestations actives", async () => {
            const mockPrestations = [
                { id: 1, travail: "Changement de pneu", status: true },
                { id: 2, travail: "Équilibrage", status: true }
            ];
            
            mockPrestation.findAll.mockResolvedValue(mockPrestations as any);
            
            await afficherStatusAllTruePrestation(req, res);
            
            expect(mockPrestation.findAll).toHaveBeenCalledWith({
                where: { status: true }
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockPrestations);
        });

        it("devrait gérer les erreurs du serveur lors de l'affichage des prestations actives", async () => {
            const error = new Error("Erreur base de données");
            mockPrestation.findAll.mockRejectedValue(error);
            
            await afficherStatusAllTruePrestation(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Erreur lors de la récupération des prestations actives", 
                error: error 
            });
        });
    });

    describe("Afficher toutes les prestations", () => {
        it("devrait retourner toutes les prestations", async () => {
            const mockPrestations = [
                { id: 1, travail: "Changement de pneu", status: true },
                { id: 2, travail: "Équilibrage", status: false }
            ];
            
            mockPrestation.findAll.mockResolvedValue(mockPrestations as any);
            
            await afficherAllPrestations(req, res);
            
            expect(mockPrestation.findAll).toHaveBeenCalledWith();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(mockPrestations);
        });

        it("devrait gérer les erreurs du serveur lors de l'affichage de toutes les prestations", async () => {
            const error = new Error("Erreur base de données");
            mockPrestation.findAll.mockRejectedValue(error);
            
            await afficherAllPrestations(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Erreur lors de la récupération des prestations", 
                error: error 
            });
        });
    });
});
