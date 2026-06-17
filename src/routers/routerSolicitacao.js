import express from 'express'
import { listarSolicitacoes, confirmarSolicitacao, recusarSolicitacao } from '../controllers/controllersSolicitacao.js'
import { verificarLogin, verificarNaoAdm } from '../config/middleware.js'

const routerSolicitacao = express.Router()

// GET: lista todas as solicitações do salão do dono (bloqueado para ADM)
routerSolicitacao.get('/solicitacoes', verificarLogin, verificarNaoAdm, listarSolicitacoes)

// PATCH: confirma uma solicitação (bloqueado para ADM)
routerSolicitacao.patch('/solicitacoes/:id/confirmar', verificarLogin, verificarNaoAdm, confirmarSolicitacao)

// PATCH: recusa uma solicitação (bloqueado para ADM)
routerSolicitacao.patch('/solicitacoes/:id/recusar', verificarLogin, verificarNaoAdm, recusarSolicitacao)

export default routerSolicitacao
