import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "API L'Atelier du Pneu",
      version: "1.0.0",
      description: "Documentation de l’API Express.js avec Swagger",
    },
    servers: [
      {
        url: process.env.API_URL, // URL de l'API définie dans .env
      },
    ],
    components: {
      schemas: {
        RendezVous: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1, description: "ID unique du rendez-vous" },
            clientId: { type: "integer", example: 1, description: "ID du client associé" },
            userId: { type: "integer", example: 2, description: "ID de l'ouvrier affecté" },
            pont: { type: "integer", example: 3, description: "Numéro du pont utilisé" },
            dateDebut: { type: "string", format: "date-time", example: "2025-03-16T09:00:00Z", description: "Date et heure de début" },
            dateFin: { type: "string", format: "date-time", example: "2025-03-16T10:00:00Z", description: "Date et heure de fin" },
            status: { type: "string", enum: ["Confirmé", "Annulé", "En attente"], example: "Confirmé", description: "Statut du rendez-vous" },
          },
        },
      },
    },
  },
  apis: ["./dist/routes/*.{js,ts}", "./src/routes/*.{ts,js}"], // Chemins des fichiers avec annotations Swagger
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
