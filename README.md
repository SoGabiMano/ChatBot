# 🤖 Bot Pokémon do Telegram com OpenAI

Um bot inteligente do Telegram que se conecta com a API do Pokémon e utiliza a OpenAI para gerar respostas divertidas e informativas sobre qualquer Pokémon, com continuidade de conversa.

## ✨ Funcionalidades

- 🔍 **Detecção Inteligente**: Detecta automaticamente quando o usuário pergunta sobre um Pokémon
- 🌐 **Integração com API**: Busca dados reais na [PokéAPI](https://pokeapi.co/)
- 🤖 **IA Avançada**: Utiliza OpenAI GPT-4o-mini para respostas divertidas e precisas
- 💬 **Continuidade de Conversa**: Lembra do contexto da conversa para respostas mais naturais
- 📊 **Dados Completos**: Altura, peso, tipos, habilidades, estatísticas e sprites
- 🎭 **Humor**: Respostas engraçadas e envolventes sobre Pokémon
- 🔧 **Logs Detalhados**: Monitoramento completo do fluxo de requisições
- ⏰ **Gerenciamento de Sessões**: Limpeza automática de conversas antigas

## 🚀 Como Funciona

```
Usuário no Telegram: "Me fale sobre Pikachu"
    ↓
Sistema detecta "Pikachu" na mensagem
    ↓
GET https://pokeapi.co/api/v2/pokemon/pikachu
    ↓
Recebe dados completos do Pokémon
    ↓
OpenAI gera resposta divertida com as informações
    ↓
Salva no histórico da conversa (sessionId: telegram_123456)
    ↓
Retorna resposta para o usuário no Telegram

Usuário: "E o Charizard?"
    ↓
Sistema busca histórico da conversa
    ↓
OpenAI recebe contexto completo (incluindo Pikachu anterior)
    ↓
Gera resposta referenciando conversa anterior
    ↓
"Ah, o Charizard! Diferente do Pikachu que acabamos de ver..."
```

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- Chave da API da OpenAI
- Conexão com a internet

## 🛠️ Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd ChatBot
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   OPENAI_API_KEY=sua_chave_da_openai_aqui
   TELEGRAM_BOT_TOKEN=seu_token_do_telegram_aqui
   PORT=3000
   ```

4. **Execute o bot:**
   ```bash
   npm start
   ```

5. **Use o bot no Telegram:**
   Procure pelo seu bot no Telegram e inicie uma conversa

## 📁 Estrutura do Projeto

```
ChatBot/
├── config/
│   └── telegram.js         # Configuração do Telegram
├── services/
│   ├── openaiService.js    # Serviço da OpenAI com continuidade
│   ├── pokemonService.js   # Serviço da PokéAPI
│   ├── telegramService.js  # Serviço do Telegram
│   └── spellCorrectionService.js # Correção de digitação
├── server.js               # Inicializador do bot
├── package.json            # Dependências do projeto
└── README.md              # Documentação
```

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `OPENAI_API_KEY` | Chave da API da OpenAI | ✅ |
| `TELEGRAM_BOT_TOKEN` | Token do bot do Telegram | ✅ |

### Obter Chave da OpenAI

1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Crie uma conta ou faça login
3. Vá para "API Keys"
4. Crie uma nova chave
5. Copie e cole no arquivo `.env`

### Obter Token do Telegram

1. Acesse [@BotFather](https://t.me/botfather) no Telegram
2. Envie `/newbot` para criar um novo bot
3. Escolha um nome e username para seu bot
4. Copie o token fornecido
5. Cole no arquivo `.env` como `TELEGRAM_BOT_TOKEN`

## 🎯 Como Usar

### Exemplos de Conversas no Telegram

**Conversa com continuidade:**
```
Usuário: "Me fale sobre Pikachu"
Bot: [Informações completas sobre Pikachu + piada]

Usuário: "E o Charizard?"
Bot: "Ah, o Charizard! Diferente do Pikachu que acabamos de ver, o Charizard é um dragão de fogo incrível..."

Usuário: "Qual é mais forte?"
Bot: "Boa pergunta! Comparando o Pikachu com o Charizard que mencionamos..."
```

### Exemplos de Mensagens que Funcionam

- "Me fale sobre Pikachu"
- "Quem é Charizard?"
- "Informações sobre Lucario"
- "Dados do Greninja"
- "Estatísticas do Decidueye"
- "Tipo do Mimikyu"
- "Habilidades do Marshadow"
- "Conte sobre Zeraora"
- "Pokemon Meltan"

### Detecção Inteligente

O sistema detecta automaticamente:
- ✅ Qualquer nome de Pokémon mencionado
- ✅ Padrões de pergunta ("me fale sobre", "quem é", etc.)
- ✅ Indicadores de Pokémon ("pokemon", "pokémon", "poke")
- ✅ Validação de nomes (filtra palavras comuns)

## 📊 Dados Retornados

Para cada Pokémon, a API retorna:
- **ID**: Número na Pokédex
- **Nome**: Nome do Pokémon
- **Altura e Peso**: Dimensões físicas
- **Tipos**: Tipos elementais (fogo, água, etc.)
- **Habilidades**: Habilidades especiais
- **Estatísticas**: HP, Ataque, Defesa, etc.
- **Sprites**: Imagens do Pokémon

## 🔍 Logs e Monitoramento

O sistema gera logs detalhados para debug:

```
💬 Chat Telegram telegram_123456: Enviando 3 mensagens para OpenAI (histórico: 2)
🔍 Detectado Pokémon: pikachu
🌐 Fazendo requisição para: https://pokeapi.co/api/v2/pokemon/pikachu
📡 Iniciando requisição HTTP GET para: https://pokeapi.co/api/v2/pokemon/pikachu
📈 Status da resposta: 200 OK
📦 Tamanho da resposta: 15432 caracteres
🎯 Dados processados com sucesso para: pikachu
✅ Requisição bem-sucedida!
📊 Dados do Pokémon obtidos: pikachu (ID: 25)
🏷️ Tipos: electric
💪 Habilidades: static, lightning-rod
📏 Altura: 0.4m | Peso: 6kg
💾 Histórico atualizado para chat Telegram telegram_123456: 3 mensagens
```

## 🛡️ Tratamento de Erros

- **Pokémon não encontrado**: Continua funcionando sem dados
- **Erro de rede**: Logs detalhados do erro
- **API indisponível**: Fallback para resposta geral
- **Validação**: Filtra nomes inválidos

## 🚀 Scripts Disponíveis

```bash
# Iniciar bot do Telegram
npm start

# Desenvolvimento com auto-reload
npm run dev
```

## 📚 APIs Utilizadas

- **[PokéAPI](https://pokeapi.co/)**: Dados dos Pokémon
- **[OpenAI API](https://openai.com/)**: Geração de respostas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Gabi** - Desenvolvedora do ChatBot Pokémon

## 🙏 Agradecimentos

- [PokéAPI](https://pokeapi.co/) pela API gratuita dos Pokémon
- [OpenAI](https://openai.com/) pela API de IA
- Comunidade Pokémon pela inspiração

---

**Divirta-se explorando o mundo dos Pokémon! 🎮✨**