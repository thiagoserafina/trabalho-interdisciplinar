const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db/database"); // Conexão com o banco de dados

const router = express.Router();

// Chave secreta para assinar o JWT
const JWT_SECRET = "senhasegura"; // Substitua por algo mais seguro e configure em variáveis de ambiente!

//Rota POST para criar o usuario
router.post("/criarusuario", async (req, res) => {
  const { nome, usuario, senha } = req.body;

  try {
    // Gere o hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const query =
      "INSERT INTO login (nome, usuario, senha) VALUES ($1, $2, $3)";

    console.log("Usuário criado com sucesso.");
    const values = [nome, usuario, hashedPassword];
    const result = await pool.query(query, values);
    res
      .status(201)
      .json({ message: "Usuário criado com sucesso.", login: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// Rota POST para login
router.post("/", async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    // Verifique se o usuário existe no banco de dados
    const query =
      "SELECT id_login, usuario, senha FROM login WHERE usuario = $1";
    const result = await pool.query(query, [usuario]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    const user = result.rows[0];

    // Verifique se o campo senha está presente
    if (!user.senha) {
      console.error("Senha ausente no banco de dados para este usuário.");
      return res.status(500).json({ error: "Erro interno do servidor." });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    // Gere um token JWT
    const token = jwt.sign(
      { id_login: user.id_login, usuario: user.usuario }, // Dados que deseja incluir no token
      JWT_SECRET, // Chave secreta
      { expiresIn: "2h" } // Expiração do token (2 hora)
    );

    // Retorne o token ao cliente
    res.status(200).json({ message: "Login bem-sucedido.", token });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.put("/alterarsenha", async (req, res) => {
  const { usuario, senha, novaSenha } = req.body;

  try {
    // Verifique se o usuário existe no banco de dados
    const query =
      "SELECT id_login, usuario, senha FROM login WHERE usuario = $1";
    const result = await pool.query(query, [usuario]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    const user = result.rows[0];

    // Verifique se o campo senha está presente
    if (!user.senha) {
      console.error("Senha ausente no banco de dados para este usuário.");
      return res.status(500).json({ error: "Erro interno do servidor." });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    // Gere o hash da nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    // Atualize a senha no banco de dados
    const updateQuery = "UPDATE login SET senha = $1 WHERE id_login = $2";
    await pool.query(updateQuery, [hashedPassword, user.id_login]);

    res.status(200).json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;
