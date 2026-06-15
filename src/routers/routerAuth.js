import express from 'express'
import { exibirLogin, fazerLogin, fazerLogout, criarAdm } from '../controllers/controllersAuth.js'

const routerAuth = express.Router()

routerAuth.get('/login', exibirLogin)       // abre a página de login
routerAuth.post('/login', fazerLogin)       // processa o login
routerAuth.post('/logout', fazerLogout)     // faz o logout
routerAuth.get('/setup', (req, res, next) => {
    if (req.query.chave !== process.env.SETUP_KEY) {
        return res.status(403).send('Acesso negado!')
    }
    next()
}, criarAdm)

export default routerAuth
