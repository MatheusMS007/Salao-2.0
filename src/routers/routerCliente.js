import express from 'express'
import { criarCliente, listarClientes, atualizarCliente, removerCliente, exibirCadastroCliente, exibirEdicaoCliente } from '../controllers/controllersCliente.js'

const routerCliente = express.Router()

routerCliente.get('/clientes', listarClientes)                // lista todos os clientes
routerCliente.get('/cadastroCliente', exibirCadastroCliente)  // abre a página de cadastro em branco
routerCliente.get('/editarCliente/:id', exibirEdicaoCliente)  // abre a página de edição preenchida
routerCliente.post('/clientes', criarCliente)                 // cadastra o cliente
routerCliente.put('/clientes/:id', atualizarCliente)          // atualiza o cliente
routerCliente.delete('/clientes/:id', removerCliente)         // apaga o cliente

export default routerCliente
