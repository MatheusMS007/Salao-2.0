import express from 'express'
import { criarAgendamento, listarAgendamentos, atualizarAgendamento, marcarRealizado, removerAgendamento, exibirCadastroAgendamento, exibirEdicaoAgendamento } from '../controllers/controllersAgendamento.js'

const routerAgendamento = express.Router()

routerAgendamento.get('/agendamentos', listarAgendamentos)                        // lista todos os agendamentos
routerAgendamento.get('/cadastroAgendamento', exibirCadastroAgendamento)          // abre a página de cadastro em branco
routerAgendamento.get('/editarAgendamento/:id', exibirEdicaoAgendamento)          // abre a página de edição preenchida
routerAgendamento.post('/agendamentos', criarAgendamento)                         // cria o agendamento
routerAgendamento.put('/agendamentos/:id', atualizarAgendamento)                  // atualiza o agendamento
routerAgendamento.patch('/agendamentos/:id/realizado', marcarRealizado)           // marca como realizado
routerAgendamento.delete('/agendamentos/:id', removerAgendamento)                 // apaga o agendamento

export default routerAgendamento
