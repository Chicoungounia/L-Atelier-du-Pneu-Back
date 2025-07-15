import { modifierUser, modifierStatusUser, afficherUser } from "../controllers/userController";
import { User } from "../models/userModels";
import { verifyToken } from "../utils/JWTUtils";

// Mock des dépendances
jest.mock("../utils/JWTUtils", () => ({
    verifyToken: jest.fn(),
}));

jest.mock("../models/userModels", () => ({
    User: {
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}));

// Mock console.log pour éviter les sorties dans les tests
const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

describe("User Controller", () => {
    let req: any;
    let res: any;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        req = { cookies: {}, params: {}, body: {} };
        res = { status: statusMock, json: jsonMock };
        jest.clearAllMocks();
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    describe("Modifier un utilisateur", () => {
        it("devrait retourner une erreur 401 si le token est manquant", async () => {
            req.cookies = {};
            
            await modifierUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Accès refusé, token manquant" });
        });

        it("devrait retourner une erreur 403 si l'utilisateur n'est pas un admin", async () => {
            req.cookies = { jwt: "userToken" };
            (verifyToken as jest.Mock).mockReturnValue({ id: 1, role: "Employé" });
            
            await modifierUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Accès interdit, seuls les administrateurs peuvent modifier un utilisateur" 
            });
        });

        it("devrait retourner une erreur 404 si l'utilisateur n'existe pas", async () => {
            req.cookies = { jwt: "adminToken" };
            req.params = { id: "999" };
            req.body = { nom: "Test", prenom: "User" };
            (verifyToken as jest.Mock).mockReturnValue({ id: 1, role: "Admin" });
            (User.findByPk as jest.Mock).mockResolvedValue(null);
            
            await modifierUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Utilisateur non trouvé" });
        });

        it("devrait mettre à jour un utilisateur avec succès", async () => {
            const mockUser = {
                id: 1,
                nom: "Test",
                prenom: "User",
                update: jest.fn().mockResolvedValue(true)
            };
            
            req.cookies = { jwt: "adminToken" };
            req.params = { id: "1" };
            req.body = { nom: "NewName", prenom: "NewPrenom" };
            (verifyToken as jest.Mock).mockReturnValue({ id: 1, role: "Admin" });
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            
            await modifierUser(req, res);
            
            expect(mockUser.update).toHaveBeenCalledWith({
                nom: "NewName",
                prenom: "NewPrenom"
            });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Utilisateur mis à jour avec succès",
                user: mockUser
            });
        });

        it("devrait gérer les erreurs du serveur", async () => {
            req.cookies = { jwt: "adminToken" };
            req.params = { id: "1" };
            req.body = { nom: "Test" };
            (verifyToken as jest.Mock).mockReturnValue({ id: 1, role: "Admin" });
            (User.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
            
            await modifierUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Erreur interne du serveur",
                error: expect.any(Error)
            });
        });
    });

    describe("Modifier le statut d'un utilisateur", () => {
        it("devrait retourner une erreur 401 si le token est manquant", async () => {
            req.cookies = {};
            
            await modifierStatusUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Accès refusé, token manquant" });
        });

        it("devrait retourner une erreur 403 si l'utilisateur n'est pas un admin", async () => {
            req.cookies = { jwt: "userToken" };
            (verifyToken as jest.Mock).mockReturnValue({ id: 1, role: "Employé" });
            
            await modifierStatusUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith({ 
                message: "Accès interdit, seuls les administrateurs peuvent modifier le statut d'un utilisateur" 
            });
        });

        it("devrait modifier le statut d'un utilisateur avec succès", async () => {
            const mockUser = {
                id: 1,
                status: "Actif",
                update: jest.fn().mockResolvedValue(true)
            };
            
            req.cookies = { jwt: "adminToken" };
            req.params = { id: "1" };
            (verifyToken as jest.Mock).mockReturnValue({ id: 1, role: "Admin" });
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            
            await modifierStatusUser(req, res);
            
            expect(mockUser.update).toHaveBeenCalledWith({ status: "Inactif" });
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Statut modifié avec succès : Inactif",
                user: mockUser
            });
        });
    });

    describe("Afficher un utilisateur", () => {
        it("devrait retourner une erreur 401 si le token est manquant", async () => {
            req.cookies = {};
            
            await afficherUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Accès refusé, token manquant" });
        });

        it("devrait retourner une erreur 403 si le token est invalide", async () => {
            req.cookies = { jwt: "invalidToken" };
            (verifyToken as jest.Mock).mockReturnValue(null);
            
            await afficherUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Accès interdit, token invalide" });
        });

        it("devrait retourner une erreur 404 si l'utilisateur n'existe pas", async () => {
            req.cookies = { jwt: "validToken" };
            req.params = { id: "999" };
            (verifyToken as jest.Mock).mockReturnValue({ id: 1, role: "Admin" });
            (User.findByPk as jest.Mock).mockResolvedValue(null);
            
            await afficherUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Utilisateur non trouvé" });
        });

        it("devrait retourner l'utilisateur avec succès", async () => {
            const mockUser = {
                id: 1,
                nom: "Test",
                prenom: "User",
                email: "test@example.com"
            };
            
            req.cookies = { jwt: "validToken" };
            req.params = { id: "1" };
            (verifyToken as jest.Mock).mockReturnValue({ id: 1, role: "Admin" });
            (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
            
            await afficherUser(req, res);
            
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Utilisateur récupéré avec succès",
                user: mockUser
            });
        });
    });
});
