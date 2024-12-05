const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// Rota GET: Listar todos os alunos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM alunos ORDER BY id_aluno ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    res.status(500).json({ error: "Erro ao buscar alunos" });
  }
});

// Rota POST: Adicionar novo aluno
router.post("/", async (req, res) => {
  const {
    nome_aluno,
    cpf,
    data_nascimento,
    id_localizacao,
    contato_responsavel,
    diagnostico,
  } = req.body;
  try {
    const query = `
            INSERT INTO alunos (nome_aluno, cpf, data_nascimento, id_localizacao, contato_responsavel, diagnostico) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
    const values = [
      nome_aluno,
      cpf,
      data_nascimento,
      id_localizacao,
      contato_responsavel,
      diagnostico,
    ];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao adicionar aluno:", error);
    res.status(500).json({ error: "Erro ao adicionar aluno" });
  }
});

// Rota PUT: Atualizar dados de um aluno por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nome_aluno,
    cpf,
    data_nascimento,
    id_localizacao,
    contato_responsavel,
    diagnostico,
  } = req.body;

  try {
    const query = `
            UPDATE alunos 
            SET nome_aluno = $1, cpf = $2, data_nascimento = $3, 
                id_localizacao = $4, contato_responsavel = $5, diagnostico = $6
            WHERE id_aluno = $7
            RETURNING *;
        `;
    const values = [
      nome_aluno,
      cpf,
      data_nascimento,
      id_localizacao,
      contato_responsavel,
      diagnostico,
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }
    res
      .status(200)
      .json({ message: "Aluno atualizado com sucesso", aluno: result.rows[0] });
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    res.status(500).json({ error: "Erro ao atualizar aluno" });
  }
});

// Rota DELETE: Deletar aluno por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM alunos WHERE id_aluno = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }
    res
      .status(200)
      .json({ message: "Aluno deletado com sucesso", aluno: result.rows[0] });
  } catch (error) {
    console.error("Erro ao deletar aluno:", error);
    res.status(500).json({ error: "Erro ao deletar aluno" });
  }
});

module.exports = router;
