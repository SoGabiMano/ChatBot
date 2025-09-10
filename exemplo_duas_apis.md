# 🔄 Sistema de Detecção Inteligente - Duas APIs

## 🎯 **Funcionamento:**

O sistema agora detecta automaticamente se a mensagem é sobre:
- **Pokémon específico** → Requisição para `https://pokeapi.co/api/v2/pokemon/`
- **Tipo de Pokémon** → Requisição para `https://pokeapi.co/api/v2/type/`

## 🔍 **Detecção Inteligente:**

### **1. Correção de Erros de Digitação:**
- ✅ **Correção automática** usando IA (OpenAI)
- ✅ **Mensagens corrigidas** antes da análise
- ✅ **Logs de correção** para monitoramento

### **2. Prioridade para Tipos:**
Se a mensagem contém palavras-chave de tipo:
- "tipo", "tipos", "quais são", "lista de", "pokemon do tipo"

### **3. Fallback para Pokémon:**
Se não detectar tipo, procura por nomes de Pokémon

## 📊 **Exemplos Práticos:**

### **Pergunta sobre TIPO:**
```
"Quais são os pokemon do tipo água?"
```

**Logs:**
```
🔍 Analisando mensagem: "quais são os pokemon do tipo água?"
🔧 Mensagem corrigida: "quai são os pokemon do tipo água?" → "quais são os pokemon do tipo água?"
🎯 Padrão de tipo encontrado: "/quais são os pokemon do tipo (.+)/i" - Tipo extraído: "água"
✅ Tipo validado: água
🔄 Convertendo tipo "água" para "water"
🌐 Fazendo requisição para: https://pokeapi.co/api/v2/type/water
✅ Requisição bem-sucedida!
📊 Pokémon do tipo água (water) encontrados: 150
```

**API Usada:** `https://pokeapi.co/api/v2/type/water`

### **Pergunta sobre POKÉMON:**
```
"Me fale sobre Pikachu"
```

**Logs:**
```
🔍 Analisando mensagem: "me fale sobre pikachu"
🔧 Mensagem corrigida: "me fale sobre pikachu" → "me fale sobre pikachu"
🎯 Padrão encontrado: "/me fale sobre (.+)/i" - Nome extraído: "pikachu"
✅ Nome validado como Pokémon: pikachu
🌐 Fazendo requisição para: https://pokeapi.co/api/v2/pokemon/pikachu
✅ Requisição bem-sucedida!
📊 Dados do Pokémon obtidos: pikachu (ID: 25)
```

**API Usada:** `https://pokeapi.co/api/v2/pokemon/pikachu`

## 🌐 **APIs Utilizadas:**

### **API de Pokémon Individual:**
- **URL**: `https://pokeapi.co/api/v2/pokemon/{nome}`
- **Quando**: Perguntas sobre Pokémon específico
- **Retorna**: Dados completos do Pokémon

### **API de Tipos:**
- **URL**: `https://pokeapi.co/api/v2/type/{tipo}`
- **Quando**: Perguntas sobre tipos de Pokémon
- **Retorna**: Lista de Pokémon do tipo

## 🔄 **Conversão de Tipos:**

### **Português → Inglês:**
- `água` → `water`
- `fogo` → `fire`
- `elétrico` → `electric`
- `grama` → `grass`
- `gelo` → `ice`
- `lutador` → `fighting`
- `veneno` → `poison`
- `terrestre` → `ground`
- `voador` → `flying`
- `psíquico` → `psychic`
- `inseto` → `bug`
- `pedra` → `rock`
- `fantasma` → `ghost`
- `dragão` → `dragon`
- `sombrio` → `dark`
- `metal` → `steel`
- `fada` → `fairy`

## 📝 **Tipos Suportados (Baseados na PokéAPI):**

Baseado na [PokéAPI](https://pokeapi.co/api/v2/type/), existem **18 tipos** diferentes:

1. **normal** - Normal
2. **fighting** - Lutador
3. **flying** - Voador
4. **poison** - Veneno
5. **ground** - Terrestre
6. **rock** - Pedra
7. **bug** - Inseto
8. **ghost** - Fantasma
9. **steel** - Metal
10. **fire** - Fogo
11. **water** - Água
12. **grass** - Grama
13. **electric** - Elétrico
14. **psychic** - Psíquico
15. **ice** - Gelo
16. **dragon** - Dragão
17. **dark** - Sombrio
18. **fairy** - Fada

## 🎯 **Exemplos de Perguntas:**

### **Sobre Tipos (API de Tipos):**
- "Quais são os pokemon do tipo água?"
- "Pokemon do tipo fogo"
- "Lista de pokémon elétrico"
- "Tipo dragão"
- "Quais pokemon são fada?"

### **Sobre Pokémon (API de Pokémon):**
- "Me fale sobre Pikachu"
- "Quem é Charizard?"
- "Informações sobre Lucario"
- "pikachu"
- "charizard"

## 🚀 **Benefícios:**

- ✅ **Correção automática** de erros de digitação com IA
- ✅ **Detecção automática** do tipo de pergunta
- ✅ **API correta** baseada na detecção
- ✅ **Suporte bilíngue** (português/inglês)
- ✅ **18 tipos suportados** (baseados na PokéAPI)
- ✅ **Conversão automática** de tipos
- ✅ **Logs detalhados** para debug
- ✅ **Tratamento de erros** específico

## 🔧 **Fluxo de Funcionamento:**

```
Mensagem do Usuário
        ↓
🔧 Correção de Erros de Digitação (IA)
        ↓
🔍 Detecção Inteligente
        ↓
┌─────────────────┬─────────────────┐
│   É sobre TIPO? │  É sobre POKÉMON? │
└─────────────────┴─────────────────┘
        ↓                    ↓
API de Tipos          API de Pokémon
https://pokeapi.co/   https://pokeapi.co/
api/v2/type/          api/v2/pokemon/
        ↓                    ↓
Lista de Pokémon      Dados do Pokémon
do tipo solicitado    específico
```

---

**Agora o sistema é verdadeiramente inteligente e usa a API correta para cada tipo de pergunta! 🎉**
