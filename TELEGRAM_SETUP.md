# 🤖 Configuração do Bot do Telegram

## ✅ Instalação Concluída

O `node-telegram-bot-api` foi instalado com sucesso e o bot está configurado para funcionar no Telegram.

## 🔑 Token de Autenticação

O token do bot é configurado via variável de ambiente no arquivo `.env`:

```env
TELEGRAM_BOT_TOKEN=seu_token_do_telegram_aqui
```

## 🚀 Como Iniciar o Bot

1. **Inicie o servidor:**
   ```bash
   node server.js
   ```

2. **O bot será iniciado automaticamente** e estará disponível no Telegram.

3. **Primeira interação:** Simplesmente envie qualquer mensagem para o bot no Telegram!

## 📱 Como Usar o Bot no Telegram

### Interação Natural:

O bot funciona de forma completamente natural - **sem comandos!** Simplesmente envie uma mensagem e ele responderá.

### Exemplos de Uso:

1. **Buscar Pokémon específico:**
   - "Me fale sobre Pikachu"
   - "Quero saber sobre Charizard"
   - "Informações do Mewtwo"

2. **Buscar por tipo:**
   - "Pokémon de fogo"
   - "Quais são os pokemon do tipo água?"
   - "Mostre Pokémon elétricos"
   - "Lista de pokémon dragão"

3. **Conversas gerais:**
   - "Qual é o melhor Pokémon inicial?"
   - "Compare Charizard e Blastoise"
   - "Estratégias de batalha Pokémon"
   - "História dos Pokémon"

4. **Perguntas pessoais ao chat:**
   - "Qual o seu Pokémon favorito?"
   - "Qual tipo você mais gosta?"
   - "Qual é o melhor Pokémon inicial?"
   - "Qual sua opinião sobre [Pokémon]?"
   - "Me conte uma curiosidade sobre Pokémon"

## 🎯 **Tipos de Pokémon Suportados:**

O bot reconhece **18 tipos** diferentes (baseados na PokéAPI):

### **Tipos em Português:**
- Fogo, Água, Elétrico, Grama, Gelo
- Lutador, Veneno, Terrestre, Voador, Psíquico
- Inseto, Pedra, Fantasma, Dragão, Sombrio
- Metal, Fada, Normal

### **Exemplos de Perguntas sobre Tipos:**
- "Quais são os pokemon do tipo água?"
- "Pokemon do tipo fogo"
- "Lista de pokémon elétrico"
- "Tipo dragão"
- "Quais pokemon são fada?"

## 🔧 Correção Automática de Erros

O bot agora corrige automaticamente erros de digitação usando **IA (OpenAI)**:

### ✅ **Exemplos de Correções:**

- **"Me fle sobre Pikachu"** → **"Me fale sobre Pikachu"**
- **"guyarados"** → **"gyarados"**
- **"pekemon"** → **"pokemon"**
- **"quai são os pokemon"** → **"quais são os pokemon"**
- **"agua"** → **"water"**
- **"eletrico"** → **"electric"**
- **"dragao"** → **"dragon"**

### 🎯 **Como Funciona:**

1. **IA OpenAI** corrige erros de digitação automaticamente
2. **Correção inteligente** baseada em contexto
3. **Logs no console** quando há correções
4. **Transparente para o usuário** - funciona automaticamente
5. **Mensagem original** vs **mensagem corrigida** registrada
6. **Processamento** antes da detecção de Pokémon/tipo

### 🔧 **Melhorias Implementadas:**

- ✅ **Correção com IA** - usa OpenAI para correções inteligentes
- ✅ **Contexto preservado** - mantém o significado da mensagem
- ✅ **Logs detalhados** - mostra correções feitas
- ✅ **Processamento automático** - sem intervenção do usuário
- ✅ **Integração perfeita** - funciona com detecção de Pokémon/tipo

## 🔧 Funcionalidades

O bot do Telegram possui as mesmas funcionalidades do chatbot web:

- ✅ **Modelo GPT-4.1-mini** para respostas inteligentes
- ✅ **18 tipos de Pokémon** suportados (baseados na PokéAPI)
- ✅ Detecção automática de Pokémon na mensagem
- ✅ Busca de informações na PokéAPI
- ✅ Busca por tipo de Pokémon
- ✅ Respostas inteligentes usando OpenAI
- ✅ **Correção automática de erros de digitação**
- ✅ **Busca aproximada para nomes de Pokémon**
- ✅ **Personalidade própria para perguntas pessoais**
- ✅ **Conhecimento amplo sobre Pokémon**
- ✅ Interface amigável com emojis

## 🛠️ Estrutura dos Arquivos

```
├── config/
│   └── telegram.js          # Configuração do token do Telegram (via .env)
├── services/
│   ├── telegramService.js   # Serviço principal do bot
│   ├── openaiService.js     # Serviço da OpenAI
│   ├── pokemonService.js    # Serviço da PokéAPI
│   └── spellCorrectionService.js # Correção de erros de digitação
├── .env                     # Variáveis de ambiente 
└── server.js                # Servidor principal (atualizado)
```

## 🚨 Importante

- O bot precisa estar rodando para funcionar no Telegram
- Certifique-se de que o token está correto
- O bot responderá apenas quando o servidor estiver ativo
- Para parar o bot, pare o servidor (Ctrl+C)

## 🎯 Próximos Passos

1. **Configure o arquivo `.env`:**
   ```env
   OPENAI_API_KEY=sua_chave_da_openai_aqui
   TELEGRAM_BOT_TOKEN=seu_token_do_telegram_aqui
   PORT=3000
   ```

2. **Inicie o servidor:** `node server.js`
3. **Procure pelo seu bot** no Telegram
4. **Envie qualquer mensagem** para começar a conversar
5. **Teste as funcionalidades** com perguntas naturais:
   - Pergunte sobre Pokémon específicos
   - Teste busca por tipos
   - Experimente com erros de digitação
   - Faça perguntas pessoais ao bot

## 🚀 **Recursos Avançados:**

- ✅ **Correção automática** de erros de digitação
- ✅ **18 tipos de Pokémon** suportados
- ✅ **Modelo GPT-4.1-mini** para respostas inteligentes
- ✅ **Detecção automática** de Pokémon e tipos
- ✅ **Respostas com informações completas** (altura, peso, estatísticas)
- ✅ **Personalidade divertida** e envolvente

O bot está pronto para uso! 🚀
