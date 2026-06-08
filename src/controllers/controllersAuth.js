import bcrypt from 'bcryptjs'
import bdConexao from '../config/database.js'

// EXIBIR a página de login
export const exibirLogin = (req, res) => {
    res.sendFile('login.html', { root: './src/public' }) // serve o arquivo HTML estático
}

// FAZER login
export const fazerLogin = async (req, res) => {
    const { email, senha } = req.body // pega email e senha do formulário

    try {
        const [rows] = await bdConexao.execute('SELECT * FROM usuarios WHERE email = ?', [email])
        const usuario = rows[0]

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
            idSalao: usuario.idSalao || null
        }

        res.redirect('/clientes') // redireciona para a página principal
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// FAZER logout
export const fazerLogout = (req, res) => {
    req.session.destroy() // destroi a sessão (remove o "crachá")
    res.redirect('/login')
}

// CRIAR o ADM master (usar apenas uma vez acessando /setup)
export const criarAdm = async (req, res) => {
    try {
        const [rows] = await bdConexao.execute("SELECT * FROM usuarios WHERE perfil = 'adm'")
        if (rows.length > 0) { // se já existir um adm, bloqueia
            return res.send('ADM já existe!')
        }

        const hash = await bcrypt.hash('admin123', 10) // criptografa a senha padrão
        await bdConexao.execute(
            "INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)",
            ['ADM Master', 'adm@salao.com', hash, 'adm']
        )
        res.send('ADM criado! Email: adm@salao.com | Senha: admin123 — Troque a senha após o primeiro login!')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
