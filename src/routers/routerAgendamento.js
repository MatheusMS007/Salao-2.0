import express from 'express'
import { criarAgendamento, listarAgendamentos, atualizarAgendamento, marcarRealizado, removerAgendamento, exibirCadastroAgendamento, exibirEdicaoAgendamento } from '../controllers/controllersAgendamento.js'
import { verificarLogin } from '../config/middleware.js'

const routerAgendamento = express.Router()

routerAgendamento.get('/agendamentos', verificarLogin, listarAgendamentos)                        // lista todos os agendamentos
routerAgendamento.get('/cadastroAgendamento', verificarLogin, exibirCadastroAgendamento)          // abre a página de cadastro em branco
routerAgendamento.get('/editarAgendamento/:id', verificarLogin, exibirEdicaoAgendamento)          // abre a página de edição preenchida
routerAgendamento.post('/agendamentos', verificarLogin, criarAgendamento)                         // cria o agendamento
routerAgendamento.put('/agendamentos/:id', verificarLogin, atualizarAgendamento)                  // atualiza o agendamento
routerAgendamento.patch('/agendamentos/:id/realizado', verificarLogin, marcarRealizado)           // marca como realizado
routerAgendamento.delete('/agendamentos/:id', verificarLogin, removerAgendamento)                 // apaga o agendamento

export default routerAgendamento
