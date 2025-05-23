/**
 * Arquivo: report.js
 * Implementa a geração de relatórios avançados
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
 * Classe responsável pela geração de relatórios
 */
class ReportGenerator {
    /**
     * Gera um relatório HTML avançado
     * @param {Object} resultado - Resultado da validação
     * @returns {string} HTML do relatório
     */
    static generateHtmlReport(resultado) {
        // Cabeçalho do relatório
        let html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Relatório de Validação Fiscal</title>
            <style>
                :root {
                    --primary-color: #1a73e8;
                    --secondary-color: #5f6368;
                    --success-color: #28a745;
                    --danger-color: #dc3545;
                    --warning-color: #f4b400;
                    --info-color: #0a97b0;
                    --background-color: #ffffff;
                    --surface-color: #f8f9fa;
                    --text-color: #202124;
                    --border-color: #dadce0;
                    --hover-color: #f1f3f4;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: var(--text-color);
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: var(--background-color);
                }
                
                .header {
                    background-color: var(--primary-color);
                    color: white;
                    padding: 20px;
                    border-radius: 5px 5px 0 0;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                
                .summary {
                    background-color: var(--surface-color);
                    padding: 20px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    border-left: 5px solid var(--primary-color);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                }
                
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .summary-item {
                    background-color: white;
                    padding: 15px;
                    border-radius: 5px;
                    text-align: center;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                
                .summary-item-title {
                    font-size: 14px;
                    color: var(--secondary-color);
                    margin-bottom: 5px;
                }
                
                .summary-item-value {
                    font-size: 24px;
                    font-weight: bold;
                }
                
                .warning {
                    background-color: #fff8e1;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    border-left: 5px solid var(--warning-color);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                }
                
                .success {
                    color: var(--success-color);
                    font-weight: bold;
                }
                
                .error {
                    color: var(--danger-color);
                    font-weight: bold;
                }
                
                .warning-text {
                    color: #856404;
                    font-weight: bold;
                }
                
                .table-container {
                    margin-bottom: 20px;
                    overflow-x: auto;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                
                th, td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid var(--border-color);
                }
                
                th {
                    background-color: var(--surface-color);
                    font-weight: 600;
                    color: var(--secondary-color);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                tr:hover {
                    background-color: var(--hover-color);
                }
                
                .severity-error {
                    border-left: 4px solid var(--danger-color);
                }
                
                .severity-warning {
                    border-left: 4px solid var(--warning-color);
                }
                
                .severity-info {
                    border-left: 4px solid var(--info-color);
                }
                
                .error-message {
                    color: var(--danger-color);
                }
                
                .error-code {
                    font-family: monospace;
                    background-color: #f1f3f4;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-size: 0.9em;
                }
                
                .timestamp {
                    font-size: 0.8em;
                    color: var(--secondary-color);
                    text-align: right;
                    margin-top: 20px;
                }
                
                .progress-bar {
                    height: 20px;
                    background-color: #e9ecef;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    overflow: hidden;
                }
                
                .progress-bar-fill {
                    height: 100%;
                    background-color: var(--success-color);
                    border-radius: 5px;
                }
                
                .progress-bar-error {
                    background-color: var(--danger-color);
                }
                
                .missing-columns {
                    background-color: #e2f3f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    border-left: 5px solid var(--info-color);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                }
                
                .missing-columns-list {
                    list-style-type: disc;
                    padding-left: 20px;
                }
                
                .missing-columns-list li {
                    padding: 3px 0;
                }
                
                .footer {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid var(--border-color);
                    text-align: center;
                    color: var(--secondary-color);
                    font-size: 0.9em;
                }
                
                @media print {
                    body {
                        padding: 0;
                        max-width: none;
                    }
                    
                    .header {
                        background-color: #f1f1f1 !important;
                        color: black !important;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    
                    .no-print {
                        display: none !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Relatório de Validação Fiscal</h1>
                <div class="timestamp">${Utils.formatDate(resultado.timestamp)}</div>
            </div>
        `;
        
        // Aviso sobre colunas faltantes
        if (resultado.colunas_faltantes && resultado.colunas_faltantes.length > 0) {
            html += `
            <div class="warning">
                <h2><i class="fas fa-exclamation-triangle"></i> <span class="warning-text">Atenção</span></h2>
                <p>${resultado.aviso_colunas}</p>
                
                <h3>Colunas preenchidas automaticamente:</h3>
                <ul class="missing-columns-list">
            `;
            
            resultado.colunas_faltantes.forEach(function(coluna) {
                html += `
                    <li>${coluna}</li>
                `;
            });
            
            html += `
                </ul>
                <p>Recomendamos ajustar sua planilha para incluir estas colunas para uma validação mais precisa.</p>
            </div>
            `;
        }
        
        // Resumo da validação
        const totalLinhas = resultado.total_linhas;
        const linhasValidas = resultado.linhas_validas;
        const linhasComErro = resultado.linhas_com_erro;
        
        const porcentagemValidas = totalLinhas > 0 ? Math.round((linhasValidas / totalLinhas) * 100) : 0;
        const porcentagemErros = totalLinhas > 0 ? Math.round((linhasComErro / totalLinhas) * 100) : 0;
        
        html += `
        <div class="summary">
            <h2>Resumo da Validação</h2>
            
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-item-title">Total de Linhas</div>
                    <div class="summary-item-value">${totalLinhas}</div>
                </div>
                
                <div class="summary-item">
                    <div class="summary-item-title">Linhas Válidas</div>
                    <div class="summary-item-value ${resultado.sucesso ? 'success' : ''}">${linhasValidas}</div>
                </div>
                
                <div class="summary-item">
                    <div class="summary-item-title">Linhas com Erro</div>
                    <div class="summary-item-value ${!resultado.sucesso ? 'error' : ''}">${linhasComErro}</div>
                </div>
                
                <div class="summary-item">
                    <div class="summary-item-title">Status</div>
                    <div class="summary-item-value ${resultado.sucesso ? 'success' : 'error'}">${resultado.sucesso ? 'APROVADO' : 'REPROVADO'}</div>
                </div>
            </div>
            
            <div class="progress-bar" style="margin-top: 20px;">
                <div class="progress-bar-fill ${!resultado.sucesso ? 'progress-bar-error' : ''}" style="width: ${porcentagemValidas}%"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9em;">
                <span>${porcentagemValidas}% válidas</span>
                <span>${porcentagemErros}% com erro</span>
            </div>
        </div>
        `;
        
        // Detalhes dos erros
        if (resultado.erros && resultado.erros.length > 0) {
            html += `
            <h2>Detalhes dos Erros</h2>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Linha</th>
                            <th>Documento</th>
                            <th>Nota Fiscal</th>
                            <th>Material</th>
                            <th>CFOP</th>
                            <th>CST ICMS</th>
                            <th>CST PIS</th>
                            <th>CST COFINS</th>
                            <th>Descrição do Erro</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            resultado.erros.forEach(function(erro) {
                // Para cada erro na linha, criar uma linha na tabela
                erro.erros.forEach(function(errorDetail, index) {
                    html += `
                        <tr class="severity-${errorDetail.severity || 'error'}">
                            <td>${index === 0 ? erro.linha : ''}</td>
                            <td>${index === 0 ? (erro.documento || 'N/A') : ''}</td>
                            <td>${index === 0 ? (erro.notaFiscal || 'N/A') : ''}</td>
                            <td>${index === 0 ? (erro.material || 'N/A') : ''}</td>
                            <td>${index === 0 ? (erro.cfop || 'N/A') : ''}</td>
                            <td>${index === 0 ? (erro.cstIcms || 'N/A') : ''}</td>
                            <td>${index === 0 ? (erro.cstPis || 'N/A') : ''}</td>
                            <td>${index === 0 ? (erro.cstCofins || 'N/A') : ''}</td>
                            <td class="error-message">
                                ${errorDetail.message}
                                ${errorDetail.code ? `<span class="error-code">${errorDetail.code}</span>` : ''}
                            </td>
                        </tr>
                    `;
                });
            });
            
            html += `
                    </tbody>
                </table>
            </div>
            `;
        } else if (!resultado.sucesso) {
            html += `
            <div class="warning">
                <h2>Detalhes dos Erros</h2>
                <p>Não foi possível obter detalhes específicos dos erros.</p>
            </div>
            `;
        }
        
        // Rodapé
        html += `
            <div class="footer">
                <p>Relatório gerado em ${Utils.formatDate(new Date())}</p>
                <p>Sistema de Validação Automática de Planilhas Fiscais</p>
            </div>
        </body>
        </html>
        `;
        
        return html;
    }
    
    /**
     * Gera um relatório em formato CSV
     * @param {Object} resultado - Resultado da validação
     * @returns {string} Conteúdo do CSV
     */
    static generateCsvReport(resultado) {
        if (!resultado.erros || resultado.erros.length === 0) {
            return 'Nenhum erro encontrado na validação.';
        }
        
        // Cabeçalho do CSV
        let csv = 'Linha,Documento,Nota Fiscal,Material,CFOP,CST ICMS,CST PIS,CST COFINS,Código do Erro,Descrição do Erro\n';
        
        // Dados
        resultado.erros.forEach(function(erro) {
            erro.erros.forEach(function(errorDetail) {
                // Escapar campos que possam conter vírgulas
                const documento = `"${(erro.documento || 'N/A').replace(/"/g, '""')}"`;
                const notaFiscal = `"${(erro.notaFiscal || 'N/A').replace(/"/g, '""')}"`;
                const material = `"${(erro.material || 'N/A').replace(/"/g, '""')}"`;
                const mensagem = `"${errorDetail.message.replace(/"/g, '""')}"`;
                
                csv += `${erro.linha},${documento},${notaFiscal},${material},${erro.cfop || 'N/A'},${erro.cstIcms || 'N/A'},${erro.cstPis || 'N/A'},${erro.cstCofins || 'N/A'},${errorDetail.code || 'N/A'},${mensagem}\n`;
            });
        });
        
        return csv;
    }
    
    /**
     * Gera um objeto para exportação em Excel
     * @param {Object} resultado - Resultado da validação
     * @returns {Object} Objeto para exportação em Excel
     */
    static generateExcelData(resultado) {
        // Cabeçalho da planilha
        const headers = ['Linha', 'Documento', 'Nota Fiscal', 'Material', 'CFOP', 'CST ICMS', 'CST PIS', 'CST COFINS', 'Código do Erro', 'Descrição do Erro'];
        
        // Dados
        const rows = [];
        
        if (resultado.erros && resultado.erros.length > 0) {
            resultado.erros.forEach(function(erro) {
                erro.erros.forEach(function(errorDetail) {
                    rows.push([
                        erro.linha,
                        erro.documento || 'N/A',
                        erro.notaFiscal || 'N/A',
                        erro.material || 'N/A',
                        erro.cfop || 'N/A',
                        erro.cstIcms || 'N/A',
                        erro.cstPis || 'N/A',
                        erro.cstCofins || 'N/A',
                        errorDetail.code || 'N/A',
                        errorDetail.message
                    ]);
                });
            });
        }
        
        return {
            headers,
            rows,
            sheetName: 'Relatório de Validação',
            title: 'Relatório de Validação Fiscal',
            created: new Date()
        };
    }
    
    /**
     * Exporta o relatório para o formato especificado
     * @param {Object} resultado - Resultado da validação
     * @param {string} format - Formato de exportação (html, csv, excel)
     * @returns {Blob|string} Conteúdo do relatório
     */
    static exportReport(resultado, format = 'html') {
        switch (format.toLowerCase()) {
            case 'html':
                const htmlContent = this.generateHtmlReport(resultado);
                return new Blob([htmlContent], { type: 'text/html' });
                
            case 'csv':
                const csvContent = this.generateCsvReport(resultado);
                return new Blob([csvContent], { type: 'text/csv' });
                
            case 'excel':
                // A implementação real usaria uma biblioteca como SheetJS
                // Aqui retornamos apenas os dados estruturados
                return this.generateExcelData(resultado);
                
            default:
                throw new Error(`Formato de exportação não suportado: ${format}`);
        }
    }
}

// Exportar a classe para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportGenerator;
} else {
    window.ReportGenerator = ReportGenerator;
}
