import { login } from "../controllers/authController";  
import { User } from "../models/userModels"; 
import { generateToken } from "../utils/JWTUtils"; 
import { hashPassword, verifyPassword } from "../utils/pwdUtils"; 
import { NextFunction, Request, Response } from "express";

// Mocks des dépendances
jest.mock("../utils/pwdUtils", () => ({
    verifyPassword: jest.fn(),
    hashPassword: jest.fn()
}));

jest.mock("../utils/JWTUtils", () => ({
    generateToken: jest.fn()
}));

jest.mock("../models/userModels", () => ({
    User: {
        findOne: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn()
    }
}));

// Mock console.log pour éviter les sorties dans les tests
const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

describe("AuthController - login", () => {
    let req: Request;
    let res: Response;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
    let cookieMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        cookieMock = jest.fn();
        req = { body: {} } as Request;
        res = { status: statusMock, json: jsonMock, cookie: cookieMock } as unknown as Response;
        jest.clearAllMocks();
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it("devrait retourner une erreur 400 si les champs sont manquants", async () => {
        req.body = { email: "jeromef7@hotmail.fr" }; 
        
        await login(req, res);
        
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Veuillez remplir tous les champs." });
    });

    it("devrait retourner une erreur 404 si l'utilisateur n'existe pas", async () => {
        req.body = { email: "jeromef7@hotmail.fr", password: "password" };
        (User.findOne as jest.Mock).mockResolvedValue(null);
        
        await login(req, res);
        
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Utilisateur non trouvé." });
    });

    it("devrait retourner une erreur 403 si le compte est inactif", async () => {
        req.body = { email: "jeromef7@hotmail.fr", password: "password" };
        (User.findOne as jest.Mock).mockResolvedValue({ 
            id: 1, 
            email: "jeromef7@hotmail.fr", 
            hashedpassword: "hashedPwd",
            status: "Inactif"
        });
        
        await login(req, res);
        
        expect(statusMock).toHaveBeenCalledWith(403);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Compte inactif. Veuillez contacter l'administrateur." });
    });

    it("devrait retourner une erreur 401 si le mot de passe est incorrect", async () => {
        req.body = { email: "jeromef7@hotmail.fr", password: "wrongpassword" };
        (User.findOne as jest.Mock).mockResolvedValue({ 
            id: 1, 
            email: "jeromef7@hotmail.fr", 
            hashedpassword: "hashedPwd",
            status: "Actif"
        });
        (verifyPassword as jest.Mock).mockResolvedValue(false);
        
        await login(req, res);
        
        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Mot de passe incorrect." });
    });

    it("devrait générer un token et enregistrer un cookie", async () => {
        req.body = { email: "jeromef7@hotmail.fr", password: "password" };
        const mockUser = { 
            id: 1, 
            email: "jeromef7@hotmail.fr", 
            hashedpassword: "hashedPwd",
            role: "Admin",
            speudo: "testuser",
            status: "Actif"
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (verifyPassword as jest.Mock).mockResolvedValue(true);
        (generateToken as jest.Mock).mockReturnValue("mocked-jwt-token");
        
        await login(req, res);
        
        expect(cookieMock).toHaveBeenCalledWith("jwt", "mocked-jwt-token", expect.any(Object));
        expect(cookieMock).toHaveBeenCalledWith("speudo", "testuser", expect.any(Object));
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ 
            message: "Connexion réussie", 
            token: "mocked-jwt-token",
            speudo: "testuser"
        });
    });

    it("devrait gérer les erreurs du serveur", async () => {
        req.body = { email: "jeromef7@hotmail.fr", password: "password" };
        (User.findOne as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
        
        await login(req, res);
        
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ 
            message: "Erreur interne du serveur", 
            error: "Erreur base de données" 
        });
    });
});
