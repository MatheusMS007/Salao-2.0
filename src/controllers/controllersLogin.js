import bcrypt from 'bcrypt'
import Usuarios from '../models/modelUsuario.js'

// MOSTRAR a página de login
export const exibirLogin = (req, res) => {
    res.sendFile('login.html', { root: './src/public/html' })
}

// PROCESSAR o login quando o usuário clicar em "Entrar"
export const efetuarLogin = async (req, res) => {
    const { usuario, senha } = req.body

    try {
        const usuarioEncontrado = await Usuarios.findOne({ where: { usuario } }) // o finndOne é usado para encontrar o regstro

        if (!usuarioEncontrado) {
            return res.redirect('/login?erro=usuario')
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha)

        if (!senhaCorreta) {
            return res.redirect('/login?erro=senha')
        }

        req.session.usuarioLogado = usuarioEncontrado.usuario
        res.redirect('/clientes')

    } catch (err) {
        res.redirect('/login?erro=servidor')
    }
}

// PROCESSAR o logout quando o usuário clicar em "Sair"
export const efetuarLogout = (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}
