/**
 * Arquivo: utils.js
 * Funções utilitárias para o sistema de validação fiscal
 */

/**
 * Classe de utilitários para o sistema
 */
class Utils {
    /**
     * Divide um array em chunks de tamanho específico
     * @param {Array} array - Array a ser dividido
     * @param {number} chunkSize - Tamanho de cada chunk
     * @returns {Array} Array de chunks
     */
    static chunkArray(array, chunkSize) {
        if (!array || !array.length) return [];
        
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        
        return chunks;
    }

    /**
     * Formata um valor numérico como moeda
     * @param {number} value - Valor a ser formatado
     * @param {string} locale - Localidade para formatação (padrão: 'pt-BR')
     * @param {string} currency - Moeda para formatação (padrão: 'BRL')
     * @returns {string} Valor formatado como moeda
     */
    static formatCurrency(value, locale = 'pt-BR', currency = 'BRL') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(value);
    }

    /**
     * Formata um valor numérico com separadores de milhar e casas decimais
     * @param {number} value - Valor a ser formatado
     * @param {number} decimalPlaces - Número de casas decimais (padrão: 2)
     * @param {string} locale - Localidade para formatação (padrão: 'pt-BR')
     * @returns {string} Valor formatado
     */
    static formatNumber(value, decimalPlaces = 2, locale = 'pt-BR') {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        }).format(value);
    }

    /**
     * Converte um valor para número
     * @param {any} value - Valor a ser convertido
     * @returns {number} Valor numérico
     */
    static parseNumber(value) {
        if (value === null || value === undefined || value === '') {
            return 0;
        }
        
        if (typeof value === 'number') {
            return value;
        }
        
        // Remover caracteres não numéricos, exceto ponto e vírgula
        const cleanValue = String(value).replace(/[^\d.,]/g, '')
            .replace(',', '.'); // Substituir vírgula por ponto
        
        return parseFloat(cleanValue) || 0;
    }

    /**
     * Formata uma data
     * @param {Date|string} date - Data a ser formatada
     * @param {string} format - Formato desejado (padrão: 'dd/MM/yyyy HH:mm:ss')
     * @param {string} locale - Localidade para formatação (padrão: 'pt-BR')
     * @returns {string} Data formatada
     */
    static formatDate(date, format = 'dd/MM/yyyy HH:mm:ss', locale = 'pt-BR') {
        const options = {};
        
        if (format.includes('dd')) {
            options.day = '2-digit';
        }
        
        if (format.includes('MM')) {
            options.month = '2-digit';
        }
        
        if (format.includes('yyyy')) {
            options.year = 'numeric';
        }
        
        if (format.includes('HH')) {
            options.hour = '2-digit';
        }
        
        if (format.includes('mm')) {
            options.minute = '2-digit';
        }
        
        if (format.includes('ss')) {
            options.second = '2-digit';
        }
        
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        return dateObj.toLocaleString(locale, options);
    }

    /**
     * Gera um ID único
     * @returns {string} ID único
     */
    static generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    /**
     * Trunca um texto com ellipsis
     * @param {string} text - Texto a ser truncado
     * @param {number} maxLength - Tamanho máximo (padrão: 100)
     * @returns {string} Texto truncado
     */
    static truncateText(text, maxLength = 100) {
        if (!text || text.length <= maxLength) {
            return text;
        }
        
        return text.substring(0, maxLength) + '...';
    }

    /**
     * Escapa HTML para prevenir XSS
     * @param {string} html - HTML a ser escapado
     * @returns {string} HTML escapado
     */
    static escapeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Verifica se o modo escuro deve ser ativado com base nas preferências do sistema
     * @returns {boolean} Verdadeiro se o modo escuro deve ser ativado
     */
    static shouldUseDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * Detecta se o dispositivo é móvel
     * @returns {boolean} Verdadeiro se for um dispositivo móvel
     */
    static isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Salva dados no localStorage
     * @param {string} key - Chave para armazenamento
     * @param {any} value - Valor a ser armazenado
     */
    static saveToLocalStorage(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }

    /**
     * Recupera dados do localStorage
     * @param {string} key - Chave para recuperação
     * @param {any} defaultValue - Valor padrão caso a chave não exista
     * @returns {any} Valor recuperado ou valor padrão
     */
    static getFromLocalStorage(key, defaultValue = null) {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return defaultValue;
            }
            return JSON.parse(serializedValue);
        } catch (error) {
            console.error('Erro ao recuperar do localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Copia texto para a área de transferência
     * @param {string} text - Texto a ser copiado
     * @returns {Promise<boolean>} Promessa que resolve para verdadeiro se a cópia foi bem-sucedida
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback para navegadores mais antigos
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            }
        } catch (error) {
            console.error('Erro ao copiar para a área de transferência:', error);
            return false;
        }
    }

    /**
     * Debounce para funções que não devem ser chamadas muitas vezes
     * @param {Function} func - Função a ser executada
     * @param {number} wait - Tempo de espera em ms
     * @returns {Function} Função com debounce
     */
    static debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle para limitar a taxa de execução de uma função
     * @param {Function} func - Função a ser executada
     * @param {number} limit - Limite de tempo em ms
     * @returns {Function} Função com throttle
     */
    static throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }
}

// Exportar a classe para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else {
    window.Utils = Utils;
}
