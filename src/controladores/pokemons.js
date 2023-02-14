const pool = require('../conexao');

const cadastrarPokemon = async (req, res) => {
    let { nome, habilidades, imagem, apelido } = req.body
    let { id } = req.usuario

    try {

        if (!nome || !habilidades) {
            return res.status(400)({"mensagem":"Os dados Nome e Habilidades são obrigatórios!"})
        }
        const novoPokemon = await pool.query('insert into pokemons (usuario_id, nome, habilidades, imagem, apelido) values ($1, $2, $3, $4, $5) returning *',
        [id, nome, habilidades, imagem, apelido]);

         return res.status(201).json(novoPokemon.rows[0])
    } catch (error) {
        return res.status(400).json({"mensagem": error.message})
    }
}

const atualizarPokemon = async (req, res) => {
    let { apelido } = req.body
    let { id } = req.params
    
    try {
        if (!apelido) {
            return res.status(400)({"mensagem":"O Apelido é obrigatório!"})
        }
        const pokemonEncontrado = await pool.query('select * from pokemons where id = $1', [id])
        if (pokemonEncontrado.rowCount < 1) {
            return res.status(404).json({"mensagem":"Pokemon não encontrado"})
        }
        const novoApelido = await pool.query('update pokemons set apelido = $1 where id = $2 returning *', [apelido, id])
        return res.status(201).json(novoApelido.rows[0])
    } catch (error) {
        return res.status(400).json({"mensagem": error.message})
    }
}

const encontrarPokemon = async (req, res) => {
    let { id } = req.params
    try {
        const { rows, rowCount } = await pool.query('select u.nome as unome, p.nome as pnome, * from pokemons p join usuarios u on u.id = p.usuario_id where p.id = $1', [id])
        if (rowCount < 1) {
            return res.status(400).json({"mensagem":"Pokemon não encontrado!"})
        }
        const resposta = rows.map((pokemon) => {
            return {
                "id": pokemon.id,
                "usuario": pokemon.unome,
                "nome": pokemon.pnome,
                "apelido": pokemon.apelido,
                "habilidades": pokemon.habilidades.split(", "),
                "imagem": pokemon.imagem
            }
    
           })

       return res.json(resposta)

    } catch (error) {
        return res.status(400).json({"mensagem": error.message})
    }
}

const deletarPokemon = async (req, res) => {
    let { id } = req.params
    try {
        const pokemonEncontrado = await pool.query('select * from pokemons where id = $1', [id])
        if (pokemonEncontrado.rowCount < 1) {
            return res.status(404).json({"mensagem":"Pokemon não encontrado"})
        }
        const pokemonDeletado = await pool.query('delete from pokemons where id = $1 returning *', [id])
        return res.json(pokemonDeletado.rows[0])
    } catch (error) {
        return res.status(400).json({"mensagem": error.message})
    }
}

const listarPokemon = async (req, res) => {
    try {
        const { rows, rowCount } = await pool.query('select u.nome as unome, p.nome as pnome, * from pokemons p join usuarios u on u.id = p.usuario_id')
        if (rowCount < 1) {
            return res.status(400).json({"mensagem":"Não existem pokemons cadastrados!"})
        }
        const resposta = rows.map((pokemon) => {
            return {
                "id": pokemon.id,
                "usuario": pokemon.unome,
                "nome": pokemon.pnome,
                "apelido": pokemon.apelido,
                "habilidades": pokemon.habilidades.split(", "),
                "imagem": pokemon.imagem
            }
    
           })
        return res.json(resposta)
    } catch (error) {
        return res.status(400).json({"mensagem": error.message})
    }
}

module.exports = {
    cadastrarPokemon,
    atualizarPokemon,
    encontrarPokemon,
    deletarPokemon,
    listarPokemon
}