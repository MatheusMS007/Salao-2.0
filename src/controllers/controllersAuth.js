import bcrypt from 'bcryptjs'
import Usuarios from '../models/modelUsuario.js'

export const exibirLogin = (req, res) => {
    res.sendFile('login.html', { root: './src/public' })
}

export const fazerLogin = async (req, res) => {
    const { email, senha } = req.body

    try {
        const usuario = await Usuarios.findOne({ where: { email } })

        if (!usuario) {
            return res.redirect('/login?erro=1')
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        if (!senhaCorreta) {
            return res.redirect('/login?erro=1')
        }

        req.session.usuario = {
            id: usuario.idUsuario,
            nome: usuario.nome,
            perfil: usuario.perfil,
            idSalao: usuario.idSalao || null
        }

        if (usuario.perfil === 'adm') {
            res.redirect('/saloes')
        } else {
            res.redirect('/clientes')
        }
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

export const fazerLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
}

export const criarAdm = async (req, res) => {
    try {
        const usuarioAdm = await Usuarios.findOne({ where: { perfil: 'adm' } })
        if (usuarioAdm) {
            return res.send('ADM já existe!')
        }

        const hash = await bcrypt.hash(process.env.ADM_SENHA, 10)
        await Usuarios.create({
            nome: 'ADM Master',
            email: process.env.ADM_EMAIL,
            senha: hash,
            perfil: 'adm'
        })

        res.send(`ADM criado! Email: ${process.env.ADM_EMAIL} | Senha: ${process.env.ADM_SENHA} — Troque a senha após o primeiro login!`)
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
