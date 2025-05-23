/**
 * Arquivo: theme.js
 * Implementa o sistema de temas e design system
 */

// Importar dependências
let Utils, CONFIG;

// Verificar ambiente de execução
if (typeof module !== 'undefined' && module.exports) {
    Utils = require('./utils');
    CONFIG = require('./config');
} else {
    Utils = window.Utils;
    CONFIG = window.CONFIG;
}

/**
 * Classe que implementa o sistema de temas e design system
 */
class ThemeSystem {
    /**
     * Construtor do sistema de temas
     */
    constructor() {
        this.darkMode = false; // Modo escuro desativado por padrão
        
        // Verificar preferência do sistema
        if (Utils.shouldUseDarkMode()) {
            this.darkMode = true;
        }
        
        // Verificar preferência salva
        const savedTheme = Utils.getFromLocalStorage('theme');
        if (savedTheme) {
            this.darkMode = savedTheme === 'dark';
        }
        
        // Inicializar o tema
        this.applyTheme();
        
        // Adicionar listener para mudanças na preferência do sistema
        this.setupSystemPreferenceListener();
    }
    
    /**
     * Aplica o tema atual
     */
    applyTheme() {
        const theme = this.darkMode ? CONFIG.ui.theme.dark : CONFIG.ui.theme.light;
        
        // Aplicar variáveis CSS
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--success-color', theme.success);
        document.documentElement.style.setProperty('--danger-color', theme.danger);
        document.documentElement.style.setProperty('--warning-color', theme.warning);
        document.documentElement.style.setProperty('--info-color', theme.info);
        document.documentElement.style.setProperty('--background-color', theme.background);
        document.documentElement.style.setProperty('--surface-color', theme.surface);
        document.documentElement.style.setProperty('--text-color', theme.text);
        
        // Adicionar/remover classe dark-mode do body
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Salvar preferência
        Utils.saveToLocalStorage('theme', this.darkMode ? 'dark' : 'light');
    }
    
    /**
     * Alterna entre modo claro e escuro
     */
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        this.applyTheme();
        
        // Notificar a mudança
        this.showToast(`Modo ${this.darkMode ? 'escuro' : 'claro'} ativado`);
    }
    
    /**
     * Configura listener para mudanças na preferência do sistema
     */
    setupSystemPreferenceListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Adicionar listener para mudanças
            mediaQuery.addEventListener('change', (e) => {
                // Só mudar automaticamente se o usuário não tiver definido uma preferência
                if (!Utils.getFromLocalStorage('theme')) {
                    this.darkMode = e.matches;
                    this.applyTheme();
                }
            });
        }
    }
    
    /**
     * Exibe uma notificação toast
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo de notificação (success, error, warning, info)
     * @param {number} duration - Duração em ms
     */
    showToast(message, type = 'info', duration = CONFIG.ui.toast.duration) {
        // Verificar se o container de toasts existe
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            // Criar container de toasts
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.style.position = 'fixed';
            
            // Posicionar de acordo com a configuração
            switch (CONFIG.ui.toast.position) {
                case 'top-left':
                    toastContainer.style.top = '20px';
                    toastContainer.style.left = '20px';
                    break;
                case 'top-right':
                    toastContainer.style.top = '20px';
                    toastContainer.style.right = '20px';
                    break;
                case 'bottom-left':
                    toastContainer.style.bottom = '20px';
                    toastContainer.style.left = '20px';
                    break;
                case 'bottom-right':
                default:
                    toastContainer.style.bottom = '20px';
                    toastContainer.style.right = '20px';
                    break;
            }
            
            document.body.appendChild(toastContainer);
        }
        
        // Criar toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="toast-icon fas ${this.getIconForType(type)}"></i>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Adicionar ao container
        toastContainer.appendChild(toast);
        
        // Adicionar evento de clique no botão de fechar
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.removeToast(toast);
        });
        
        // Mostrar o toast com animação
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remover após a duração especificada
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    }
    
    /**
     * Remove um toast com animação
     * @param {HTMLElement} toast - Elemento do toast
     */
    removeToast(toast) {
        // Adicionar classe para animar a saída
        toast.classList.add('hide');
        
        // Remover após a animação
        setTimeout(() => {
            toast.remove();
            
            // Verificar se o container está vazio
            const toastContainer = document.querySelector('.toast-container');
            if (toastContainer && !toastContainer.hasChildNodes()) {
                toastContainer.remove();
            }
        }, CONFIG.ui.animation.duration);
    }
    
    /**
     * Retorna o ícone para o tipo de notificação
     * @param {string} type - Tipo de notificação
     * @returns {string} Classe do ícone
     */
    getIconForType(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'info':
            default:
                return 'fa-info-circle';
        }
    }
    
    /**
     * Adiciona tooltips a elementos
     * @param {string} selector - Seletor CSS para os elementos
     */
    addTooltips(selector = '[data-tooltip]') {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            // Verificar se já tem tooltip
            if (element.hasAttribute('data-tooltip-initialized')) {
                return;
            }
            
            // Marcar como inicializado
            element.setAttribute('data-tooltip-initialized', 'true');
            
            // Adicionar eventos
            element.addEventListener('mouseenter', () => {
                this.showTooltip(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
            
            // Adicionar para dispositivos touch
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.showTooltip(element);
                
                // Esconder após um tempo
                setTimeout(() => {
                    this.hideTooltip();
                }, 3000);
            });
        });
    }
    
    /**
     * Exibe um tooltip
     * @param {HTMLElement} element - Elemento que acionou o tooltip
     */
    showTooltip(element) {
        // Obter texto do tooltip
        const text = element.getAttribute('data-tooltip');
        if (!text) return;
        
        // Verificar se já existe um tooltip
        this.hideTooltip();
        
        // Criar tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        // Adicionar ao body
        document.body.appendChild(tooltip);
        
        // Posicionar o tooltip
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Posição padrão: acima do elemento
        let top = rect.top - tooltipRect.height - 10;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        
        // Verificar se cabe na tela
        if (top < 10) {
            // Posicionar abaixo do elemento
            top = rect.bottom + 10;
            tooltip.classList.add('bottom');
        } else {
            tooltip.classList.add('top');
        }
        
        // Ajustar posição horizontal se necessário
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        
        // Aplicar posição
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        
        // Mostrar com animação
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
    }
    
    /**
     * Esconde o tooltip atual
     */
    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
            
            // Remover após a animação
            setTimeout(() => {
                tooltip.remove();
            }, CONFIG.ui.animation.duration);
        }
    }
    
    /**
     * Configura atalhos de teclado globais
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+D: Alternar modo escuro
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleDarkMode();
            }
            
            // Outros atalhos definidos na configuração
            const shortcuts = CONFIG.keyboardShortcuts;
            
            for (const [action, shortcut] of Object.entries(shortcuts)) {
                const keys = shortcut.split('+');
                const modifiers = {
                    ctrl: keys.includes('Ctrl'),
                    alt: keys.includes('Alt'),
                    shift: keys.includes('Shift')
                };
                
                const key = keys.filter(k => !['Ctrl', 'Alt', 'Shift'].includes(k))[0];
                
                if (
                    e.ctrlKey === modifiers.ctrl &&
                    e.altKey === modifiers.alt &&
                    e.shiftKey === modifiers.shift &&
                    e.key.toLowerCase() === key.toLowerCase()
                ) {
                    e.preventDefault();
                    
                    // Disparar evento personalizado
                    const event = new CustomEvent('shortcut', {
                        detail: { action }
                    });
                    
                    document.dispatchEvent(event);
                }
            }
        });
    }
}

// Exportar a classe para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSystem;
} else {
    window.ThemeSystem = ThemeSystem;
}
