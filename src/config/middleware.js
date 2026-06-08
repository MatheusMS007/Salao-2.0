// VERIFICAR se o usuário está logado
export const verificarLogin = (req, res, next) => {
    if (!req.session.usuario) {        // se não tiver sessão (não está logado)
        return res.redirect('/login')  // manda para o login
    }
    next() // está logado, pode continuar
}

// VERIFICAR se o usuário é ADM master
export const verificarAdm = (req, res, next) => {
    if (req.session.usuario.perfil !== 'adm') { // se não for adm
        return res.redirect('/clientes')         // manda para a página principal
    }
    next() // é adm, pode continuar
}
