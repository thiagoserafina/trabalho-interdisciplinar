const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// Rota POST: Adicionar uma nova especialidade
router.post("/", async (req, res) => {
  const { nome_especialidade } = req.body;

  try {
    const query = `
            INSERT INTO especialidades (nome_especialidade)
            VALUES ($1)
            RETURNING *;
        `;
    const result = await pool.query(query, [nome_especialidade]);

    res
      .status(201)
      .json({
        message: "Especialidade adicionada com sucesso",
        especialidade: result.rows[0],
      });
  } catch (error) {
    console.error("Erro ao adicionar especialidade:", error);
    res.status(500).json({ error: "Erro ao adicionar especialidade" });
  }
});

// Rota GET: Listar todas as especialidades
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM especialidades ORDER BY id_especialidade ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao listar especialidades:", error);
    res.status(500).json({ error: "Erro ao listar especialidades" });
  }
});

// Rota PUT: Atualizar uma especialidade por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome_especialidade } = req.body;

  try {
    const query = `
            UPDATE especialidades
            SET nome_especialidade = $1
            WHERE id_especialidade = $2
            RETURNING *;
        `;
    const result = await pool.query(query, [nome_especialidade, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Especialidade não encontrada" });
    }
    res
      .status(200)
      .json({
        message: "Especialidade atualizada com sucesso",
        especialidade: result.rows[0],
      });
  } catch (error) {
    console.error("Erro ao atualizar especialidade:", error);
    res.status(500).json({ error: "Erro ao atualizar especialidade" });
  }
});

// Rota DELETE: Excluir uma especialidade por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM especialidades WHERE id_especialidade = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Especialidade não encontrada" });
    }
    res.status(200).json({ message: "Especialidade excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir especialidade:", error);
    res.status(500).json({ error: "Erro ao excluir especialidade" });
  }
});

module.exports = router;
