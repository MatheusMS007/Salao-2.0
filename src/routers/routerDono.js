import express from 'express'
import { verificarLogin, verificarAdm } from '../config/middleware.js'
import { exibirCadastroDono, criarDono, listarDonos, apiSaloes, deletarDono } from '../controllers/controllersDono.js'

const routerDono = express.Router()

// GET: Exibe formulário estático de cadastro de dono (exige ADM)
routerDono.get('/cadastroDono', verificarLogin, verificarAdm, exibirCadastroDono)

// POST: Cria novo dono (exige ADM)
routerDono.post('/donos', verificarLogin, verificarAdm, criarDono)

// GET: Lista todos os donos em uma view EJS (exige ADM)
routerDono.get('/donos', verificarLogin, verificarAdm, listarDonos)

// DELETE: Deleta um dono pelo ID (exige ADM)
// URL: DELETE /donos/:id
routerDono.delete('/donos/:id', verificarLogin, verificarAdm, deletarDono)

// GET: Rota API usada pelo formulário estático para buscar salões em JSON
routerDono.get('/api/saloes', verificarLogin, verificarAdm, apiSaloes)

export default routerDono
