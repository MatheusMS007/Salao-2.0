import express from 'express'
import { verificarLogin, verificarAdm } from '../config/middleware.js'
import { listarSaloes, criarSalao, exibirCadastroSalao } from '../controllers/controllersSalao.js'

const routerSalao = express.Router()

routerSalao.get('/saloes', verificarLogin, verificarAdm, listarSaloes)
routerSalao.get('/cadastroSalao', verificarLogin, verificarAdm, exibirCadastroSalao)
routerSalao.post('/saloes', verificarLogin, verificarAdm, criarSalao)

export default routerSalao
