const express = require("express");
const router = express.Router();
const agendamentos = require("./agendamentos");
const alunos = require("./alunos");
const funcionarios = require("./funcionarios");
const localizacao = require("./localizacao");
const especialidades = require("./especialidades");
const frequencias = require("./frequencias");
const login = require("./login");

router.use(express.json());
router.use("/agendamentos", agendamentos);
router.use("/alunos", alunos);
router.use("/funcionarios", funcionarios);
router.use("/localizacao", localizacao);
router.use("/especialidades", especialidades);
router.use("/frequencias", frequencias);
router.use("/login", login);

module.exports = router;