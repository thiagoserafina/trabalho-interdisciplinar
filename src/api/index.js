const cors = require("cors"); // Biblioteca que permite o acesso desta api por dominios
const express = require("express");
const rotas = require("./src/rotas"); // Importa as rotas
const app = express();
const PORT = 3030;

// Função que permite o acesso desta api por dominios
app.use(cors());

// Middleware para tratar JSON no corpo das requisições
app.use(express.json());

// Usa as rotas definidas
app.use("/api", rotas);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
