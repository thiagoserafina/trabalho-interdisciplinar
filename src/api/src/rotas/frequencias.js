const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Rota GET: Listar todos as frequencias
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM frequencias');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        res.status(500).json({ error: 'Erro ao buscar alunos' });
    }
});

// Rota POST para registrar frequência do aluno
router.post('/', async (req, res) => {
    const { id_agendamento, id_aluno, data_sessao, compareceu, observacao} = req.body;

    try {
        const query = `
            CALL registrar_frequencia($1, $2, $3, $4, $5);
        `;
        const values = [id_agendamento, id_aluno, data_sessao, compareceu, observacao];
        const result = await pool.query(query, values);
        res.status(200).json({ message: 'Frequência registrada com sucesso.', frequencia: result.rows[0] });
    } catch (error) {
        console.error('Erro ao registrar frequência:', error);
        res.status(500).json({ error: 'Erro ao registrar frequência.' });
    }
});

module.exports = router;