import express from 'express'
import { criarAgendamento, listarAgendamentos, atualizarAgendamento, marcarRealizado, removerAgendamento, exibirCadastroAgendamento, exibirEdicaoAgendamento } from '../controllers/controllersAgendamento.js'
import { verificarLogin, verificarNaoAdm } from '../config/middleware.js'

const routerAgendamento = express.Router()

// IMPORTANTE: todas as rotas de agendamento usam verificarNaoAdm
// Isso bloqueia o acesso do ADM Master e permite apenas donos de salão
// verificarLogin: verifica se o usuário está logado
// verificarNaoAdm: verifica se o perfil NÃO é 'adm' (bloqueia ADM, permite dono)

routerAgendamento.get('/agendamentos', verificarLogin, verificarNaoAdm, listarAgendamentos)                        // lista agendamentos (bloqueado para ADM)
routerAgendamento.get('/cadastroAgendamento', verificarLogin, verificarNaoAdm, exibirCadastroAgendamento)          // form cadastro (bloqueado para ADM)
routerAgendamento.get('/editarAgendamento/:id', verificarLogin, verificarNaoAdm, exibirEdicaoAgendamento)          // form edição (bloqueado para ADM)
routerAgendamento.post('/agendamentos', verificarLogin, verificarNaoAdm, criarAgendamento)                         // criar (bloqueado para ADM)
routerAgendamento.put('/agendamentos/:id', verificarLogin, verificarNaoAdm, atualizarAgendamento)                  // atualizar (bloqueado para ADM)
routerAgendamento.patch('/agendamentos/:id/realizado', verificarLogin, verificarNaoAdm, marcarRealizado)           // marcar realizado (bloqueado para ADM)
routerAgendamento.delete('/agendamentos/:id', verificarLogin, verificarNaoAdm, removerAgendamento)                 // deletar (bloqueado para ADM)

export default routerAgendamento
