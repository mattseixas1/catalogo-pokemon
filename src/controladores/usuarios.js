const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt')

const cadastrarUsuario = async (req, res) => {
    let { nome, email, senha } = req.body

    try {
        if (!nome || !email || !senha) {
            return res.status(400)({"mensagem":"Os dados são obrigatórios!"})
        }
        const senhaHash = await bcrypt.hash(senha, 10)

        const novoUsuario = await pool.query('insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *',
        [nome, email, senhaHash]);

         return res.status(201).json(novoUsuario.rows[0])
    } catch (error) {
        return res.status(400).json({"mensagem": error.message})
    }
}

const login = async (req, res) => {
    let { email, senha } = req.body
    
    try {
        if (!email || !senha) {
            return res.status(400)({"mensagem":"Os dados são obrigatórios!"})
        }
        const usuario = await pool.query('select * from usuarios where email = $1', [email])
        if (usuario.rowCount < 1) {
            return res.status(404).json({"mensagem":"Email ou senha invalido"})
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)

        if (!senhaValida) {
            return res.status(400).json({"mensagem":"Email ou senha invalido"})
        }

        const token = jwt.sign({id: usuario.rows[0].id}, senhaJwt, {expiresIn: '8h'})
        const {senha: _, ...usuarioAutenticado } = usuario.rows[0]

        return res.status(200).json({usuario: usuarioAutenticado, token})

    } catch (error) {
        return res.status(400).json({"mensagem": error.message})
    }
}


module.exports = {
    cadastrarUsuario,
    login
}