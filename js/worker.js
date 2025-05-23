/**
 * Arquivo: worker.js
 * Implementa o Web Worker para processamento paralelo de validação
 */

// Importar dependências
importScripts('utils.js', 'config.js', 'rules.js', 'validator.js');

// Instanciar o validador
const validator = new SpreadsheetValidator();

// Ouvir mensagens do thread principal
self.addEventListener('message', function(e) {
    const { action, data } = e.data;
    
    switch (action) {
        case 'validateChunk':
            // Processar um lote de linhas
            const { chunk, columnMap, missingColumns, startIndex } = data;
            const results = validator.processChunk(chunk, columnMap, missingColumns, startIndex);
            self.postMessage({ action: 'chunkProcessed', results });
            break;
            
        case 'clearCache':
            // Limpar o cache
            validator.clearCache();
            self.postMessage({ action: 'cacheCleared' });
            break;
            
        default:
            self.postMessage({ action: 'error', message: `Ação desconhecida: ${action}` });
    }
});

// Notificar que o worker está pronto
self.postMessage({ action: 'ready' });
