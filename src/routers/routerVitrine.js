import express from 'express'
import { exibirVitrine, exibirSalao, criarSolicitacao } from '../controllers/controllersVitrine.js'

const routerVitrine = express.Router()

// GET: exibe a vitrine com todos os salões (sem login)
routerVitrine.get('/vitrine', exibirVitrine)

// GET: exibe a página de um salão específico com formulário (sem login)
routerVitrine.get('/vitrine/:id', exibirSalao)

// POST: envia a solicitação de agendamento (sem login)
routerVitrine.post('/vitrine/:id/solicitacao', criarSolicitacao)

export default routerVitrine
