class PokemonChatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.loading = document.getElementById('loading');
        // Removido: controle de primeira mensagem - agora 100% controlado pela OpenAI
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Enviar mensagem ao pressionar Enter
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Enviar mensagem ao clicar no botão
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Ações rápidas
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.setLoading(true);

        // Removido: mensagem de boas-vindas hardcoded - agora 100% controlado pela OpenAI

        try {
            // Enviar para o servidor
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.addMessage(data.response, 'bot');
            } else {
                this.addMessage('Desculpe, ocorreu um erro. Tente novamente.', 'bot');
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            this.addMessage('Desculpe, não foi possível conectar com o servidor. Verifique sua conexão.', 'bot');
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Formatar conteúdo (suporte básico a markdown)
        const formattedContent = this.formatMessage(content);
        messageContent.innerHTML = formattedContent;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);

        // Scroll para a última mensagem
        this.scrollToBottom();
    }

    formatMessage(content) {
        // Formatação básica de markdown e emojis
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/🎮|⚪|📏|⚖️|🏷️|💪|📊|🖼️|🎉|🔥|⚡|🎭|😄|📋|❓/g, '<span style="font-size: 1.2em;">$&</span>');
    }

    handleQuickAction(action) {
        const actions = {
            list: 'Me mostre uma lista de Pokémon',
            pikachu: 'Me fale sobre o Pikachu',
            jokes: 'Me conte uma piada de Pokémon!',
            types: 'Quais são os tipos de Pokémon?',
            help: 'Como posso usar este chatbot?'
        };

        const message = actions[action];
        if (message) {
            this.messageInput.value = message;
            this.sendMessage();
        }
    }

    setLoading(loading) {
        this.loading.style.display = loading ? 'flex' : 'none';
        this.sendButton.disabled = loading;
        this.messageInput.disabled = loading;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Inicializar o chatbot quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new PokemonChatbot();
});
