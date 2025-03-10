"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // Version de l'OpenAPI Specification
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation de l’API Express.js avec Swagger',
        },
        servers: [
            {
                url: process.env.API_URL, // URL de votre API
            },
        ],
    },
    apis: ['./dist/routes/*.{js,ts}', './src/routes/*.{ts,js}']
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.default = swaggerDocs;
