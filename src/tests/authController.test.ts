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
        req = { body: {} } as Request;  // Initialisation de `req` avec le type Request
        res = { status: statusMock, json: jsonMock, cookie: cookieMock } as unknown as Response; // Conversion en Response
        jest.clearAllMocks(); // Réinitialisation des mocks avant chaque test
    });

    it("devrait retourner une erreur 404 si l'utilisateur n'existe pas", async () => {
        req.body = { email: "test@example.com", password: "password" };
        (User.findOne as jest.Mock).mockResolvedValue(null);  // Simule la réponse de `findOne`
        await login(req, res);  // Appel de la fonction login avec 2 arguments (sans next)
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Utilisateur non trouvé." });
    });

    it("devrait retourner une erreur 401 si le mot de passe est incorrect", async () => {
        req.body = { email: "test@example.com", password: "wrongpassword" };
        (User.findOne as jest.Mock).mockResolvedValue({ id: 1, email: "test@example.com", hashedpassword: "hashedPwd" });
        (verifyPassword as jest.Mock).mockReturnValue(false);  // Simule la vérification du mot de passe incorrect
        await login(req, res);  // Appel de la fonction login avec 2 arguments (sans next)
        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Mot de passe incorrect." });
    });

    it("devrait générer un token et enregistrer un cookie", async () => {
        req.body = { email: "test@example.com", password: "password" };
        (User.findOne as jest.Mock).mockResolvedValue({ id: 1, email: "test@example.com", hashedpassword: "hashedPwd" });
        (verifyPassword as jest.Mock).mockReturnValue(true);  // Simule la vérification du mot de passe correct
        (generateToken as jest.Mock).mockReturnValue("mocked-jwt-token");  // Simule la génération du token
        await login(req, res);  // Appel de la fonction login avec 2 arguments (sans next)
        expect(cookieMock).toHaveBeenCalledWith("jwt", "mocked-jwt-token", expect.any(Object));  // Vérifie que le cookie a été créé
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Connexion réussie", token: "mocked-jwt-token" });
    });
});
