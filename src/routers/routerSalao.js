import express from 'express'
import { verificarLogin, verificarAdm } from '../config/middleware.js'
import { listarSaloes, criarSalao, exibirCadastroSalao, deletarSalao } from '../controllers/controllersSalao.js'

const routerSalao = express.Router()

// GET: Lista todos os salões (exige ADM)
routerSalao.get('/saloes', verificarLogin, verificarAdm, listarSaloes)

// GET: Exibe formulário de cadastro de salão (exige ADM)
routerSalao.get('/cadastroSalao', verificarLogin, verificarAdm, exibirCadastroSalao)

// POST: Cria novo salão (exige ADM)
routerSalao.post('/saloes', verificarLogin, verificarAdm, criarSalao)

// DELETE: Deleta um salão pelo ID (exige ADM)
// URL: DELETE /saloes/:id
routerSalao.delete('/saloes/:id', verificarLogin, verificarAdm, deletarSalao)

export default routerSalao
