const axios = require('axios');

class PokemonService {
    constructor() {
        this.baseURL = 'https://pokeapi.co/api/v2/pokemon';
    }

    /**
     * Busca informações de um Pokémon específico por nome ou ID
     * @param {string|number} identifier - Nome ou ID do Pokémon
     * @returns {Object} Dados do Pokémon
     */
    async getPokemon(identifier) {
        try {
            const url = `${this.baseURL}/${identifier}`;
            console.log(`📡 Iniciando requisição HTTP GET para: ${url}`);
            
            const response = await axios.get(url);
            
            console.log(`📈 Status da resposta: ${response.status} ${response.statusText}`);
            console.log(`📦 Tamanho da resposta: ${JSON.stringify(response.data).length} caracteres`);
            
            const pokemonData = {
                id: response.data.id,
                name: response.data.name,
                height: response.data.height,
                weight: response.data.weight,
                types: response.data.types.map(type => type.type.name),
                abilities: response.data.abilities.map(ability => ability.ability.name),
                stats: response.data.stats.map(stat => ({
                    name: stat.stat.name,
                    value: stat.base_stat
                })),
                sprites: {
                    front_default: response.data.sprites.front_default,
                    front_shiny: response.data.sprites.front_shiny
                }
            };
            
            console.log(`🎯 Dados processados com sucesso para: ${pokemonData.name}`);
            return pokemonData;
        } catch (error) {
            console.log(`💥 Erro na requisição HTTP:`);
            console.log(`   URL: ${this.baseURL}/${identifier}`);
            console.log(`   Status: ${error.response?.status || 'N/A'}`);
            console.log(`   Mensagem: ${error.message}`);
            throw new Error(`Pokémon não encontrado: ${identifier}`);
        }
    }

    /**
     * Lista Pokémon com paginação
     * @param {number} limit - Número de Pokémon por página
     * @param {number} offset - Offset para paginação
     * @returns {Object} Lista de Pokémon
     */
    async getPokemonList(limit = 20, offset = 0) {
        try {
            const response = await axios.get(`${this.baseURL}`, {
                params: { limit, offset }
            });
            return {
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous,
                results: response.data.results
            };
        } catch (error) {
            throw new Error('Erro ao buscar lista de Pokémon');
        }
    }

    /**
     * Busca Pokémon por tipo
     * @param {string} type - Tipo do Pokémon
     * @returns {Array} Lista de Pokémon do tipo especificado
     */
    async getPokemonByType(type) {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
            return response.data.pokemon.map(pokemon => ({
                name: pokemon.pokemon.name,
                url: pokemon.pokemon.url
            }));
        } catch (error) {
            throw new Error(`Tipo de Pokémon não encontrado: ${type}`);
        }
    }

    /**
     * Formata dados do Pokémon para exibição amigável
     * @param {Object} pokemon - Dados do Pokémon
     * @returns {string} String formatada com informações do Pokémon
     */
    formatPokemonInfo(pokemon) {
        const types = pokemon.types.join(', ');
        const abilities = pokemon.abilities.join(', ');
        const stats = pokemon.stats.map(stat => `${stat.name}: ${stat.value}`).join(', ');
        
        return `
🎮 **${pokemon.name.toUpperCase()}** (ID: ${pokemon.id})
📏 Altura: ${pokemon.height / 10}m
⚖️ Peso: ${pokemon.weight / 10}kg
🏷️ Tipos: ${types}
💪 Habilidades: ${abilities}
📊 Estatísticas: ${stats}
🖼️ Imagem: ${pokemon.sprites.front_default}
        `.trim();
    }
}

module.exports = PokemonService;
