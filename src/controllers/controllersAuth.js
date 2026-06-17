import bcrypt from 'bcryptjs'
import Usuarios from '../models/modelUsuario.js'

// EXIBIR a página de login
export const exibirLogin = (req, res) => {
    res.sendFile('login.html', { root: './src/public' }) // serve o arquivo HTML estático
}

// FAZER login
export const fazerLogin = async (req, res) => {
    const { email, senha } = req.body // pega email e senha do formulário

    try {
        const usuario = await Usuarios.findOne({ where: { email } })

        if (!usuario) { // se não encontrou o usuário
            return res.redirect('/login?erro=1')
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha) // compara a senha com o hash
        if (!senhaCorreta) { // se a senha estiver errada
            return res.redirect('/login?erro=1')
        }

        // salva os dados do usuário na sessão (o "crachá")
        req.session.usuario = {
            id: usuario.idUsuario,
            nome: usuario.nome,
            perfil: usuario.perfil,
            idSalao: usuario.idSalao || null // salva o salão do dono, se houver
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

// FAZER logout
export const fazerLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
}

// CRIAR o ADM master (usar apenas uma vez acessando /setup)
export const criarAdm = async (req, res) => {
    try {
        const usuarioAdm = await Usuarios.findOne({ where: { perfil: 'adm' } })
        if (usuarioAdm) { // se já existir um adm, bloqueia
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
