const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Configurações do banco de dados PostgreSQL
const dbConfig = {
  user: "postgres", // Usuário do PostgreSQL
  host: "localhost", // Host do banco de dados
  password: "admin", // Senha do usuário
  port: 5432, // Porta padrão do PostgreSQL
  database: "trabalho", // Nome do banco
};

// Função para verificar e criar o banco de dados, se necessário
const ensureDatabaseExists = async () => {
  const pool = new Pool({
    ...dbConfig,
    database: "postgres", // Conecta ao banco padrão do PostgreSQL
  });

  try {
    const client = await pool.connect();
    console.log(
      "Conexão ao PostgreSQL estabelecida com sucesso (verificação do banco)"
    );

    // Verificar se o banco de dados existe
    const dbCheckQuery = `
      SELECT 1 FROM pg_database WHERE datname = '${dbConfig.database}';
    `;
    const result = await client.query(dbCheckQuery);

    if (result.rowCount === 0) {
      console.log(
        `Banco de dados "${dbConfig.database}" não encontrado. Criando banco...`
      );
      await client.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`Banco de dados "${dbConfig.database}" criado com sucesso.`);
    } else {
      console.log(`Banco de dados "${dbConfig.database}" já existe.`);
    }

    client.release();
  } catch (error) {
    console.error(
      "Erro ao verificar ou criar o banco de dados:",
      error.message
    );
    process.exit(1); // Encerrar o processo em caso de erro
  } finally {
    await pool.end();
  }
};

// Função para executar o script SQL de criação de tabelas
const initializeDatabase = async () => {
  const pool = new Pool(dbConfig);

  try {
    const client = await pool.connect();
    console.log("Conexão ao PostgreSQL estabelecida com sucesso");

    // Verificar se uma tabela específica existe (ex.: "especialidades")
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'especialidades'
      );
    `;
    const result = await client.query(tableCheckQuery);

    // Se a tabela não existir, executar o script SQL de criação
    if (!result.rows[0].exists) {
      console.log("Tabelas não encontradas. Criando tabelas...");
      const createTablesPath = path.join(__dirname, "createTables.sql");
      const createTablesSQL = fs.readFileSync(createTablesPath, "utf-8");
      await client.query(createTablesSQL);
      console.log("Tabelas criadas com sucesso.");
    } else {
      console.log("Tabelas já existem. Nenhuma ação necessária.");
    }

    client.release();
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error.message);
    process.exit(1); // Encerrar o processo em caso de erro
  } finally {
    await pool.end();
  }
};

// Inicializar o banco de dados
(async () => {
  await ensureDatabaseExists();
  await initializeDatabase();
})();

module.exports = new Pool(dbConfig);
