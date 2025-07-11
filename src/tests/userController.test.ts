import { modifierUser, modifierStatusUser, afficherUser } from "../controllers/userController";
import { User } from "../models/userModels";
import sequelize from "../config/database";

// Mock de la fonction verifyToken
jest.mock("../utils/JWTUtils", () => ({
    verifyToken: jest.fn(),
}));

const { verifyToken } = require("../utils/JWTUtils");

describe("User Controller", () => {
    let tokenAdmin: string;
    let tokenUser: string;
    let userId: number;

    beforeAll(async () => {
        // Préparer un utilisateur Admin et un autre standard pour les tests
        const admin = await User.create({
            nom: "Admin",
            prenom: "Test",
            speudo: "",
            email: "admin@test.com",
            hashedpassword: "hashedPassword",
            role: "Admin",
            status: "Actif",
        });

        const user = await User.create({
            nom: "User",
            prenom: "Test",
            speudo: "",
            email: "user@test.com",
            hashedpassword: "hashedPassword",
            role: "Employé",
            status: "Actif",
        });

        tokenAdmin = "adminToken"; // Simule le token pour un admin
        tokenUser = "userToken"; // Simule le token pour un utilisateur

        userId = user.id;

        // Mock de la fonction verifyToken
        verifyToken.mockImplementation((token: string) => {
            if (token === "adminToken") {
                return { id: admin.id, role: "Admin" };
            }
            if (token === "userToken") {
                return { id: user.id, role: "Employé" };
            }
            return null;
        });
    });

    afterAll(async () => {
        // Nettoyage de la base de données après les tests
        await sequelize.sync({ force: true });
    });

    describe("Modifier un utilisateur", () => {
        it("devrait retourner une erreur 401 si le token est manquant", async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Passer un cookie vide pour simuler un token manquant
            await modifierUser(
                { cookies: {} } as any,  // Simule l'absence de cookie
                res as any
            );

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Accès refusé, token manquant" });
        });

        it("devrait retourner une erreur 403 si l'utilisateur n'est pas un admin", async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Passer un token d'utilisateur non admin
            await modifierUser(
                { cookies: { jwt: tokenUser } } as any,  // Simule un token d'utilisateur
                res as any
            );

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "Accès interdit, seuls les administrateurs peuvent modifier un utilisateur" });
        });

        it("devrait mettre à jour un utilisateur avec succès", async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Passer un token admin et des données de mise à jour pour l'utilisateur
            await modifierUser(
                { cookies: { jwt: tokenAdmin }, params: { id: userId }, body: { nom: "NewName", prenom: "NewPrenom" } } as any,
                res as any
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Utilisateur mis à jour avec succès",
                user: expect.objectContaining({ nom: "NewName", prenom: "NewPrenom" })
            });
        });

        it("devrait retourner une erreur 404 si l'utilisateur n'existe pas", async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Passer un id utilisateur inexistant pour simuler une erreur 404
            await modifierUser(
                { cookies: { jwt: tokenAdmin }, params: { id: 9999 }, body: { nom: "NonExistent", prenom: "User" } } as any,
                res as any
            );

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur non trouvé" });
        });
    });

    describe("Modifier le statut d'un utilisateur", () => {
        it("devrait retourner une erreur 401 si le token est manquant", async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await modifierStatusUser(
                { cookies: {} } as any,  // Simule un cookie vide
                res as any
            );

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Accès refusé, token manquant" });
        });

        it("devrait retourner une erreur 403 si l'utilisateur n'est pas un admin", async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await modifierStatusUser(
                { cookies: { jwt: tokenUser }, params: { id: userId } } as any,  // Simule un token d'utilisateur
                res as any
            );

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "Accès interdit, seuls les administrateurs peuvent modifier le statut d'un utilisateur" });
        });

        it("devrait modifier le statut d'un utilisateur avec succès", async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await modifierStatusUser(
                { cookies: { jwt: tokenAdmin }, params: { id: userId } } as any,  // Simule un token d'admin
                res as any
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Statut modifié avec succès : Inactif", user: expect.objectContaining({ status: "Inactif" }) });
        });
    });

    describe("Afficher un utilisateur", () => {
        it("devrait retourner une erreur 401 si le token est manquant", async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await afficherUser(
                { cookies: {} } as any,  // Simule un cookie vide
                res as any
            );

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Accès refusé, token manquant" });
        });
    });
});
