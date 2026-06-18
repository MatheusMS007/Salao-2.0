import express from 'express'
import { criarAgendamento, listarAgendamentos, atualizarAgendamento, marcarRealizado, removerAgendamento, exibirCadastroAgendamento, exibirEdicaoAgendamento } from '../controllers/controllersAgendamento.js'
import { verificarLogin, verificarNaoAdm } from '../config/middleware.js'

const routerAgendamento = express.Router()

routerAgendamento.get('/agendamentos', verificarLogin, verificarNaoAdm, listarAgendamentos)
routerAgendamento.get('/cadastroAgendamento', verificarLogin, verificarNaoAdm, exibirCadastroAgendamento)
routerAgendamento.get('/editarAgendamento/:id', verificarLogin, verificarNaoAdm, exibirEdicaoAgendamento)
routerAgendamento.post('/agendamentos', verificarLogin, verificarNaoAdm, criarAgendamento)
routerAgendamento.put('/agendamentos/:id', verificarLogin, verificarNaoAdm, atualizarAgendamento)
routerAgendamento.patch('/agendamentos/:id/realizado', verificarLogin, verificarNaoAdm, marcarRealizado)
routerAgendamento.delete('/agendamentos/:id', verificarLogin, verificarNaoAdm, removerAgendamento)

export default routerAgendamento
