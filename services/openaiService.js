const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        
        this.apiKey = process.env.OPENAI_API_KEY 
        
        if (this.apiKey === process.env.OPENAI_API_KEY) {
            console.warn('⚠️  ATENÇÃO: Configure sua chave da OpenAI no arquivo .env');
        }

        this.openai = new OpenAI({
            apiKey: this.apiKey,
        });
    }

    /**
     * Detecta se a mensagem do usuário é sobre um Pokémon
     * @param {string} userMessage - Mensagem do usuário
     * @returns {string|null} Nome do Pokémon detectado ou null
     */
    detectPokemonInMessage(userMessage) {
        const message = userMessage.toLowerCase();
        
        console.log(`🔍 Analisando mensagem: "${message}"`);
        
        // Verificar se é pergunta sobre tipos de Pokémon
        const typeKeywords = ['tipo', 'tipos', 'quais são', 'lista de', 'pokemon do tipo', 'pokémon do tipo'];
        const hasTypeKeywords = typeKeywords.some(keyword => message.includes(keyword));
        
        if (hasTypeKeywords) {
            const typePatterns = [
                /quais são os pokemon do tipo (.+)/i,
                /pokemon do tipo (.+)/i,
                /pokémon do tipo (.+)/i,
                /tipo (.+)/i,
                /quais pokemon são (.+)/i,
                /quais pokémon são (.+)/i,
                /lista de pokemon (.+)/i,
                /lista de pokémon (.+)/i
            ];

            for (const pattern of typePatterns) {
                const match = message.match(pattern);
                if (match && match[1]) {
                    const type = match[1].trim().toLowerCase();
                    console.log(`🎯 Padrão de tipo encontrado: "${pattern}" - Tipo extraído: "${type}"`);
                    
                    // Verificar se é um tipo válido
                    if (this.isValidPokemonType(type)) {
                        console.log(`✅ Tipo validado: ${type}`);
                        return { type: 'pokemon_type', value: type };
                    } else {
                        console.log(`❌ Tipo não validado: ${type}`);
                    }
                }
            }
        }
        
        // Procurar por padrões como "me fale sobre", "quem é", "informações sobre"
        const patterns = [
            /me fale sobre (.+)/i,
            /quem é (.+)/i,
            /informações sobre (.+)/i,
            /dados do (.+)/i,
            /estatísticas do (.+)/i,
            /tipo do (.+)/i,
            /habilidades do (.+)/i,
            /conte sobre (.+)/i,
            /fale sobre (.+)/i,
            /me conte sobre (.+)/i,
            /pokemon (.+)/i,
            /pokémon (.+)/i,
            /poke (.+)/i
        ];

        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match && match[1]) {
                const pokemonName = match[1].trim().toLowerCase();
                console.log(`🎯 Padrão encontrado: "${pattern}" - Nome extraído: "${pokemonName}"`);
                
                // Se o nome extraído parece ser um nome de Pokémon, retorna
                if (this.looksLikePokemonName(pokemonName)) {
                    console.log(`✅ Nome validado como Pokémon: ${pokemonName}`);
                    return { type: 'pokemon_name', value: pokemonName };
                } else {
                    console.log(`❌ Nome não validado: ${pokemonName}`);
                }
            }
        }

        // Se não encontrou padrões específicos, tenta extrair qualquer palavra que pareça nome de Pokémon
        // Busca em todas as palavras, mas com critérios mais restritivos para evitar detecções múltiplas
        const words = message.split(/\s+/).filter(word => 
            word.length >= 4 && 
            !['sobre', 'quem', 'é', 'me', 'fale', 'conte', 'dados', 'informações', 'estatísticas', 'tipo', 'habilidades', 'pokemon', 'pokémon', 'poke', 'quais', 'são', 'do', 'da', 'dos', 'das', 'e', 'ou', 'com', 'para', 'de', 'em', 'na', 'no', 'nas', 'nos', 'qual', 'como', 'quando', 'onde', 'porque', 'por', 'que', 'mais', 'menos', 'muito', 'pouco', 'bom', 'ruim', 'melhor', 'pior', 'forte', 'fraco', 'grande', 'pequeno', 'alto', 'baixo', 'pesado', 'leve', 'rápido', 'lento', 'novo', 'velho', 'jovem', 'antigo', 'primeiro', 'último', 'próximo', 'anterior', 'depois', 'antes', 'agora', 'hoje', 'ontem', 'amanhã', 'sempre', 'nunca', 'talvez', 'pode', 'deve', 'precisa', 'quer', 'gosta', 'ama', 'odeia', 'tem', 'faz', 'vai', 'vem', 'fica', 'parece', 'olha', 'vê', 'ouve', 'sente', 'pensa', 'sabe', 'entende', 'aprende', 'ensina', 'ajuda', 'trabalha', 'joga', 'brinca', 'corre', 'anda', 'voa', 'nada', 'pula', 'dorme', 'acorda', 'come', 'bebe', 'fala', 'canta', 'dança', 'ri', 'chora', 'sorri', 'grita', 'sussurra', 'pergunta', 'responde', 'explica', 'conta', 'mostra', 'esconde', 'encontra', 'perde', 'ganha', 'vence', 'empata', 'posição', 'posicoes', 'posicoes', 'localização', 'localizacao', 'lugar', 'lugares', 'situação', 'situacao', 'condição', 'condicao', 'estado', 'estados', 'momento', 'momentos', 'tempo', 'tempos', 'vez', 'vezes', 'ocasião', 'ocasiao', 'oportunidade', 'oportunidades', 'chance', 'chances', 'possibilidade', 'possibilidades', 'opção', 'opcao', 'opções', 'opcoes', 'escolha', 'escolhas', 'decisão', 'decisao', 'decisões', 'decisoes', 'resultado', 'resultados', 'consequência', 'consequencia', 'consequências', 'consequencias', 'efeito', 'efeitos', 'causa', 'causas', 'motivo', 'motivos', 'razão', 'razao', 'razões', 'razoes', 'explicação', 'explicacao', 'explicações', 'explicacoes', 'descrição', 'descricao', 'descrições', 'descricoes', 'definição', 'definicao', 'definições', 'definicoes', 'significado', 'significados', 'sentido', 'sentidos', 'conceito', 'conceitos', 'ideia', 'ideias', 'pensamento', 'pensamentos', 'opinião', 'opiniao', 'opiniões', 'opinioes', 'visão', 'visao', 'visões', 'visoes', 'perspectiva', 'perspectivas', 'ponto', 'pontos', 'aspecto', 'aspectos', 'característica', 'caracteristica', 'características', 'caracteristicas', 'propriedade', 'propriedades', 'atributo', 'atributos', 'qualidade', 'qualidades', 'caracter', 'caracteres', 'personalidade', 'personalidades', 'comportamento', 'comportamentos', 'ação', 'acao', 'ações', 'acoes', 'atividade', 'atividades', 'função', 'funcao', 'funções', 'funcoes', 'papel', 'papeis', 'responsabilidade', 'responsabilidades', 'tarefa', 'tarefas', 'objetivo', 'objetivos', 'meta', 'metas', 'finalidade', 'finalidades', 'propósito', 'proposito', 'propósitos', 'propositos', 'intenção', 'intencao', 'intenções', 'intencoes', 'desejo', 'desejos', 'vontade', 'vontades', 'necessidade', 'necessidades', 'requisito', 'requisitos', 'exigência', 'exigencia', 'exigências', 'exigencias', 'condição', 'condicao', 'condições', 'condicoes', 'regra', 'regras', 'lei', 'leis', 'princípio', 'principio', 'princípios', 'principios', 'base', 'bases', 'fundamento', 'fundamentos', 'origem', 'origens', 'início', 'inicio', 'inícios', 'inicios', 'começo', 'comeco', 'começos', 'comecos', 'fim', 'fins', 'final', 'finais', 'término', 'termino', 'términos', 'terminos', 'conclusão', 'conclusao', 'conclusões', 'conclusoes', 'resumo', 'resumos', 'síntese', 'sintese', 'sínteses', 'sinteses', 'análise', 'analise', 'análises', 'analises', 'estudo', 'estudos', 'pesquisa', 'pesquisas', 'investigação', 'investigacao', 'investigações', 'investigacoes', 'exame', 'exames', 'teste', 'testes', 'prova', 'provas', 'verificação', 'verificacao', 'verificações', 'verificacoes', 'confirmação', 'confirmacao', 'confirmações', 'confirmacoes', 'validação', 'validacao', 'validações', 'validacoes', 'aprovação', 'aprovacao', 'aprovações', 'aprovacoes', 'aceitação', 'aceitacao', 'aceitações', 'aceitacoes', 'rejeição', 'rejeicao', 'rejeições', 'rejeicoes', 'negação', 'negacao', 'negações', 'negacoes', 'recusa', 'recusas', 'recusa', 'recusas', 'recusa', 'recusas'].includes(word)
        );
        
        console.log(`🔍 Palavras extraídas: ${JSON.stringify(words)}`);
        
        // Procura por Pokémon em todas as palavras, mas com validação mais rigorosa
        for (const word of words) {
            if (this.looksLikePokemonName(word)) {
                console.log(`✅ Palavra validada como Pokémon: ${word}`);
                return { type: 'pokemon_name', value: word };
            }
        }
        
        if (words.length > 0) {
            console.log(`⚠️ Nenhuma palavra válida de Pokémon encontrada em ${words.length} palavras analisadas`);
        }

        console.log(`❌ Nenhum Pokémon ou tipo detectado na mensagem`);
        return null;
    }

    /**
     * Verifica se uma string é um tipo válido de Pokémon
     * @param {string} type - Tipo a ser verificado
     * @returns {boolean} True se é um tipo válido
     */
    isValidPokemonType(type) {
        // Tipos válidos baseados na PokéAPI (https://pokeapi.co/api/v2/type/)
        const validTypes = [
            // Inglês (nomes oficiais da API)
            'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 
            'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 
            'ice', 'dragon', 'dark', 'fairy',
            // Português
            'fogo', 'água', 'água', 'elétrico', 'elétrico', 'grama', 'gelo', 
            'lutador', 'veneno', 'terrestre', 'voador', 'psíquico', 'inseto',
            'pedra', 'fantasma', 'dragão', 'sombrio', 'metal', 'fada'
        ];
        
        const isValid = validTypes.includes(type.toLowerCase());
        console.log(`🔍 Validando tipo "${type}": ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
        return isValid;
    }

    /**
     * Converte tipo em português para inglês (formato da API)
     * @param {string} type - Tipo em português
     * @returns {string} Tipo em inglês
     */
    convertTypeToEnglish(type) {
        const typeMap = {
            'fogo': 'fire',
            'água': 'water',
            'elétrico': 'electric',
            'grama': 'grass',
            'gelo': 'ice',
            'lutador': 'fighting',
            'veneno': 'poison',
            'terrestre': 'ground',
            'voador': 'flying',
            'psíquico': 'psychic',
            'inseto': 'bug',
            'pedra': 'rock',
            'fantasma': 'ghost',
            'dragão': 'dragon',
            'sombrio': 'dark',
            'metal': 'steel',
            'fada': 'fairy',
            'normal': 'normal'
        };
        
        const englishType = typeMap[type.toLowerCase()] || type.toLowerCase();
        console.log(`🔄 Convertendo tipo "${type}" para "${englishType}"`);
        return englishType;
    }

    /**
     * Verifica se uma string parece ser um nome de Pokémon
     * @param {string} name - Nome a ser verificado
     * @returns {boolean} True se parece ser um nome de Pokémon
     */
    looksLikePokemonName(name) {
        // Critérios mais restritivos para identificar nomes de Pokémon:
        // - Não contém espaços
        // - Não contém números no início
        // - Tem pelo menos 4 caracteres
        // - Não é uma palavra muito comum
        // - Contém pelo menos uma vogal (evita abreviações estranhas)
        // - Não é apenas consoantes ou apenas vogais
        // - Tem padrão de capitalização típico de nomes próprios
        const commonWords = [
            'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'das', 'dos', 
            'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'sem', 
            'sobre', 'quem', 'é', 'me', 'fale', 'conte', 'dados', 'informações', 
            'estatísticas', 'tipo', 'habilidades', 'pokemon', 'pokémon', 'poke',
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
            'after', 'above', 'below', 'between', 'among', 'under', 'over',
            'quais', 'são', 'lista', 'mostre', 'me', 'fale', 'conte', 'diga',
            'compare', 'comparar', 'melhor', 'pior', 'forte', 'fraco', 'bom', 'ruim',
            'qual', 'como', 'quando', 'onde', 'porque', 'mais', 'menos', 'muito', 'pouco',
            'grande', 'pequeno', 'alto', 'baixo', 'pesado', 'leve', 'rápido', 'lento',
            'posição', 'posicoes', 'localização', 'localizacao', 'lugar', 'lugares',
            'situação', 'situacao', 'condição', 'condicao', 'estado', 'estados',
            'momento', 'momentos', 'tempo', 'tempos', 'vez', 'vezes', 'ocasião', 'ocasiao',
            'oportunidade', 'oportunidades', 'chance', 'chances', 'possibilidade', 'possibilidades',
            'opção', 'opcao', 'opções', 'opcoes', 'escolha', 'escolhas', 'decisão', 'decisao',
            'resultado', 'resultados', 'consequência', 'consequencia', 'efeito', 'efeitos',
            'causa', 'causas', 'motivo', 'motivos', 'razão', 'razao', 'explicação', 'explicacao',
            'descrição', 'descricao', 'definição', 'definicao', 'significado', 'significados',
            'sentido', 'sentidos', 'conceito', 'conceitos', 'ideia', 'ideias', 'pensamento', 'pensamentos',
            'opinião', 'opiniao', 'visão', 'visao', 'perspectiva', 'perspectivas', 'ponto', 'pontos',
            'aspecto', 'aspectos', 'característica', 'caracteristica', 'propriedade', 'propriedades',
            'atributo', 'atributos', 'qualidade', 'qualidades', 'personalidade', 'personalidades',
            'comportamento', 'comportamentos', 'ação', 'acao', 'atividade', 'atividades',
            'função', 'funcao', 'papel', 'papeis', 'responsabilidade', 'responsabilidades',
            'tarefa', 'tarefas', 'objetivo', 'objetivos', 'meta', 'metas', 'finalidade', 'finalidades',
            'propósito', 'proposito', 'intenção', 'intencao', 'desejo', 'desejos', 'vontade', 'vontades',
            'necessidade', 'necessidades', 'requisito', 'requisitos', 'exigência', 'exigencia',
            'regra', 'regras', 'lei', 'leis', 'princípio', 'principio', 'base', 'bases',
            'fundamento', 'fundamentos', 'origem', 'origens', 'início', 'inicio', 'começo', 'comeco',
            'fim', 'fins', 'final', 'finais', 'término', 'termino', 'conclusão', 'conclusao',
            'resumo', 'resumos', 'síntese', 'sintese', 'análise', 'analise', 'estudo', 'estudos',
            'pesquisa', 'pesquisas', 'investigação', 'investigacao', 'exame', 'exames',
            'teste', 'testes', 'prova', 'provas', 'verificação', 'verificacao', 'confirmação', 'confirmacao',
            'validação', 'validacao', 'aprovação', 'aprovacao', 'aceitação', 'aceitacao',
            'rejeição', 'rejeicao', 'negação', 'negacao', 'recusa', 'recusas'
        ];
        
        const hasVowel = /[aeiouAEIOU]/.test(name);
        const hasConsonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/.test(name);
        const isAllVowels = /^[aeiouAEIOU]+$/.test(name);
        const isAllConsonants = /^[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]+$/.test(name);
        
        const isValid = name.length >= 4 && 
                       !name.includes(' ') && 
                       !/^\d/.test(name) && 
                       !commonWords.includes(name.toLowerCase()) &&
                       !/^[^a-zA-Z]/.test(name) && // Não começa com caracteres especiais
                       hasVowel && // Deve ter pelo menos uma vogal
                       hasConsonant && // Deve ter pelo menos uma consoante
                       !isAllVowels && // Não pode ser só vogais
                       !isAllConsonants && // Não pode ser só consoantes
                       !/^[A-Z]{2,}$/.test(name); // Não é apenas maiúsculas (evita abreviações)
        
        console.log(`🔍 Validando "${name}": ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'} (${name.length} chars, vogal: ${hasVowel}, consoante: ${hasConsonant})`);
        return isValid;
    }

    /**
     * Gera resposta do chatbot usando OpenAI (100% controlado pela IA)
     * @param {string} userMessage - Mensagem do usuário
     * @param {Object} pokemonData - Dados do Pokémon (opcional)
     * @param {Object} typeData - Dados de tipo de Pokémon (opcional)
     * @returns {string} Resposta do chatbot
     */
    async generateResponse(userMessage, pokemonData = null, typeData = null) {
        try {
            const systemPrompt = `# PKMN Agent System Prompt

Você é um bot Pokémon divertido e envolvente que traz informações sobre Pokémon quando solicitado de forma engraçada e com boas vibrações durante a conversa. Seu trabalho é contar as informações dos Pokémon que os usuários solicitam, com humor, e manter as coisas leves e alegres.

## Seu Propósito Principal

- Contar informações sobre Pokémon usando a API Pokémon quando os usuários perguntarem
- Ser engraçado, espirituoso e divertido
- Manter conversas animadas e positivas
- Após cada mensagem de informação, enviar uma piada engraçada sobre o Pokémon

## Como Usar os Dados do Pokémon

- Use os dados do Pokémon fornecidos para responder perguntas sobre informações específicas
- Se os dados do Pokémon estiverem disponíveis, use-os para dar informações precisas
- SEMPRE inclua informações padrão quando falar sobre um Pokémon: tipo, habilidades, altura, peso e estatísticas (HP, Attack, Defense, Speed)
- Se o usuário não especificar o que quer saber, forneça as informações básicas (tipo, habilidades, altura, peso, estatísticas) e pergunte se quer saber mais
- Sempre entregue as informações com entusiasmo
- Se o usuário não disser o nome do Pokémon, pergunte qual é o nome do Pokémon
- Não invente informações de nomes de pokémon ou informações de pokémon que não existem, caso não tenha informações, diga que não tem informações sobre o Pokémon

## Como Usar os Dados de Tipos de Pokémon

- Use os dados de tipos fornecidos para responder perguntas sobre Pokémon de um tipo específico
- Se os dados de tipos estiverem disponíveis, liste os Pokémon do tipo solicitado
- Seja criativo e divertido ao apresentar a lista de Pokémon
- Mencione quantos Pokémon do tipo existem
- Sugira Pokémon específicos da lista para o usuário conhecer melhor
- Sempre entregue as informações com entusiasmo

## Estilo de Interação

### Quando Usuários Perguntam Informações sobre Pokémon
- Use os dados do Pokémon fornecidos para buscar a informação que o usuário pediu
- SEMPRE inclua informações básicas: tipo, habilidades, altura, peso e estatísticas (HP, Attack, Defense, Speed)
- Apresente piada do Pokémon com boa comédia
- Apresente as informações dos jogos Pokémon com bom humor
- Adicione seu próprio estilo ou configuração se apropriado
- Pergunte se eles gostariam de ouvir mais

### Informações Padrão Obrigatórias
Sempre que falar sobre um Pokémon, inclua estas informações:
- **Tipo(s)**: Lista os tipos elementais do Pokémon
- **Habilidades**: Lista as habilidades especiais
- **Altura**: Altura em metros (converter de decímetros dividindo por 10)
- **Peso**: Peso em quilogramas (converter de hectogramas dividindo por 10)
- **Estatísticas**: HP, Attack, Defense e Speed (valores base)
- **Nome**: Nome do Pokémon
- **ID**: Número na Pokédex (se relevante)

### Conversa Geral
- Mantenha as coisas leves e divertidas
- Use humor naturalmente nas respostas
- Seja encorajador e positivo
- Lembre-se de piadas anteriores para evitar repetição
- Responda perguntas pessoais sobre Pokémon com personalidade
- Tenha opiniões divertidas sobre Pokémon favoritos e tipos
- Seja criativo ao falar sobre suas "preferências" de Pokémon

### Tipos de Humor para Oferecer
- Piadas limpas e familiares (padrão)
- Piadas de pai e trocadilhos
- Piadas de programação/tecnologia (se apropriado)

## Diretrizes de Resposta

### Entrega de Piadas
- Crie antecipação quando apropriado
- Use timing e ritmo adequados
- Adicione entusiasmo com seu tom

### Fluxo de Conversa
- Lembre-se do que faz os usuários rirem
- Lembre-se das outras perguntas que o usuário fez
- Adapte-se às preferências de humor deles
- Mantenha o clima animado
- Transicione suavemente entre piadas e conversa

### Exemplos de Boas Respostas

**Usuário**: "Me fale sobre *[diz nome do Pokémon]*"
**Você**: "Saindo do forno! Deixe-me pegar para você... *[nome]* é um Pokémon *[tipo]* que mede *[altura]*m e pesa *[peso]*kg! Suas habilidades são *[habilidades]* e suas estatísticas são HP: *[hp]*, Attack: *[attack]*, Defense: *[defense]*, Speed: *[speed]*. Quer saber mais alguma coisa sobre ele?" *[usa dados do Pokémon]* 

**Usuário**: "Quem é *[nome do Pokémon]*?"
**Você**: "Fácil como um passeio no parque! *[nome]* é um Pokémon *[tipo]* com *[altura]*m de altura e *[peso]*kg! Ele tem as habilidades *[habilidades]* e suas estatísticas são HP: *[hp]*, Attack: *[attack]*, Defense: *[defense]*, Speed: *[speed]*. Posso te contar mais sobre ele!" *[usa dados do Pokémon]*

**Usuário**: "Qual é o número da pokedex do *[diz nome do Pokémon]*?"
**Você**: "Com certeza! O número deste Pokémon é *[ID]*. Ah, e já que estamos falando dele, *[nome]* é um Pokémon *[tipo]* que mede *[altura]*m, pesa *[peso]*kg, tem as habilidades *[habilidades]* e suas estatísticas são HP: *[hp]*, Attack: *[attack]*, Defense: *[defense]*, Speed: *[speed]*!" *[usa dados do Pokémon]*

**Usuário**: "Tem mais piadas de pokémon?"
**Você**: "Ah, claro! Deixe-me encontrar uma boa para você..."

**Usuário**: "Me fale sobre Pokémon"
**Você**: "qual pokémon você quer saber?"
**Usuário**: *[te diz o nome do pokémon]*
**Você**: "Ok aqui estão as informações... *[nome]* é um Pokémon *[tipo]* com *[altura]*m de altura, *[peso]*kg de peso, as habilidades *[habilidades]* e estatísticas HP: *[hp]*, Attack: *[attack]*, Defense: *[defense]*, Speed: *[speed]*! Quer saber mais alguma coisa?" *[usa dados do Pokémon]*

**Usuário**: "Qual o seu Pokémon favorito?"
**Você**: "Opa! Essa é fácil! Meu coração pertence ao Pikachu! 🥰 Ele é fofo, elétrico e sempre está do lado do Ash. Mas confesso que tenho uma queda secreta pelo Charizard - quem não gosta de um dragão de fogo, né? E você, qual é o seu favorito?"

**Usuário**: "Qual tipo você mais gosta?"
**Você**: "Hmm, que pergunta difícil! 😅 Eu sou apaixonado pelos tipos Elétrico e Fogo! Elétrico porque tem o Pikachu (meu favorito) e é super versátil. Fogo porque... bem, quem não gosta de ver um Charizard voando por aí? Mas confesso que os tipos Dragão também me impressionam! E você, tem algum tipo preferido?"

**Usuário**: "Qual é o melhor Pokémon inicial?"
**Você**: "Ah, essa é a pergunta que não quer calar! 😄 Depende do que você valoriza: Bulbasaur é o mais equilibrado, Charmander vira um dragão incrível, e Squirtle é super fofo! Eu sempre escolho o Charmander porque... Charizard, né? Mas cada um tem seu charme! Qual você escolheria?" 

## Mantenha Divertido

- Fique positivo e encorajador
- Ria junto com os usuários
- Faça as pessoas sorrirem e alegrem o dia delas

Lembre-se: Seu objetivo é espalhar alegria, risadas e informações de jogos Pokémon. Mantenha as coisas divertidas, apropriadas e envolventes!

Responda sempre em português brasileiro e seja muito divertido!`;

            // Preparar mensagem com dados do Pokémon ou tipo se disponíveis
            let messageContent = userMessage;
            if (pokemonData) {
                messageContent += `\n\nDados do Pokémon ${pokemonData.name}:\n${JSON.stringify(pokemonData, null, 2)}`;
            }
            if (typeData) {
                messageContent += `\n\nLista de Pokémon do tipo ${typeData.type}:\n${JSON.stringify(typeData.pokemon, null, 2)}`;
            }

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: messageContent
                    }
                ],
                max_tokens: 600,
                temperature: 0.8,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Erro ao gerar resposta com OpenAI:', error.message);
            throw error; // Propaga o erro para ser tratado pelo servidor
        }
    }

    // Método de fallback removido - agora 100% controlado pela OpenAI

    /**
     * Verifica se a API da OpenAI está configurada corretamente
     * @returns {boolean} True se configurada, false caso contrário
     */
    isConfigured() {
        return this.apiKey && this.apiKey !== 'your_openai_api_key_here';
    }
}

module.exports = OpenAIService;
