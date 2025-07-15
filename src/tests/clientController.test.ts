import dotenv from "dotenv";
dotenv.config();

import * as clientController from "../controllers/clientController";
import sequelize from "../config/database";
import Client from "../models/clientModel";
import { Request, Response, NextFunction } from "express";

// Mock des dépendances après l'importation
jest.mock("../utils/JWTUtils", () => ({
  verifyToken: jest.fn().mockReturnValue({ id: 1, role: "Admin" }),
}));

jest.mock("../middlewares/verifyTokenMiddleware", () => ({
  verifyTokenMiddleware: jest.fn((req: Request, res: Response, next: NextFunction) => {
    next();
  })
}));

// Mock console.log pour éviter les sorties dans les tests
const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe("ClientController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    next = jest.fn();
    req = {
      body: {},
      params: {},
      query: {},
      cookies: { jwt: "validToken" }
    };
    res = { status: statusMock, json: jsonMock };
    
    // Mock des méthodes Sequelize
    jest.spyOn(Client, 'create').mockImplementation();
    jest.spyOn(Client, 'findByPk').mockImplementation();
    jest.spyOn(Client, 'findAll').mockImplementation();
    jest.spyOn(sequelize, 'query').mockImplementation();
    
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("ajouterClient", () => {
    it("devrait retourner une erreur 400 si le nom ou le type est manquant", async () => {
      req.body = { nom: "Test" }; // type manquant
      
      await clientController.ajouterClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Nom et type sont requis." });
    });

    it("devrait ajouter un client avec succès et retourner 201", async () => {
      req.body = { nom: "Test", type: "Privé" };
      const mockClientData = {
        id: 1,
        nom: "Test",
        type: "Privé",
        status: "Actif"
      };
      (Client.create as jest.Mock).mockResolvedValue(mockClientData);
      
      await clientController.ajouterClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Client ajouté avec succès",
        client: mockClientData
      });
    });

    it("devrait retourner une erreur 500 si une erreur de serveur survient", async () => {
      req.body = { nom: "Test", type: "Privé" };
      (Client.create as jest.Mock).mockRejectedValue(new Error("Erreur interne"));
      
      await clientController.ajouterClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
    });
  });

  describe("modifierClient", () => {
    it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
      req.params = { id: "invalid" };
      
      await clientController.modifierClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
    });

    it("devrait retourner une erreur 404 si le client n'existe pas", async () => {
      req.params = { id: "1" };
      req.body = { nom: "Test" };
      (Client.findByPk as jest.Mock).mockResolvedValue(null);
      
      await clientController.modifierClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Client non trouvé" });
    });

    it("devrait retourner une erreur 400 si aucun champ n'est fourni", async () => {
      req.params = { id: "1" };
      req.body = {}; // aucun champ fourni
      
      await clientController.modifierClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ 
        message: "Au moins un champ doit être renseigné pour la modification." 
      });
    });

    it("devrait modifier un client avec succès et retourner 200", async () => {
      req.params = { id: "1" };
      req.body = { nom: "Test Modifié" };
      const clientMockInstance = {
        id: 1,
        nom: "Old Name",
        update: jest.fn().mockResolvedValue(true)
      };
      (Client.findByPk as jest.Mock).mockResolvedValue(clientMockInstance);
      
      await clientController.modifierClient[1](req as Request, res as Response, next);
      
      expect(clientMockInstance.update).toHaveBeenCalledWith(
        { nom: "Test Modifié" },
        { fields: ['nom', 'prenom', 'adresse', 'email', 'telephone', 'type'] }
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Client modifié avec succès",
        client: clientMockInstance
      });
    });

    it("devrait gérer les erreurs du serveur", async () => {
      req.params = { id: "1" };
      req.body = { nom: "Test" };
      (Client.findByPk as jest.Mock).mockRejectedValue(new Error("Erreur base de données"));
      
      await clientController.modifierClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
    });
  });

  describe("modifierStatusClient", () => {
    it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
      req.params = { id: "invalid" };
      req.body = { status: "Actif" };
      
      await clientController.modifierStatusClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
    });

    it("devrait retourner une erreur 404 si le client n'existe pas", async () => {
      req.params = { id: "1" };
      req.body = { status: "Actif" };
      (Client.findByPk as jest.Mock).mockResolvedValue(null);
      
      await clientController.modifierStatusClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Client non trouvé" });
    });

    it("devrait retourner une erreur 400 si le statut est invalide", async () => {
      req.params = { id: "1" };
      req.body = { status: "InvalidStatus" };
      
      await clientController.modifierStatusClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Statut invalide. Valeurs autorisées: 'Actif' ou 'Inactif'."
      });
    });

    it("devrait modifier le statut du client avec succès et retourner 200", async () => {
      req.params = { id: "1" };
      req.body = { status: "Inactif" };
      const clientMockInstance = {
        id: 1,
        status: "Actif",
        update: jest.fn().mockResolvedValue(true)
      };
      (Client.findByPk as jest.Mock).mockResolvedValue(clientMockInstance);
      
      await clientController.modifierStatusClient[1](req as Request, res as Response, next);
      
      expect(clientMockInstance.update).toHaveBeenCalledWith({ status: "Inactif" });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Statut du client modifié avec succès",
        client: clientMockInstance
      });
    });
  });

  describe("afficherClientsActifs", () => {
    it("devrait retourner une liste des clients actifs et un statut 200", async () => {
      const clientsMock = [{ id: 1, nom: "Test", status: "Actif" }];
      (Client.findAll as jest.Mock).mockResolvedValue(clientsMock);
      
      await clientController.afficherClientsActifs[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Liste des clients actifs récupérée avec succès",
        clients: clientsMock
      });
    });

    it("devrait retourner une erreur 500 si une erreur de serveur survient", async () => {
      (Client.findAll as jest.Mock).mockRejectedValue(new Error("Erreur serveur"));
      
      await clientController.afficherClientsActifs[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
    });
  });

  describe("afficherAllClients", () => {
    it("devrait retourner tous les clients et un statut 200", async () => {
      const clientsMock = [{ id: 1, nom: "Test" }];
      (Client.findAll as jest.Mock).mockResolvedValue(clientsMock);
      
      await clientController.afficherAllClients[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Liste des clients récupérée avec succès",
        clients: clientsMock
      });
    });

    it("devrait gérer les erreurs du serveur", async () => {
      (Client.findAll as jest.Mock).mockRejectedValue(new Error("Erreur serveur"));
      
      await clientController.afficherAllClients[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
    });
  });

  describe("afficherUnClient", () => {
    it("devrait retourner une erreur 400 si l'ID est invalide", async () => {
      req.params = { id: "invalid" };
      
      await clientController.afficherUnClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "ID invalide" });
    });

    it("devrait retourner une erreur 404 si le client n'existe pas", async () => {
      req.params = { id: "1" };
      (Client.findByPk as jest.Mock).mockResolvedValue(null);
      
      await clientController.afficherUnClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Client non trouvé" });
    });

    it("devrait afficher un client avec succès et un statut 200", async () => {
      req.params = { id: "1" };
      const clientMockInstance = { id: 1, nom: "Test" };
      (Client.findByPk as jest.Mock).mockResolvedValue(clientMockInstance);
      
      await clientController.afficherUnClient[1](req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Client récupéré avec succès",
        client: clientMockInstance
      });
    });
  });

  describe("searchClient", () => {
    it("devrait retourner des résultats de recherche", async () => {
      req.query = { nom: "Test" };
      const clientsMock = [{ id: 1, nom: "Test", prenom: "User" }];
      (sequelize.query as jest.Mock).mockResolvedValue(clientsMock);
      
      await clientController.searchClient(req as Request, res as Response, next);
      
      expect(jsonMock).toHaveBeenCalledWith(clientsMock);
    });

    it("devrait gérer les erreurs de recherche", async () => {
      req.query = { nom: "Test" };
      (sequelize.query as jest.Mock).mockRejectedValue(new Error("Erreur de recherche"));
      
      await clientController.searchClient(req as Request, res as Response, next);
      
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
    });
  });
});
