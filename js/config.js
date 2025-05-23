/**
 * Arquivo: config.js
 * Configurações globais do sistema de validação fiscal
 */

const CONFIG = {
    // Configurações de processamento
    processing: {
        chunkSize: 100, // Número de linhas processadas por lote
        useWebWorkers: true, // Utilizar Web Workers para processamento paralelo
        cacheResults: true, // Armazenar resultados intermediários em cache
        earlyTermination: true // Interromper validação ao encontrar primeiro erro em uma regra
    },
    
    // Configurações de interface
    ui: {
        theme: {
            light: {
                primary: '#1a73e8',
                secondary: '#5f6368',
                success: '#28a745',
                danger: '#dc3545',
                warning: '#f4b400',
                info: '#0a97b0',
                background: '#ffffff',
                surface: '#f8f9fa',
                text: '#202124'
            },
            dark: {
                primary: '#8ab4f8',
                secondary: '#9aa0a6',
                success: '#81c995',
                danger: '#f28b82',
                warning: '#fdd663',
                info: '#8bcfe6',
                background: '#202124',
                surface: '#303134',
                text: '#e8eaed'
            }
        },
        animation: {
            duration: 300, // Duração das animações em ms
            easing: 'ease-in-out' // Tipo de easing para animações
        },
        toast: {
            duration: 3000, // Duração das notificações toast em ms
            position: 'bottom-right' // Posição das notificações toast
        }
    },
    
    // Configurações de relatórios
    reports: {
        table: {
            pageSize: 20, // Número de linhas por página na tabela
            pageSizeOptions: [10, 20, 50, 100, 'Todos'], // Opções de tamanho de página
            defaultSortColumn: 'linha', // Coluna padrão para ordenação
            defaultSortDirection: 'asc' // Direção padrão para ordenação
        },
        export: {
            formats: ['html', 'pdf', 'excel', 'csv'], // Formatos de exportação disponíveis
            defaultFormat: 'html' // Formato padrão para exportação
        }
    },
    
    // Configurações de filtros
    filters: {
        saveHistory: true, // Salvar histórico de filtros
        maxHistoryItems: 10, // Número máximo de itens no histórico
        maxPresets: 20 // Número máximo de presets salvos
    },
    
    // Configurações de atalhos de teclado
    keyboardShortcuts: {
        applyFilter: 'Ctrl+F',
        clearFilter: 'Escape',
        exportReport: 'Ctrl+E',
        newValidation: 'Ctrl+N',
        toggleDarkMode: 'Ctrl+D'
    }
};

// Exportar configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
