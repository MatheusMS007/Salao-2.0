import Saloes from '../models/modelSalao.js'

// LISTAR todos os salões do sistema
export const listarSaloes = async (req, res) => {
    try {
        const saloes = await Saloes.findAll({ order: [['nome', 'ASC']] })
        res.render('saloes', { saloes })
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// CRIAR um novo salão no cadastro do ADM Master
export const criarSalao = async (req, res) => {
    const { nome } = req.body

    if (!nome) {
        return res.status(400).render('erro', { mensagem: 'O nome do salão é obrigatório!' })
    }

    try {
        await Saloes.create({ nome })
        res.redirect('/saloes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}

// EXIBIR o formulário de cadastro de salão
export const exibirCadastroSalao = (req, res) => {
    res.sendFile('cadastroSalao.html', { root: './src/public' })
}

// DELETAR um salão
// Recebe: idSalao via parâmetro da URL
// Faz: encontra o salão, verifica se existe, deleta do banco
// Retorna: redireciona para /saloes
export const deletarSalao = async (req, res) => {
    const { id } = req.params // extrai o ID da URL (ex: /saloes/1)

    if (!id) {
        return res.status(400).render('erro', { mensagem: 'ID do salão é obrigatório!' })
    }

    try {
        // Busca o salão pelo ID
        const salao = await Saloes.findByPk(id)

        // Se não encontrar, retorna erro
        if (!salao) {
            return res.status(404).render('erro', { mensagem: 'Salão não encontrado!' })
        }

        // Deleta o salão do banco de dados
        // Nota: se houver relacionamentos configurados (donos, clientes, agendamentos),
        // eles serão afetados pelas regras de foreign key (ON DELETE SET NULL, etc)
        await Saloes.destroy({ where: { idSalao: id } })

        // Redireciona para a lista de salões
        res.redirect('/saloes')
    } catch (err) {
        res.render('erro', { mensagem: err.message })
    }
}
