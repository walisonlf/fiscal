/**
 * Arquivo: export.js
 * Implementa funcionalidades de exportação e compartilhamento
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
 * Classe que implementa funcionalidades de exportação e compartilhamento
 */
class ExportSystem {
    /**
     * Construtor do sistema de exportação
     */
    constructor() {
        // Inicializar
    }
    
    /**
     * Exporta dados para CSV
     * @param {Array} data - Dados a serem exportados
     * @param {Array} headers - Cabeçalhos das colunas
     * @param {string} filename - Nome do arquivo
     */
    exportToCsv(data, headers, filename = 'exportacao.csv') {
        if (!data || !data.length) {
            throw new Error('Nenhum dado para exportar');
        }
        
        // Criar conteúdo CSV
        let csvContent = '';
        
        // Adicionar cabeçalhos
        if (headers && headers.length) {
            csvContent += headers.map(header => this.escapeCsvValue(header)).join(',') + '\n';
        }
        
        // Adicionar linhas
        data.forEach(row => {
            const values = Object.values(row).map(value => this.escapeCsvValue(value));
            csvContent += values.join(',') + '\n';
        });
        
        // Criar blob e link de download
        this.downloadFile(csvContent, filename, 'text/csv');
    }
    
    /**
     * Escapa valores para CSV
     * @param {any} value - Valor a ser escapado
     * @returns {string} Valor escapado
     */
    escapeCsvValue(value) {
        if (value === null || value === undefined) {
            return '';
        }
        
        const stringValue = String(value);
        
        // Se o valor contém vírgula, aspas ou quebra de linha, envolver em aspas
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            // Substituir aspas por aspas duplas
            return '"' + stringValue.replace(/"/g, '""') + '"';
        }
        
        return stringValue;
    }
    
    /**
     * Exporta dados para Excel (XLSX)
     * @param {Array} data - Dados a serem exportados
     * @param {Array} headers - Cabeçalhos das colunas
     * @param {string} filename - Nome do arquivo
     * @param {string} sheetName - Nome da planilha
     */
    exportToExcel(data, headers, filename = 'exportacao.xlsx', sheetName = 'Dados') {
        if (!data || !data.length) {
            throw new Error('Nenhum dado para exportar');
        }
        
        // Verificar se a biblioteca XLSX está disponível
        if (typeof XLSX === 'undefined') {
            throw new Error('Biblioteca XLSX não encontrada. Inclua a biblioteca SheetJS para exportar para Excel.');
        }
        
        // Preparar dados para o formato XLSX
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        
        // Criar workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        // Gerar arquivo
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        // Criar blob e link de download
        this.downloadFile(excelBuffer, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', true);
    }
    
    /**
     * Exporta dados para PDF
     * @param {string} htmlContent - Conteúdo HTML a ser convertido em PDF
     * @param {string} filename - Nome do arquivo
     * @param {Object} options - Opções de configuração do PDF
     */
    exportToPdf(htmlContent, filename = 'exportacao.pdf', options = {}) {
        // Verificar se a biblioteca jsPDF está disponível
        if (typeof jsPDF === 'undefined' || typeof html2canvas === 'undefined') {
            throw new Error('Bibliotecas jsPDF e html2canvas não encontradas. Inclua as bibliotecas para exportar para PDF.');
        }
        
        // Criar elemento temporário
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlContent;
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        document.body.appendChild(tempElement);
        
        // Configurações padrão
        const defaultOptions = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Mesclar opções
        const pdfOptions = { ...defaultOptions, ...options };
        
        // Gerar PDF
        html2pdf().from(tempElement).set(pdfOptions).save().then(() => {
            // Remover elemento temporário
            document.body.removeChild(tempElement);
        });
    }
    
    /**
     * Exporta dados para JSON
     * @param {Object|Array} data - Dados a serem exportados
     * @param {string} filename - Nome do arquivo
     * @param {boolean} pretty - Se deve formatar o JSON
     */
    exportToJson(data, filename = 'exportacao.json', pretty = true) {
        if (!data) {
            throw new Error('Nenhum dado para exportar');
        }
        
        // Converter para JSON
        const jsonContent = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        
        // Criar blob e link de download
        this.downloadFile(jsonContent, filename, 'application/json');
    }
    
    /**
     * Compartilha dados via e-mail
     * @param {string} subject - Assunto do e-mail
     * @param {string} body - Corpo do e-mail
     * @param {string} to - Destinatário (opcional)
     */
    shareViaEmail(subject, body, to = '') {
        // Criar URL mailto
        const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Abrir cliente de e-mail
        window.open(mailtoUrl);
    }
    
    /**
     * Compartilha dados via WhatsApp
     * @param {string} text - Texto a ser compartilhado
     */
    shareViaWhatsApp(text) {
        // Criar URL do WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        
        // Abrir WhatsApp
        window.open(whatsappUrl);
    }
    
    /**
     * Cria um link de compartilhamento
     * @param {Object} data - Dados a serem compartilhados
     * @returns {string} URL de compartilhamento
     */
    createShareableLink(data) {
        // Converter dados para JSON
        const jsonData = JSON.stringify(data);
        
        // Codificar em base64
        const base64Data = btoa(jsonData);
        
        // Criar URL com parâmetro de consulta
        const url = new URL(window.location.href);
        url.searchParams.set('shared', base64Data);
        
        return url.toString();
    }
    
    /**
     * Carrega dados de um link compartilhado
     * @returns {Object|null} Dados carregados ou null se não houver dados compartilhados
     */
    loadFromShareableLink() {
        // Obter URL atual
        const url = new URL(window.location.href);
        
        // Verificar se há parâmetro de compartilhamento
        const sharedData = url.searchParams.get('shared');
        
        if (!sharedData) {
            return null;
        }
        
        try {
            // Decodificar base64
            const jsonData = atob(sharedData);
            
            // Converter JSON para objeto
            return JSON.parse(jsonData);
        } catch (error) {
            console.error('Erro ao carregar dados compartilhados:', error);
            return null;
        }
    }
    
    /**
     * Cria um QR Code para compartilhamento
     * @param {string} url - URL a ser codificada no QR Code
     * @param {HTMLElement} container - Elemento onde o QR Code será exibido
     */
    createQrCode(url, container) {
        // Verificar se a biblioteca QRCode está disponível
        if (typeof QRCode === 'undefined') {
            throw new Error('Biblioteca QRCode não encontrada. Inclua a biblioteca para gerar QR Codes.');
        }
        
        // Limpar container
        container.innerHTML = '';
        
        // Criar QR Code
        new QRCode(container, {
            text: url,
            width: 128,
            height: 128,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    /**
     * Faz download de um arquivo
     * @param {string|ArrayBuffer} content - Conteúdo do arquivo
     * @param {string} filename - Nome do arquivo
     * @param {string} mimeType - Tipo MIME do arquivo
     * @param {boolean} isBinary - Se o conteúdo é binário
     */
    downloadFile(content, filename, mimeType, isBinary = false) {
        // Criar blob
        const blob = isBinary
            ? new Blob([content], { type: mimeType })
            : new Blob([content], { type: mimeType + ';charset=utf-8' });
        
        // Criar URL do blob
        const url = URL.createObjectURL(blob);
        
        // Criar link de download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Adicionar ao body
        document.body.appendChild(link);
        
        // Simular clique
        link.click();
        
        // Remover link
        document.body.removeChild(link);
        
        // Liberar URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
}

// Exportar a classe para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportSystem;
} else {
    window.ExportSystem = ExportSystem;
}
