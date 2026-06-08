import express from 'express'
import { criarCliente, listarClientes, atualizarCliente, removerCliente, exibirCadastroCliente, exibirEdicaoCliente } from '../controllers/controllersCliente.js'
import { verificarLogin } from '../config/middleware.js'

const routerCliente = express.Router()

routerCliente.get('/clientes', verificarLogin, listarClientes)                // lista todos os clientes
routerCliente.get('/cadastroCliente', verificarLogin, exibirCadastroCliente)  // abre a página de cadastro em branco
routerCliente.get('/editarCliente/:id', verificarLogin, exibirEdicaoCliente)  // abre a página de edição preenchida
routerCliente.post('/clientes', verificarLogin, criarCliente)                 // cadastra o cliente
routerCliente.put('/clientes/:id', verificarLogin, atualizarCliente)          // atualiza o cliente
routerCliente.delete('/clientes/:id', verificarLogin, removerCliente)         // apaga o cliente

export default routerCliente
