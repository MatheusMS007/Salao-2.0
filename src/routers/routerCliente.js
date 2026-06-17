import express from 'express'
import { criarCliente, listarClientes, atualizarCliente, removerCliente, exibirCadastroCliente, exibirEdicaoCliente } from '../controllers/controllersCliente.js'
import { verificarLogin, verificarNaoAdm } from '../config/middleware.js'

const routerCliente = express.Router()

routerCliente.get('/clientes', verificarLogin, listarClientes)                // lista todos os clientes
routerCliente.get('/cadastroCliente', verificarLogin, verificarNaoAdm, exibirCadastroCliente)  // abre a página de cadastro em branco
routerCliente.get('/editarCliente/:id', verificarLogin, verificarNaoAdm, exibirEdicaoCliente)  // abre a página de edição preenchida
routerCliente.post('/clientes', verificarLogin, verificarNaoAdm, criarCliente)                 // cadastra o cliente
routerCliente.put('/clientes/:id', verificarLogin, verificarNaoAdm, atualizarCliente)          // atualiza o cliente
routerCliente.delete('/clientes/:id', verificarLogin, verificarNaoAdm, removerCliente)         // apaga o cliente

export default routerCliente
