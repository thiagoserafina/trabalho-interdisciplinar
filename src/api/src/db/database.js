const { Pool } = require("pg");

// Configurações do banco de dados PostgreSQL
const pool = new Pool({
  user: "postgres", // Usuário do PostgreSQL
  host: "localhost", // Host do banco de dados
  database: "interdisciplinar", // Nome do banco
  password: "admin", // Senha do usuário
  port: 5432, // Porta padrão do PostgreSQL
});

// Testar a conexão
pool
  .connect()
  .then((client) => {
    console.log("Conexão ao PostgreSQL estabelecida com sucesso");
    client.release();
  })
  .catch((err) => {
    console.error("Erro ao conectar ao PostgreSQL:", err.message);
    process.exit(1);
  });

module.exports = pool;
