const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// Rota GET: Listar funcionários
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM funcionarios');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        res.status(500).json({ error: 'Erro ao buscar funcionários' });
    }
});

// Rota POST: Adicionar funcionário
router.post('/', async (req, res) => {
    const { nome_funcionario, cpf, id_localizacao, email, telefone, id_especialidade, disponibilidade } = req.body;

    try {
        const query = `
            INSERT INTO funcionarios (
                nome_funcionario, cpf, id_localizacao, email, telefone, 
         id_especialidade, disponibilidade
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
        const values = [nome_funcionario, cpf, id_localizacao, email, telefone, id_especialidade, disponibilidade];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Funcionário criado com sucesso', funcionario: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar funcionário:', error);
        if (error.code === '23505') {
            res.status(400).json({ error: 'CPF ou e-mail já cadastrado' });
        } else {
            res.status(500).json({ error: 'Erro ao criar funcionário' });
        }
    }
});

// Rota PUT: Atualizar funcionário
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_funcionario, cpf, id_localizacao, email, telefone, id_especialidade, disponibilidade } = req.body;

    try {
        console.log('ID recebido para atualização:', id);
        const query = `
            UPDATE funcionarios 
            SET nome_funcionario = $1, cpf = $2, id_localizacao = $3, email = $4, 
                telefone = $5, id_especialidade = $6, disponibilidade = $7
            WHERE id_funcionario = $8 RETURNING *;
        `;
        const values = [nome_funcionario, cpf, id_localizacao, email, telefone, id_especialidade, disponibilidade, id];

        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }
        res.status(200).json({ message: 'Funcionário atualizado com sucesso', funcionario: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
});

// Rota DELETE: Deletar funcionário por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    console.log('ID recebido para exclusão:', id);

    try {
        const result = await pool.query('DELETE FROM funcionarios WHERE id_funcionario = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        res.status(200).json({ message: 'Funcionário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar funcionário:', error);
        res.status(500).json({ error: 'Erro ao deletar funcionário' });
    }
});

module.exports = router;