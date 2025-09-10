const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const PokemonService = require('./services/pokemonService');
const OpenAIService = require('./services/openaiService');
const TelegramService = require('./services/telegramService');
const SpellCorrectionService = require('./services/spellCorrectionService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Instanciar serviços
const pokemonService = new PokemonService();
const openaiService = new OpenAIService();
const telegramService = new TelegramService();
const spellCorrectionService = new SpellCorrectionService();

// Rota principal - servir a interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota da API para chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Mensagem é obrigatória' });
        }

        // Corrigir erros de digitação na mensagem
        const correctedMessage = await spellCorrectionService.correctMessage(message);
        
        // Se houve correção, informar no console
        if (correctedMessage !== message) {
            console.log(`🔧 Mensagem corrigida: "${message}" → "${correctedMessage}"`);
        }

        // Detectar se a mensagem é sobre um Pokémon ou tipo
        const detection = openaiService.detectPokemonInMessage(correctedMessage);
        let pokemonData = null;
        let typeData = null;

        if (detection) {
            if (detection.type === 'pokemon_name') {
                // Se detectou um Pokémon, buscar dados na API
                try {
                    console.log(`🔍 Detectado Pokémon: ${detection.value}`);
                    console.log(`🌐 Fazendo requisição para: https://pokeapi.co/api/v2/pokemon/${detection.value}`);
                    
                    pokemonData = await pokemonService.getPokemon(detection.value);
                    
                    console.log(`✅ Requisição bem-sucedida!`);
                    console.log(`📊 Dados do Pokémon obtidos: ${pokemonData.name} (ID: ${pokemonData.id})`);
                    console.log(`🏷️ Tipos: ${pokemonData.types.join(', ')}`);
                    console.log(`💪 Habilidades: ${pokemonData.abilities.join(', ')}`);
                    console.log(`📏 Altura: ${pokemonData.height/10}m | Peso: ${pokemonData.weight/10}kg`);
                } catch (pokemonError) {
                    console.log(`❌ Erro na requisição à API do Pokémon:`);
                    console.log(`   Pokémon: ${detection.value}`);
                    console.log(`   Erro: ${pokemonError.message}`);
                    console.log(`   Status: ${pokemonError.response?.status || 'N/A'}`);
                    console.log(`⚠️ Continuando sem dados do Pokémon...`);
                }
            } else if (detection.type === 'pokemon_type') {
                // Se detectou um tipo, buscar Pokémon do tipo
                try {
                    console.log(`🔍 Detectado tipo: ${detection.value}`);
                    
                    // Converter tipo para inglês se necessário
                    const englishType = openaiService.convertTypeToEnglish(detection.value);
                    console.log(`🌐 Fazendo requisição para: https://pokeapi.co/api/v2/type/${englishType}`);
                    
                    const pokemonList = await pokemonService.getPokemonByType(englishType);
                    
                    console.log(`✅ Requisição bem-sucedida!`);
                    console.log(`📊 Pokémon do tipo ${detection.value} (${englishType}) encontrados: ${pokemonList.length}`);
                    
                    typeData = {
                        type: detection.value,
                        englishType: englishType,
                        pokemon: pokemonList
                    };
                } catch (typeError) {
                    console.log(`❌ Erro na requisição à API de tipos:`);
                    console.log(`   Tipo: ${detection.value}`);
                    console.log(`   Erro: ${typeError.message}`);
                    console.log(`   Status: ${typeError.response?.status || 'N/A'}`);
                    console.log(`⚠️ Continuando sem dados do tipo...`);
                }
            }
        } else {
            console.log(`ℹ️ Nenhum Pokémon ou tipo detectado na mensagem: "${message}"`);
        }

        // Gerar resposta usando OpenAI com dados do Pokémon ou tipo (se disponíveis)
        const response = await openaiService.generateResponse(correctedMessage, pokemonData, typeData);
        
        res.json({ response });
    } catch (error) {
        console.error('Erro no chat:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: 'Desculpe, ocorreu um erro. Tente novamente.'
        });
    }
});

// Rota para buscar Pokémon específico
app.get('/api/pokemon/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        const pokemon = await pokemonService.getPokemon(identifier);
        res.json(pokemon);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Rota para listar Pokémon
app.get('/api/pokemon', async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const pokemonList = await pokemonService.getPokemonList(
            parseInt(limit), 
            parseInt(offset)
        );
        res.json(pokemonList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para buscar Pokémon por tipo
app.get('/api/pokemon/type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const pokemonByType = await pokemonService.getPokemonByType(type);
        res.json(pokemonByType);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Função removida: extractPokemonInfo - agora 100% controlado pela OpenAI

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo deu errado!',
        message: 'Erro interno do servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📱 Interface do chatbot disponível em http://localhost:${PORT}`);
    
    // Iniciar bot do Telegram
    telegramService.start();
    
    if (!openaiService.isConfigured()) {
        console.log('⚠️  ATENÇÃO: Configure sua chave da OpenAI no arquivo .env para funcionalidade completa');
        console.log('   Copie o arquivo env.example para .env e adicione sua chave');
    }
});

module.exports = app;
