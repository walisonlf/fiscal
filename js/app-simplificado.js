/**
 * app-simplificado.js
 * Versão simplificada e funcional do sistema de validação fiscal
 */

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicação...');
    
    // Elementos da interface
    const fileInput = document.getElementById('file-input');
    const validateBtn = document.getElementById('validate-btn');
    const uploadSection = document.getElementById('upload-section');
    const progressSection = document.getElementById('progress-section');
    const resultsSection = document.getElementById('results-section');
    const progressBar = document.getElementById('progress-bar');
    const progressStatus = document.getElementById('progress-status');
    const tableContainer = document.getElementById('table-container');
    const summaryContainer = document.getElementById('summary-container');
    const errorReportContainer = document.getElementById('error-report-container');
    const filtersBtn = document.getElementById('filters-btn');
    const rulesEditorBtn = document.getElementById('rules-editor-btn');
    const exportBtn = document.getElementById('export-btn');
    const filterContainer = document.getElementById('filter-container');
    const activeFiltersTags = document.getElementById('active-filters-tags');
    
    // Estado da aplicação
    let appState = {
        file: null,
        fileName: '',
        data: [],
        columns: [],
        filteredData: [],
        validationResults: [],
        currentPage: 1,
        itemsPerPage: 50,
        filters: {},
        activeFilters: {}
    };
    
    // Inicializar tooltips do Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Evento de mudança no input de arquivo
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            appState.file = this.files[0];
            appState.fileName = this.files[0].name;
            
            // Atualizar interface
            const fileUploadText = document.querySelector('.file-upload-text');
            if (fileUploadText) {
                fileUploadText.textContent = appState.fileName;
            }

            // Adicionar classe de feedback visual ao file-upload
            const fileUploadDiv = document.querySelector('.file-upload');
            if (fileUploadDiv) {
                fileUploadDiv.classList.add('file-selected-state');
            }
            
            // Habilitar botão de validação
            validateBtn.removeAttribute('disabled');
            
            // Mostrar toast de sucesso
            showToast('Arquivo selecionado com sucesso!', 'success');
        }
    });
    
    // Evento de clique no botão de validação
    validateBtn.addEventListener('click', function() {
        if (!appState.file) {
            showToast('Por favor, selecione um arquivo primeiro.', 'error');
            return;
        }
        
        // Iniciar processo de validação
        startValidation();
    });
    
    // Evento de clique no botão de filtros
    filtersBtn.addEventListener('click', function() {
        if (appState.data.length === 0) {
            showToast('Valide uma planilha primeiro para usar os filtros.', 'warning');
            return;
        }
        
        // Mostrar/ocultar seção de filtros
        const filtersContainer = document.getElementById('filters-container');
        if (filtersContainer) {
            filtersContainer.classList.toggle('d-none');
            
            // Se estiver mostrando, gerar os filtros
            if (!filtersContainer.classList.contains('d-none')) {
                generateFilters();
            }
        }
    });
    
    // Evento de clique no botão do editor de regras
    rulesEditorBtn.addEventListener('click', function() {
        // Abrir modal do editor de regras
        const rulesEditorModal = document.getElementById('rules-editor-modal');
        if (rulesEditorModal) {
            const modal = new bootstrap.Modal(rulesEditorModal);
            modal.show();
            
            // Carregar regras no editor
            loadRulesEditor();
        } else {
            console.error('Modal do editor de regras não encontrado');
            showToast('Erro ao abrir o editor de regras. Tente novamente.', 'error');
        }
    });
    
    // Evento de clique no botão de exportação
    exportBtn.addEventListener('click', function() {
        if (appState.data.length === 0) {
            showToast('Valide uma planilha primeiro para exportar os dados.', 'warning');
            return;
        }
        
        // Abrir modal de exportação
        const exportModal = new bootstrap.Modal(document.getElementById('export-modal'));
        exportModal.show();
    });
    
    // Evento de clique no botão de confirmação de exportação
    document.getElementById('confirm-export-btn').addEventListener('click', function() {
        exportData();
    });
    
    // Função para iniciar o processo de validação
    function startValidation() {
        // Remover classe de feedback visual do file-upload
        const fileUploadDiv = document.querySelector('.file-upload');
        if (fileUploadDiv) {
            fileUploadDiv.classList.remove('file-selected-state');
        }

        // Mostrar seção de progresso e ocultar outras
        uploadSection.classList.add('d-none');
        progressSection.classList.remove('d-none');
        resultsSection.classList.add('d-none');
        
        // Resetar progresso
        progressBar.style.width = '0%';
        progressBar.setAttribute('aria-valuenow', 0);
        progressStatus.textContent = 'Iniciando processamento...';
        
        // Simular progresso (em uma aplicação real, isso seria baseado no processamento real)
        simulateProgress(function() {
            // Processar o arquivo
            processFile();
        });
    }
    
    // Função para simular progresso
    function simulateProgress(callback) {
        let progress = 0;
        const interval = setInterval(function() {
            progress += 5;
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
            
            if (progress < 30) {
                progressStatus.textContent = 'Lendo arquivo...';
            } else if (progress < 60) {
                progressStatus.textContent = 'Processando dados...';
            } else if (progress < 90) {
                progressStatus.textContent = 'Aplicando regras de validação...';
            } else {
                progressStatus.textContent = 'Finalizando...';
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 100);
    }
    
    // Função para processar o arquivo
    function processFile() {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                // Processar o arquivo com base na extensão
                const extension = appState.fileName.split('.').pop().toLowerCase();
                
                if (extension === 'csv') {
                    processCSV(e.target.result);
                } else if (extension === 'xlsx' || extension === 'xls') {
                    processExcel(e.target.result);
                } else {
                    throw new Error('Formato de arquivo não suportado.');
                }
                
                // Validar os dados
                validateData();
                
                // Mostrar resultados
                showResults();
                
                // Mostrar toast de sucesso
                showToast('Validação concluída com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao processar arquivo:', error);
                showToast('Erro ao processar arquivo: ' + error.message, 'error');
                
                // Voltar para a tela de upload
                uploadSection.classList.remove('d-none');
                progressSection.classList.add('d-none');
            }
        };
        
        reader.onerror = function() {
            showToast('Erro ao ler o arquivo.', 'error');
            uploadSection.classList.remove('d-none');
            progressSection.classList.add('d-none');
        };
        
        // Ler o arquivo como array buffer (para Excel) ou texto (para CSV)
        const extension = appState.fileName.split('.').pop().toLowerCase();
        if (extension === 'csv') {
            reader.readAsText(appState.file);
        } else {
            reader.readAsArrayBuffer(appState.file);
        }
    }
    
    // Função para processar arquivo CSV
    function processCSV(content) {
        // Dividir o conteúdo em linhas
        const lines = content.split(/\r\n|\n/);
        
        // Extrair cabeçalhos (primeira linha)
        const headers = lines[0].split(',').map(header => header.trim());
        appState.columns = headers;
        
        // Processar linhas de dados
        appState.data = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',').map(value => value.trim());
            const row = {};
            
            // Mapear valores para colunas
            for (let j = 0; j < headers.length; j++) {
                row[headers[j]] = values[j] || '';
            }
            
            appState.data.push(row);
        }
        
        // Atualizar dados filtrados
        appState.filteredData = [...appState.data];
    }
    
    // Função para processar arquivo Excel
    function processExcel(content) {
        // Converter ArrayBuffer para Uint8Array
        const data = new Uint8Array(content);
        
        // Ler o workbook
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Obter a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Extrair cabeçalhos (primeira linha)
        const headers = jsonData[0];
        appState.columns = headers;
        
        // Processar linhas de dados
        appState.data = [];
        for (let i = 1; i < jsonData.length; i++) {
            const values = jsonData[i];
            const row = {};
            
            // Mapear valores para colunas
            for (let j = 0; j < headers.length; j++) {
                row[headers[j]] = values[j] !== undefined ? values[j] : '';
            }
            
            appState.data.push(row);
        }
        
        // Atualizar dados filtrados
        appState.filteredData = [...appState.data];
    }
    
    // Função para validar os dados
    function validateData() {
        appState.validationResults = [];
        
        // Verificar se o objeto FiscalRules está disponível
        if (window.FiscalRules) {
            // Validar cada registro usando as regras fiscais
            appState.data.forEach((record, index) => {
                const result = window.FiscalRules.validateRecord(record);
                
                // Adicionar índice do registro ao resultado
                result.index = index;
                result.record = record;
                
                appState.validationResults.push(result);
            });
        } else {
            // Validação simplificada se as regras fiscais não estiverem disponíveis
            appState.data.forEach((record, index) => {
                const errors = [];
                const warnings = [];
                
                // Verificar campos obrigatórios
                if (!record.CFOP) {
                    errors.push({
                        field: 'CFOP',
                        message: 'CFOP é obrigatório',
                        code: 'REQUIRED_FIELD'
                    });
                }
                
                if (!record['CST ICMS']) {
                    errors.push({
                        field: 'CST ICMS',
                        message: 'CST ICMS é obrigatório',
                        code: 'REQUIRED_FIELD'
                    });
                }
                
                // Adicionar resultado
                appState.validationResults.push({
                    valid: errors.length === 0,
                    errors,
                    warnings,
                    index,
                    record
                });
            });
        }
    }
    
    // Função para mostrar os resultados
    function showResults() {
        // Ocultar seção de progresso e mostrar resultados
        progressSection.classList.add('d-none');
        resultsSection.classList.remove('d-none');
        
        // Gerar resumo
        generateSummary();
        
        // Gerar tabela de resultados
        generateResultsTable();
        
        // Gerar relatório de erros
        generateErrorReport();
    }
    
    // Função para gerar o resumo
    function generateSummary() {
        // Contar registros válidos e inválidos
        const totalRecords = appState.validationResults.length;
        const validRecords = appState.validationResults.filter(result => result.valid).length;
        const invalidRecords = totalRecords - validRecords;
        
        // Contar erros e avisos
        let totalErrors = 0;
        let totalWarnings = 0;
        
        appState.validationResults.forEach(result => {
            totalErrors += result.errors.length;
            totalWarnings += result.warnings.length;
        });
        
        // Gerar HTML do resumo
        const summaryHTML = `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h3 class="card-title mb-0">Resumo da Validação</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="summary-item">
                                <div class="summary-value">${totalRecords}</div>
                                <div class="summary-label">Total de Registros</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="summary-item text-success">
                                <div class="summary-value">${validRecords}</div>
                                <div class="summary-label">Registros Válidos</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="summary-item text-danger">
                                <div class="summary-value">${invalidRecords}</div>
                                <div class="summary-label">Registros Inválidos</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="summary-item text-warning">
                                <div class="summary-value">${totalErrors}</div>
                                <div class="summary-label">Total de Erros</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Atualizar o container de resumo
        summaryContainer.innerHTML = summaryHTML;
    }
    
    // Função para formatar data
    function formatDate(dateValue) {
        if (!dateValue) return '';
        
        // Verificar se é um objeto Date
        if (dateValue instanceof Date) {
            return dateValue.toLocaleDateString('pt-BR');
        }
        
        // Verificar se é um número (Excel armazena datas como números)
        if (typeof dateValue === 'number') {
            // Converter número do Excel para data JavaScript
            const excelEpoch = new Date(1899, 11, 30);
            const date = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
            return date.toLocaleDateString('pt-BR');
        }
        
        // Verificar se é uma string de data
        if (typeof dateValue === 'string') {
            // Tentar converter string para data
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('pt-BR');
            }
        }
        
        // Retornar valor original se não for possível formatar
        return dateValue;
    }
    
    // Função para gerar a tabela de resultados
    function generateResultsTable() {
        // Calcular índices para paginação
        const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
        const endIndex = Math.min(startIndex + appState.itemsPerPage, appState.filteredData.length);
        
        // Obter dados da página atual
        const pageData = appState.filteredData.slice(startIndex, endIndex);
        
        // Gerar cabeçalho da tabela
        let tableHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
        `;
        
        // Adicionar colunas
        appState.columns.forEach(column => {
            tableHTML += `<th>${column}</th>`;
        });
        
        // Adicionar coluna de status
        tableHTML += `<th>Status</th></tr></thead><tbody>`;
        
        // Gerar linhas da tabela
        pageData.forEach(row => {
            // Encontrar resultado de validação para esta linha
            const validationResult = appState.validationResults.find(result => result.record === row);
            const isValid = validationResult ? validationResult.valid : true;
            
            // Definir classe CSS com base na validade
            const rowClass = isValid ? '' : 'table-danger';
            
            // Iniciar linha
            tableHTML += `<tr class="${rowClass}">`;
            
            // Adicionar células
            appState.columns.forEach((column, columnIndex) => {
                let cellValue = row[column] || '';
                
                // Formatar colunas de data (D e E)
                if ((columnIndex === 3 && column === 'Data documento') || 
                    (columnIndex === 4 && column === 'Data de lançamento')) {
                    cellValue = formatDate(cellValue);
                }
                
                tableHTML += `<td>${cellValue}</td>`;
            });
            
            // Adicionar célula de status
            const statusIcon = isValid 
                ? '<i class="fas fa-check-circle text-success"></i>' 
                : '<i class="fas fa-exclamation-circle text-danger"></i>';
            
            tableHTML += `<td>${statusIcon}</td>`;
            
            // Finalizar linha
            tableHTML += `</tr>`;
        });
        
        // Finalizar tabela
        tableHTML += `</tbody></table></div>`;
        
        // Adicionar controles de paginação
        tableHTML += generatePagination();
        
        // Atualizar o container da tabela
        tableContainer.innerHTML = tableHTML;
        
        // Adicionar eventos aos controles de paginação
        setupPaginationEvents();
    }
    
    // Função para gerar controles de paginação
    function generatePagination() {
        const totalPages = Math.ceil(appState.filteredData.length / appState.itemsPerPage);
        
        let paginationHTML = `
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="pagination-info">
                    Mostrando ${Math.min(appState.filteredData.length, 1 + (appState.currentPage - 1) * appState.itemsPerPage)} a 
                    ${Math.min(appState.filteredData.length, appState.currentPage * appState.itemsPerPage)} 
                    de ${appState.filteredData.length} registros
                </div>
                <div class="d-flex align-items-center">
                    <div class="me-3">
                        <label for="items-per-page" class="form-label me-2">Itens por página:</label>
                        <select id="items-per-page" class="form-select form-select-sm">
                            <option value="10" ${appState.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                            <option value="25" ${appState.itemsPerPage === 25 ? 'selected' : ''}>25</option>
                            <option value="50" ${appState.itemsPerPage === 50 ? 'selected' : ''}>50</option>
                            <option value="100" ${appState.itemsPerPage === 100 ? 'selected' : ''}>100</option>
                        </select>
                    </div>
                    <nav aria-label="Navegação de página">
                        <ul class="pagination mb-0">
        `;
        
        // Botão "Anterior"
        paginationHTML += `
            <li class="page-item ${appState.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${appState.currentPage - 1}" aria-label="Anterior">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;
        
        // Páginas
        const maxVisiblePages = 5;
        let startPage = Math.max(1, appState.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Ajustar startPage se necessário
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Primeira página
        if (startPage > 1) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
            `;
            
            if (startPage > 2) {
                paginationHTML += `
                    <li class="page-item disabled">
                        <a class="page-link" href="#">...</a>
                    </li>
                `;
            }
        }
        
        // Páginas visíveis
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === appState.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Última página
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `
                    <li class="page-item disabled">
                        <a class="page-link" href="#">...</a>
                    </li>
                `;
            }
            
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }
        
        // Botão "Próximo"
        paginationHTML += `
            <li class="page-item ${appState.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${appState.currentPage + 1}" aria-label="Próximo">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;
        
        // Finalizar paginação
        paginationHTML += `</ul></nav></div></div>`;
        
        return paginationHTML;
    }
    
    // Função para configurar eventos de paginação
    function setupPaginationEvents() {
        // Evento de clique nos links de página
        document.querySelectorAll('.page-link[data-page]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const page = parseInt(this.getAttribute('data-page'));
                if (page >= 1) {
                    appState.currentPage = page;
                    generateResultsTable();
                }
            });
        });
        
        // Evento de mudança no select de itens por página
        const itemsPerPageSelect = document.getElementById('items-per-page');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', function() {
                appState.itemsPerPage = parseInt(this.value);
                appState.currentPage = 1; // Voltar para a primeira página
                generateResultsTable();
            });
        }
    }
    
    // Função para gerar o relatório de erros
    function generateErrorReport() {
        // Filtrar resultados com erros
        const resultsWithErrors = appState.validationResults.filter(result => !result.valid);
        
        // Se não houver erros, mostrar mensagem
        if (resultsWithErrors.length === 0) {
            errorReportContainer.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    Nenhum erro encontrado na validação!
                </div>
            `;
            return;
        }
        
        // Gerar HTML do relatório
        let reportHTML = `
            <div class="card">
                <div class="card-header bg-danger text-white">
                    <h3 class="card-title mb-0">Relatório de Erros</h3>
                </div>
                <div class="card-body">
                    <div class="accordion" id="errorsAccordion">
        `;
        
        // Adicionar cada resultado com erros
        resultsWithErrors.forEach((result, index) => {
            const recordIndex = result.index + 1; // +1 para exibição amigável (começando em 1)
            
            reportHTML += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index}">
                            Registro #${recordIndex} - ${result.errors.length} erro(s)
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${index}" data-bs-parent="#errorsAccordion">
                        <div class="accordion-body">
                            <div class="mb-3">
                                <h5>Dados do Registro:</h5>
                                <div class="table-responsive">
                                    <table class="table table-sm table-bordered">
                                        <thead>
                                            <tr>
            `;
            
            // Adicionar cabeçalhos relevantes
            const relevantColumns = ['CFOP', 'CST ICMS', 'CST PIS', 'CST COFINS', 'Base ICMS', 'Valor ICMS'];
            relevantColumns.forEach(column => {
                reportHTML += `<th>${column}</th>`;
            });
            
            reportHTML += `</tr></thead><tbody><tr>`;
            
            // Adicionar valores
            relevantColumns.forEach(column => {
                reportHTML += `<td>${result.record[column] || ''}</td>`;
            });
            
            reportHTML += `
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <h5>Erros:</h5>
                            <ul class="list-group">
            `;
            
            // Adicionar cada erro
            result.errors.forEach(error => {
                reportHTML += `
                    <li class="list-group-item list-group-item-danger">
                        <strong>${error.field}:</strong> ${error.message}
                    </li>
                `;
            });
            
            reportHTML += `
                            </ul>
                            
                            ${result.warnings.length > 0 ? `
                                <h5 class="mt-3">Avisos:</h5>
                                <ul class="list-group">
                                    ${result.warnings.map(warning => `
                                        <li class="list-group-item list-group-item-warning">
                                            <strong>${warning.field}:</strong> ${warning.message}
                                        </li>
                                    `).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Finalizar relatório
        reportHTML += `</div></div></div>`;
        
        // Atualizar o container do relatório
        errorReportContainer.innerHTML = reportHTML;
    }
    
    // Função para gerar os filtros
    function generateFilters() {
        // Limpar container de filtros
        filterContainer.innerHTML = '';
        
        // Selecionar colunas relevantes para filtros
        const filterColumns = [
            'CFOP', 'CST ICMS', 'CST PIS', 'CST COFINS', 
            'Chave de acesso NFe', 'Data documento', 'Data de lançamento'
        ];
        
        // Criar filtros para cada coluna
        filterColumns.forEach(column => {
            // Obter valores únicos para esta coluna
            const uniqueValues = [...new Set(appState.data.map(row => row[column]))].filter(Boolean);
            
            // Criar elemento de filtro
            const filterElement = document.createElement('div');
            filterElement.className = 'col-md-4 mb-3';
            filterElement.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">${column}</h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-2">
                            <input type="text" class="form-control filter-search" data-column="${column}" placeholder="Buscar...">
                        </div>
                        <div class="filter-values" style="max-height: 200px; overflow-y: auto;">
                            ${uniqueValues.map(value => `
                                <div class="form-check">
                                    <input class="form-check-input filter-checkbox" type="checkbox" value="${value}" id="filter-${column}-${value}" data-column="${column}">
                                    <label class="form-check-label" for="filter-${column}-${value}">
                                        ${value}
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            // Adicionar ao container
            filterContainer.appendChild(filterElement);
        });
        
        // Adicionar eventos aos filtros
        setupFilterEvents();
    }
    
    // Função para configurar eventos de filtros
    function setupFilterEvents() {
        // Evento de busca nos filtros
        document.querySelectorAll('.filter-search').forEach(input => {
            input.addEventListener('input', function() {
                const column = this.getAttribute('data-column');
                const searchValue = this.value.toLowerCase();
                
                // Filtrar checkboxes
                const checkboxes = document.querySelectorAll(`.filter-checkbox[data-column="${column}"]`);
                checkboxes.forEach(checkbox => {
                    const label = checkbox.nextElementSibling;
                    const value = label.textContent.trim().toLowerCase();
                    
                    if (value.includes(searchValue)) {
                        checkbox.parentElement.style.display = '';
                    } else {
                        checkbox.parentElement.style.display = 'none';
                    }
                });
            });
        });
        
        // Evento de clique nos checkboxes de filtro
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const column = this.getAttribute('data-column');
                const value = this.value;
                
                // Atualizar filtros ativos
                if (!appState.activeFilters[column]) {
                    appState.activeFilters[column] = [];
                }
                
                if (this.checked) {
                    // Adicionar valor ao filtro
                    appState.activeFilters[column].push(value);
                } else {
                    // Remover valor do filtro
                    const index = appState.activeFilters[column].indexOf(value);
                    if (index !== -1) {
                        appState.activeFilters[column].splice(index, 1);
                    }
                    
                    // Remover coluna se não houver valores
                    if (appState.activeFilters[column].length === 0) {
                        delete appState.activeFilters[column];
                    }
                }
                
                // Aplicar filtros
                applyFilters();
                
                // Atualizar tags de filtros ativos
                updateActiveFiltersTags();
            });
        });
        
        // Evento de clique no botão de limpar filtros
        document.getElementById('clear-filter-btn').addEventListener('click', function() {
            // Limpar filtros ativos
            appState.activeFilters = {};
            
            // Desmarcar todos os checkboxes
            document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Aplicar filtros (reset)
            applyFilters();
            
            // Atualizar tags de filtros ativos
            updateActiveFiltersTags();
        });
    }
    
    // Função para aplicar filtros
    function applyFilters() {
        // Se não houver filtros ativos, mostrar todos os dados
        if (Object.keys(appState.activeFilters).length === 0) {
            appState.filteredData = [...appState.data];
        } else {
            // Filtrar dados
            appState.filteredData = appState.data.filter(row => {
                // Verificar cada coluna de filtro
                for (const column in appState.activeFilters) {
                    const filterValues = appState.activeFilters[column];
                    
                    // Se não houver valores para esta coluna, pular
                    if (filterValues.length === 0) continue;
                    
                    // Verificar se o valor da coluna está nos valores do filtro
                    if (!filterValues.includes(row[column])) {
                        return false;
                    }
                }
                
                // Se passou por todos os filtros, incluir
                return true;
            });
        }
        
        // Voltar para a primeira página
        appState.currentPage = 1;
        
        // Atualizar tabela
        generateResultsTable();
    }
    
    // Função para atualizar tags de filtros ativos
    function updateActiveFiltersTags() {
        // Limpar container
        activeFiltersTags.innerHTML = '';
        
        // Se não houver filtros ativos, mostrar mensagem
        if (Object.keys(appState.activeFilters).length === 0) {
            activeFiltersTags.innerHTML = '<div class="text-muted">Nenhum filtro ativo.</div>';
            return;
        }
        
        // Adicionar tag para cada filtro ativo
        for (const column in appState.activeFilters) {
            const filterValues = appState.activeFilters[column];
            
            filterValues.forEach(value => {
                const tag = document.createElement('span');
                tag.className = 'badge bg-primary me-2 mb-2';
                tag.innerHTML = `
                    ${column}: ${value}
                    <button type="button" class="btn-close btn-close-white ms-2" aria-label="Remover" data-column="${column}" data-value="${value}"></button>
                `;
                
                // Adicionar ao container
                activeFiltersTags.appendChild(tag);
            });
        }
        
        // Adicionar eventos aos botões de remover
        document.querySelectorAll('.btn-close[data-column]').forEach(button => {
            button.addEventListener('click', function() {
                const column = this.getAttribute('data-column');
                const value = this.getAttribute('data-value');
                
                // Remover valor do filtro
                const index = appState.activeFilters[column].indexOf(value);
                if (index !== -1) {
                    appState.activeFilters[column].splice(index, 1);
                }
                
                // Remover coluna se não houver valores
                if (appState.activeFilters[column].length === 0) {
                    delete appState.activeFilters[column];
                }
                
                // Desmarcar checkbox correspondente
                const checkbox = document.querySelector(`.filter-checkbox[data-column="${column}"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                }
                
                // Aplicar filtros
                applyFilters();
                
                // Atualizar tags de filtros ativos
                updateActiveFiltersTags();
            });
        });
    }
    
    // Função para carregar o editor de regras
    function loadRulesEditor() {
        console.log('Carregando editor de regras...');
        
        // Verificar se o objeto FiscalRules está disponível
        if (!window.FiscalRules) {
            console.error('Módulo de regras fiscais não disponível');
            showToast('Módulo de regras fiscais não disponível.', 'error');
            return;
        }
        
        try {
            // Obter todas as regras
            const rules = window.FiscalRules.getAllRules();
            console.log('Regras carregadas:', rules);
            
            // Preencher select de conjuntos de regras
            const ruleSetList = document.getElementById('rule-set-list');
            if (!ruleSetList) {
                console.error('Elemento rule-set-list não encontrado');
                return;
            }
            
            ruleSetList.innerHTML = '<option value="">Selecione um conjunto de regras</option>';
            
            // Adicionar opções para cada tipo de regra
            const ruleTypes = {
                'cfop': 'Regras por CFOP',
                'cst_icms': 'Regras por CST ICMS',
                'cst_pis_cofins': 'Regras por CST PIS/COFINS'
            };
            
            for (const type in ruleTypes) {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = ruleTypes[type];
                ruleSetList.appendChild(option);
            }
            
            // Evento de mudança no select de conjuntos de regras
            ruleSetList.addEventListener('change', function() {
                const type = this.value;
                
                if (!type) {
                    document.getElementById('rules-editor-content').innerHTML = '<div class="text-muted">Selecione um conjunto de regras para editar.</div>';
                    return;
                }
                
                // Carregar regras do tipo selecionado
                loadRulesByType(type, rules[type]);
            });
            
            // Evento de clique no botão de adicionar regra
            const addRuleBtn = document.getElementById('add-rule-btn');
            if (addRuleBtn) {
                addRuleBtn.addEventListener('click', function() {
                    const type = ruleSetList.value;
                    
                    if (!type) {
                        showToast('Selecione um conjunto de regras primeiro.', 'warning');
                        return;
                    }
                    
                    // Abrir modal para adicionar regra
                    showAddRuleModal(type);
                });
            }
            
            // Evento de clique no botão de exportar regras
            const exportRulesBtn = document.getElementById('export-rules-btn');
            if (exportRulesBtn) {
                exportRulesBtn.addEventListener('click', function() {
                    const rulesJson = window.FiscalRules.exportRules();
                    
                    // Criar blob e link para download
                    const blob = new Blob([rulesJson], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'regras_fiscais.json';
                    a.click();
                    
                    // Liberar URL
                    URL.revokeObjectURL(url);
                    
                    showToast('Regras exportadas com sucesso!', 'success');
                });
            }
            
            // Evento de clique no botão de importar regras
            const importRulesBtn = document.getElementById('import-rules-btn');
            const importRulesInput = document.getElementById('import-rules-input');
            
            if (importRulesBtn && importRulesInput) {
                importRulesBtn.addEventListener('click', function() {
                    importRulesInput.click();
                });
                
                importRulesInput.addEventListener('change', function() {
                    if (this.files && this.files[0]) {
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            const rulesJson = e.target.result;
                            
                            // Importar regras
                            const success = window.FiscalRules.importRules(rulesJson);
                            
                            if (success) {
                                showToast('Regras importadas com sucesso!', 'success');
                                
                                // Recarregar editor
                                loadRulesEditor();
                            } else {
                                showToast('Erro ao importar regras. Verifique o formato do arquivo.', 'error');
                            }
                        };
                        
                        reader.readAsText(this.files[0]);
                    }
                });
            }
            
            // Evento de clique no botão de salvar regras
            const saveRulesBtn = document.getElementById('save-rules-btn');
            if (saveRulesBtn) {
                saveRulesBtn.addEventListener('click', function() {
                    showToast('Regras salvas com sucesso!', 'success');
                    
                    // Fechar modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('rules-editor-modal'));
                    if (modal) {
                        modal.hide();
                    }
                });
            }
            
            // Inicialmente, mostrar mensagem para selecionar um conjunto de regras
            const editorContent = document.getElementById('rules-editor-content');
            if (editorContent) {
                editorContent.innerHTML = '<div class="text-muted">Selecione um conjunto de regras para editar.</div>';
            }
            
        } catch (error) {
            console.error('Erro ao carregar editor de regras:', error);
            showToast('Erro ao carregar editor de regras: ' + error.message, 'error');
        }
    }
    
    // Função para carregar regras por tipo
    function loadRulesByType(type, rules) {
        console.log(`Carregando regras do tipo ${type}:`, rules);
        
        const editorContent = document.getElementById('rules-editor-content');
        if (!editorContent) {
            console.error('Elemento rules-editor-content não encontrado');
            return;
        }
        
        // Limpar conteúdo
        editorContent.innerHTML = '';
        
        // Criar tabela de regras
        const table = document.createElement('table');
        table.className = 'table table-striped table-hover';
        
        // Cabeçalho da tabela
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Validações</th>
                <th>Ações</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Corpo da tabela
        const tbody = document.createElement('tbody');
        
        // Adicionar cada regra
        for (const code in rules) {
            const rule = rules[code];
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${code}</td>
                <td>${rule.description || 'Sem descrição'}</td>
                <td>${rule.validations ? rule.validations.length : 0} validação(ões)</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" data-action="edit" data-type="${type}" data-code="${code}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" data-action="delete" data-type="${type}" data-code="${code}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(tr);
        }
        
        table.appendChild(tbody);
        editorContent.appendChild(table);
        
        // Adicionar eventos aos botões de ação
        document.querySelectorAll('[data-action="edit"]').forEach(button => {
            button.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const code = this.getAttribute('data-code');
                
                // Abrir modal para editar regra
                showEditRuleModal(type, code, rules[code]);
            });
        });
        
        document.querySelectorAll('[data-action="delete"]').forEach(button => {
            button.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const code = this.getAttribute('data-code');
                
                // Confirmar exclusão
                if (confirm(`Tem certeza que deseja excluir a regra ${code}?`)) {
                    // Remover regra
                    const success = window.FiscalRules.removeRule(type, code);
                    
                    if (success) {
                        showToast(`Regra ${code} removida com sucesso!`, 'success');
                        
                        // Recarregar regras
                        loadRulesByType(type, window.FiscalRules.getAllRules()[type]);
                    } else {
                        showToast(`Erro ao remover regra ${code}.`, 'error');
                    }
                }
            });
        });
    }
    
    // Função para mostrar modal de adicionar regra
    function showAddRuleModal(type) {
        // Criar modal para adicionar regra
        let modalHTML = `
            <div class="modal fade" id="add-rule-modal" tabindex="-1" aria-labelledby="addRuleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addRuleModalLabel">Adicionar Regra</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <form id="add-rule-form">
                                <div class="mb-3">
                                    <label for="rule-code" class="form-label">Código</label>
                                    <input type="text" class="form-control" id="rule-code" required>
                                </div>
                                <div class="mb-3">
                                    <label for="rule-description" class="form-label">Descrição</label>
                                    <input type="text" class="form-control" id="rule-description" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Validações</label>
                                    <div id="validations-container">
                                        <!-- Validações serão adicionadas aqui -->
                                    </div>
                                    <button type="button" class="btn btn-outline-primary mt-2" id="add-validation-btn">
                                        <i class="fas fa-plus"></i> Adicionar Validação
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="save-add-rule-btn">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Inicializar modal
        const modal = new bootstrap.Modal(document.getElementById('add-rule-modal'));
        modal.show();
        
        // Evento de clique no botão de adicionar validação
        document.getElementById('add-validation-btn').addEventListener('click', function() {
            addValidationField();
        });
        
        // Evento de clique no botão de salvar
        document.getElementById('save-add-rule-btn').addEventListener('click', function() {
            saveNewRule(type);
        });
        
        // Adicionar uma validação inicial
        addValidationField();
        
        // Função para adicionar campo de validação
        function addValidationField() {
            const container = document.getElementById('validations-container');
            const index = container.children.length;
            
            const validationField = document.createElement('div');
            validationField.className = 'card mb-2';
            validationField.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Validação #${index + 1}</h6>
                        <button type="button" class="btn btn-sm btn-outline-danger remove-validation-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="row mb-2">
                        <div class="col">
                            <label class="form-label">Campo</label>
                            <input type="text" class="form-control validation-field" required>
                        </div>
                        <div class="col">
                            <label class="form-label">Mensagem</label>
                            <input type="text" class="form-control validation-message" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <label class="form-label">Tipo de Validação</label>
                            <select class="form-select validation-type">
                                <option value="values">Lista de Valores</option>
                                <option value="condition">Condição</option>
                            </select>
                        </div>
                        <div class="col validation-values-container">
                            <label class="form-label">Valores (separados por vírgula)</label>
                            <input type="text" class="form-control validation-values">
                        </div>
                        <div class="col validation-condition-container d-none">
                            <label class="form-label">Condição</label>
                            <input type="text" class="form-control validation-condition" placeholder="Ex: value > 0">
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(validationField);
            
            // Evento de clique no botão de remover validação
            validationField.querySelector('.remove-validation-btn').addEventListener('click', function() {
                validationField.remove();
                // Atualizar números das validações
                updateValidationNumbers();
            });
            
            // Evento de mudança no tipo de validação
            validationField.querySelector('.validation-type').addEventListener('change', function() {
                const valuesContainer = validationField.querySelector('.validation-values-container');
                const conditionContainer = validationField.querySelector('.validation-condition-container');
                
                if (this.value === 'values') {
                    valuesContainer.classList.remove('d-none');
                    conditionContainer.classList.add('d-none');
                } else {
                    valuesContainer.classList.add('d-none');
                    conditionContainer.classList.remove('d-none');
                }
            });
        }
        
        // Função para atualizar números das validações
        function updateValidationNumbers() {
            const container = document.getElementById('validations-container');
            const validations = container.children;
            
            for (let i = 0; i < validations.length; i++) {
                validations[i].querySelector('h6').textContent = `Validação #${i + 1}`;
            }
        }
        
        // Função para salvar nova regra
        function saveNewRule(type) {
            const code = document.getElementById('rule-code').value;
            const description = document.getElementById('rule-description').value;
            
            if (!code || !description) {
                showToast('Preencha todos os campos obrigatórios.', 'warning');
                return;
            }
            
            // Coletar validações
            const validations = [];
            const validationElements = document.getElementById('validations-container').children;
            
            for (let i = 0; i < validationElements.length; i++) {
                const element = validationElements[i];
                const field = element.querySelector('.validation-field').value;
                const message = element.querySelector('.validation-message').value;
                const validationType = element.querySelector('.validation-type').value;
                
                if (!field || !message) {
                    showToast(`Preencha todos os campos da validação #${i + 1}.`, 'warning');
                    return;
                }
                
                const validation = {
                    field,
                    message
                };
                
                if (validationType === 'values') {
                    const valuesStr = element.querySelector('.validation-values').value;
                    if (!valuesStr) {
                        showToast(`Preencha os valores da validação #${i + 1}.`, 'warning');
                        return;
                    }
                    
                    validation.values = valuesStr.split(',').map(v => v.trim());
                } else {
                    const condition = element.querySelector('.validation-condition').value;
                    if (!condition) {
                        showToast(`Preencha a condição da validação #${i + 1}.`, 'warning');
                        return;
                    }
                    
                    validation.condition = condition;
                }
                
                validations.push(validation);
            }
            
            // Criar regra
            const rule = {
                description,
                validations
            };
            
            // Adicionar regra
            const success = window.FiscalRules.updateRule(type, code, rule);
            
            if (success) {
                showToast(`Regra ${code} adicionada com sucesso!`, 'success');
                
                // Fechar modal
                modal.hide();
                
                // Remover modal do DOM
                document.getElementById('add-rule-modal').remove();
                
                // Recarregar regras
                loadRulesByType(type, window.FiscalRules.getAllRules()[type]);
            } else {
                showToast(`Erro ao adicionar regra ${code}.`, 'error');
            }
        }
    }
    
    // Função para mostrar modal de editar regra
    function showEditRuleModal(type, code, rule) {
        // Criar modal para editar regra
        let modalHTML = `
            <div class="modal fade" id="edit-rule-modal" tabindex="-1" aria-labelledby="editRuleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editRuleModalLabel">Editar Regra ${code}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <form id="edit-rule-form">
                                <div class="mb-3">
                                    <label for="edit-rule-code" class="form-label">Código</label>
                                    <input type="text" class="form-control" id="edit-rule-code" value="${code}" readonly>
                                </div>
                                <div class="mb-3">
                                    <label for="edit-rule-description" class="form-label">Descrição</label>
                                    <input type="text" class="form-control" id="edit-rule-description" value="${rule.description || ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Validações</label>
                                    <div id="edit-validations-container">
                                        <!-- Validações serão adicionadas aqui -->
                                    </div>
                                    <button type="button" class="btn btn-outline-primary mt-2" id="edit-add-validation-btn">
                                        <i class="fas fa-plus"></i> Adicionar Validação
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="save-edit-rule-btn">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Inicializar modal
        const modal = new bootstrap.Modal(document.getElementById('edit-rule-modal'));
        modal.show();
        
        // Adicionar validações existentes
        if (rule.validations && rule.validations.length > 0) {
            rule.validations.forEach(validation => {
                addEditValidationField(validation);
            });
        } else {
            // Adicionar uma validação vazia
            addEditValidationField();
        }
        
        // Evento de clique no botão de adicionar validação
        document.getElementById('edit-add-validation-btn').addEventListener('click', function() {
            addEditValidationField();
        });
        
        // Evento de clique no botão de salvar
        document.getElementById('save-edit-rule-btn').addEventListener('click', function() {
            saveEditedRule(type, code);
        });
        
        // Função para adicionar campo de validação
        function addEditValidationField(validation = null) {
            const container = document.getElementById('edit-validations-container');
            const index = container.children.length;
            
            const validationField = document.createElement('div');
            validationField.className = 'card mb-2';
            
            // Determinar tipo de validação
            let validationType = 'values';
            let values = '';
            let condition = '';
            
            if (validation) {
                if (validation.values) {
                    validationType = 'values';
                    values = validation.values.join(', ');
                } else if (validation.condition) {
                    validationType = 'condition';
                    condition = validation.condition;
                }
            }
            
            validationField.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Validação #${index + 1}</h6>
                        <button type="button" class="btn btn-sm btn-outline-danger edit-remove-validation-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="row mb-2">
                        <div class="col">
                            <label class="form-label">Campo</label>
                            <input type="text" class="form-control edit-validation-field" value="${validation ? validation.field : ''}" required>
                        </div>
                        <div class="col">
                            <label class="form-label">Mensagem</label>
                            <input type="text" class="form-control edit-validation-message" value="${validation ? validation.message : ''}" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <label class="form-label">Tipo de Validação</label>
                            <select class="form-select edit-validation-type">
                                <option value="values" ${validationType === 'values' ? 'selected' : ''}>Lista de Valores</option>
                                <option value="condition" ${validationType === 'condition' ? 'selected' : ''}>Condição</option>
                            </select>
                        </div>
                        <div class="col edit-validation-values-container ${validationType === 'values' ? '' : 'd-none'}">
                            <label class="form-label">Valores (separados por vírgula)</label>
                            <input type="text" class="form-control edit-validation-values" value="${values}">
                        </div>
                        <div class="col edit-validation-condition-container ${validationType === 'condition' ? '' : 'd-none'}">
                            <label class="form-label">Condição</label>
                            <input type="text" class="form-control edit-validation-condition" placeholder="Ex: value > 0" value="${condition}">
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(validationField);
            
            // Evento de clique no botão de remover validação
            validationField.querySelector('.edit-remove-validation-btn').addEventListener('click', function() {
                validationField.remove();
                // Atualizar números das validações
                updateEditValidationNumbers();
            });
            
            // Evento de mudança no tipo de validação
            validationField.querySelector('.edit-validation-type').addEventListener('change', function() {
                const valuesContainer = validationField.querySelector('.edit-validation-values-container');
                const conditionContainer = validationField.querySelector('.edit-validation-condition-container');
                
                if (this.value === 'values') {
                    valuesContainer.classList.remove('d-none');
                    conditionContainer.classList.add('d-none');
                } else {
                    valuesContainer.classList.add('d-none');
                    conditionContainer.classList.remove('d-none');
                }
            });
        }
        
        // Função para atualizar números das validações
        function updateEditValidationNumbers() {
            const container = document.getElementById('edit-validations-container');
            const validations = container.children;
            
            for (let i = 0; i < validations.length; i++) {
                validations[i].querySelector('h6').textContent = `Validação #${i + 1}`;
            }
        }
        
        // Função para salvar regra editada
        function saveEditedRule(type, code) {
            const description = document.getElementById('edit-rule-description').value;
            
            if (!description) {
                showToast('Preencha a descrição da regra.', 'warning');
                return;
            }
            
            // Coletar validações
            const validations = [];
            const validationElements = document.getElementById('edit-validations-container').children;
            
            for (let i = 0; i < validationElements.length; i++) {
                const element = validationElements[i];
                const field = element.querySelector('.edit-validation-field').value;
                const message = element.querySelector('.edit-validation-message').value;
                const validationType = element.querySelector('.edit-validation-type').value;
                
                if (!field || !message) {
                    showToast(`Preencha todos os campos da validação #${i + 1}.`, 'warning');
                    return;
                }
                
                const validation = {
                    field,
                    message
                };
                
                if (validationType === 'values') {
                    const valuesStr = element.querySelector('.edit-validation-values').value;
                    if (!valuesStr) {
                        showToast(`Preencha os valores da validação #${i + 1}.`, 'warning');
                        return;
                    }
                    
                    validation.values = valuesStr.split(',').map(v => v.trim());
                } else {
                    const condition = element.querySelector('.edit-validation-condition').value;
                    if (!condition) {
                        showToast(`Preencha a condição da validação #${i + 1}.`, 'warning');
                        return;
                    }
                    
                    validation.condition = condition;
                }
                
                validations.push(validation);
            }
            
            // Criar regra
            const rule = {
                description,
                validations
            };
            
            // Atualizar regra
            const success = window.FiscalRules.updateRule(type, code, rule);
            
            if (success) {
                showToast(`Regra ${code} atualizada com sucesso!`, 'success');
                
                // Fechar modal
                modal.hide();
                
                // Remover modal do DOM
                document.getElementById('edit-rule-modal').remove();
                
                // Recarregar regras
                loadRulesByType(type, window.FiscalRules.getAllRules()[type]);
            } else {
                showToast(`Erro ao atualizar regra ${code}.`, 'error');
            }
        }
    }
    
    // Função para exportar dados
    function exportData() {
        const format = document.getElementById('export-format').value;
        const filename = document.getElementById('export-filename').value || 'dados_exportados';
        const includeHeaders = document.getElementById('export-include-headers').checked;
        const onlyErrors = document.getElementById('export-only-errors').checked;
        
        // Filtrar dados se necessário
        let dataToExport = appState.filteredData;
        
        if (onlyErrors) {
            // Filtrar apenas registros com erros
            const invalidIndexes = appState.validationResults
                .filter(result => !result.valid)
                .map(result => result.index);
            
            dataToExport = dataToExport.filter((_, index) => invalidIndexes.includes(index));
        }
        
        // Exportar de acordo com o formato
        if (format === 'xlsx') {
            exportToExcel(dataToExport, filename, includeHeaders);
        } else if (format === 'csv') {
            exportToCSV(dataToExport, filename, includeHeaders);
        } else if (format === 'pdf') {
            exportToPDF(dataToExport, filename, includeHeaders);
        }
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('export-modal'));
        modal.hide();
    }
    
    // Função para exportar para Excel
    function exportToExcel(data, filename, includeHeaders) {
        // Criar workbook
        const wb = XLSX.utils.book_new();
        
        // Preparar dados
        let wsData = [];
        
        // Adicionar cabeçalhos se necessário
        if (includeHeaders) {
            wsData.push(appState.columns);
        }
        
        // Adicionar dados
        data.forEach(row => {
            const rowData = [];
            appState.columns.forEach(column => {
                rowData.push(row[column] || '');
            });
            wsData.push(rowData);
        });
        
        // Criar worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Adicionar worksheet ao workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Dados');
        
        // Exportar workbook
        XLSX.writeFile(wb, `${filename}.xlsx`);
        
        showToast('Dados exportados com sucesso!', 'success');
    }
    
    // Função para exportar para CSV
    function exportToCSV(data, filename, includeHeaders) {
        // Preparar dados
        let csvContent = '';
        
        // Adicionar cabeçalhos se necessário
        if (includeHeaders) {
            csvContent += appState.columns.join(',') + '\n';
        }
        
        // Adicionar dados
        data.forEach(row => {
            const rowData = [];
            appState.columns.forEach(column => {
                // Escapar vírgulas e aspas
                let value = row[column] || '';
                if (value.includes(',') || value.includes('"')) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                rowData.push(value);
            });
            csvContent += rowData.join(',') + '\n';
        });
        
        // Criar blob e link para download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        
        // Liberar URL
        URL.revokeObjectURL(url);
        
        showToast('Dados exportados com sucesso!', 'success');
    }
    
    // Função para exportar para PDF
    function exportToPDF(data, filename, includeHeaders) {
        // Implementação simplificada - apenas mostrar toast
        showToast('Exportação para PDF será implementada em breve.', 'info');
    }
    
    // Função para mostrar toast
    function showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        
        // Criar elemento toast
        const toastElement = document.createElement('div');
        toastElement.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type}`;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        
        // Conteúdo do toast
        toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
            </div>
        `;
        
        // Adicionar ao container
        toastContainer.appendChild(toastElement);
        
        // Inicializar toast
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 5000
        });
        
        // Mostrar toast
        toast.show();
        
        // Remover após ocultar
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    }
    
    console.log('Aplicação inicializada com sucesso!');
});
