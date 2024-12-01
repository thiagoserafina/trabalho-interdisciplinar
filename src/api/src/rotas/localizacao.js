const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Rota POST: Adicionar uma nova localização
router.post('/', async (req, res) => {
    const { pais, estado, cidade, cep, logradouro, complemento, numero } = req.body;

    try {
        const query = `
            INSERT INTO localizacoes (pais, estado, cidade, cep, logradouro, complemento, numero)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [pais, estado, cidade, cep, logradouro, complemento, numero];
        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Localização adicionada com sucesso', localizacao: result.rows[0] });
    } catch (error) {
        console.error('Erro ao adicionar localização:', error);
        res.status(500).json({ error: 'Erro ao adicionar localização' });
    }
});

// Rota GET: Listar todas as localizações
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM localizacoes');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao listar localizações:', error);
        res.status(500).json({ error: 'Erro ao listar localizações' });
    }
});

// Rota PUT: Atualizar uma localização por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { pais, estado, cidade, cep, logradouro, complemento, numero } = req.body;

    try {
        const query = `
            UPDATE localizacoes
            SET pais = $1, estado = $2, cidade = $3, cep = $4, logradouro = $5, complemento = $6, numero = $7
            WHERE id_localizacao = $8
            RETURNING *;
        `;
        const values = [pais, estado, cidade, cep, logradouro, complemento, numero, id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Localização não encontrada' });
        }
        res.status(200).json({ message: 'Localização atualizada com sucesso', localizacao: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar localização:', error);
        res.status(500).json({ error: 'Erro ao atualizar localização' });
    }
});

// Rota DELETE: Excluir uma localização por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM localizacoes WHERE id_localizacao = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Localização não encontrada' });
        }
        res.status(200).json({ message: 'Localização excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir localização:', error);
        res.status(500).json({ error: 'Erro ao excluir localização' });
    }
});

module.exports = router;