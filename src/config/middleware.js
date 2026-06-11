// VERIFICAR se o usuário está logado
// Executa antes de qualquer rota protegida para garantir que há uma sessão ativa
// Se não estiver logado, redireciona para login
export const verificarLogin = (req, res, next) => {
    if (!req.session.usuario) {        // se não tiver sessão (não está logado)
        return res.redirect('/login')  // redireciona para a tela de login
    }
    next() // sessão válida, passa ao próximo middleware ou controller
}

// VERIFICAR se o usuário é ADM master
// Executa após verificarLogin para checar o perfil do usuário
// Apenas ADM (perfil = 'adm') consegue prosseguir
export const verificarAdm = (req, res, next) => {
    if (req.session.usuario.perfil !== 'adm') { // se o perfil não for 'adm'
        return res.redirect('/clientes')         // redireciona para a página de clientes
    }
    next() // é ADM, passa ao próximo middleware ou controller
}

// VERIFICAR se o usuário NÃO É ADM master
// Bloqueia o acesso de usuários com perfil 'adm', permitindo apenas donos de salão
// Usado para rotas que não devem estar disponíveis para o ADM Master (como agendamentos)
export const verificarNaoAdm = (req, res, next) => {
    if (req.session.usuario.perfil === 'adm') { // se o perfil for 'adm'
        return res.redirect('/saloes')           // redireciona para gerenciamento de salões
    }
    next() // não é ADM (provavelmente é dono), passa ao próximo middleware ou controller
}
