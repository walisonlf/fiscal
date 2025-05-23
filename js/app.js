/**
 * Arquivo: app.js
 * Arquivo principal da aplicação que integra todos os componentes
 */

// Configuração global da aplicação
const CONFIG = {
    // Mapeamento de colunas da planilha para nomes internos
    columnMapping: {
        'Empresa': ['Empresa'],
        'Local de negócios': ['Local de negócios'],
        'Nº de documento': ['Nº de documento'],
        'Nº da Nota Fiscal': ['Nº da Nota Fiscal'],
        'Val.Total NF': ['Val.Total NF'],
        'Material': ['Material'],
        'Descrição': ['Descrição'],
        'CFOP': ['CFOP'],
        'CST ICMS': ['CST ICMS'],
        'Base ICMS': ['Base ICMS'],
        'Valor ICMS': ['Valor ICMS'],
        'CST COFINS': ['CST COFINS'],
        'Base COFINS': ['Base COFINS'],
        'Aliquota COFINS': ['Aliquota COFINS'],
        'Valor COFINS': ['Valor COFINS'],
        'CST PIS': ['CST PIS'],
        'Base PIS': ['Base PIS'],
        'Aliquota PIS': ['Aliquota PIS'],
        'Valor PIS': ['Valor PIS'],
        'Base ICMS_ST': ['Base ICMS_ST'],
        'Aliquota ICMS_ST': ['Aliquota ICMS_ST'],
        'Valor ICMS_ST': ['Valor ICMS_ST'],
        'Chave de acesso NFe': ['Chave de acesso NFe'],
        'Data Emissão': ['Data Emissão'],
        'Data Lançamento': ['Data Lançamento']
    },
    
    // Definição das colunas para a tabela de resultados
    tableColumns: [
        { field: 'Empresa', label: 'Empresa', sortable: true },
        { field: 'Local de negócios', label: 'Local de negócios', sortable: true },
        { field: 'Nº de documento', label: 'Nº de documento', sortable: true },
        { field: 'Nº da Nota Fiscal', label: 'Nº da Nota Fiscal', sortable: true },
        { field: 'Val.Total NF', label: 'Val.Total NF', sortable: true, align: 'right', 
          formatter: value => Utils.formatCurrency(value) },
        { field: 'Material', label: 'Material', sortable: true },
        { field: 'Descrição', label: 'Descrição', sortable: true },
        { field: 'CFOP', label: 'CFOP', sortable: true },
        { field: 'CST ICMS', label: 'CST ICMS', sortable: true },
        { field: 'Base ICMS', label: 'Base ICMS', sortable: true, align: 'right',
          formatter: value => Utils.formatCurrency(value) },
        { field: 'Valor ICMS', label: 'Valor ICMS', sortable: true, align: 'right',
          formatter: value => Utils.formatCurrency(value) },
        { field: 'CST COFINS', label: 'CST COFINS', sortable: true },
        { field: 'Base COFINS', label: 'Base COFINS', sortable: true, align: 'right',
          formatter: value => Utils.formatCurrency(value) },
        { field: 'Aliquota COFINS', label: 'Aliquota COFINS', sortable: true, align: 'right',
          formatter: value => Utils.formatPercentage(value) },
        { field: 'Valor COFINS', label: 'Valor COFINS', sortable: true, align: 'right',
          formatter: value => Utils.formatCurrency(value) },
        { field: 'CST PIS', label: 'CST PIS', sortable: true },
        { field: 'Base PIS', label: 'Base PIS', sortable: true, align: 'right',
          formatter: value => Utils.formatCurrency(value) },
        { field: 'Aliquota PIS', label: 'Aliquota PIS', sortable: true, align: 'right',
          formatter: value => Utils.formatPercentage(value) },
        { field: 'Valor PIS', label: 'Valor PIS', sortable: true, align: 'right',
          formatter: value => Utils.formatCurrency(value) },
        { field: 'Base ICMS_ST', label: 'Base ICMS_ST', sortable: true, align: 'right',
          formatter: value => Utils.formatCurrency(value) },
        { field: 'Aliquota ICMS_ST', label: 'Aliquota ICMS_ST', sortable: true, align: 'right',
          formatter: value => Utils.formatPercentage(value) },
        { field: 'Valor ICMS_ST', label: 'Valor ICMS_ST', sortable: true, align: 'right',
          formatter: value => Utils.formatCurrency(value) },
        { field: 'Chave de acesso NFe', label: 'Chave de acesso NFe', sortable: true }
    ],
    
    // Regras de validação por CFOP
    cfopRules: [],
    
    // Regras de validação por CST ICMS
    cstIcmsRules: [],
    
    // Regras de validação por CST PIS/COFINS
    cstPisCofinsRules: [],
    
    // Configurações de desempenho
    performance: {
        chunkSize: 100,        // Tamanho dos lotes para processamento
        useWorker: true,       // Usar Web Worker para processamento paralelo
        cacheResults: true,    // Cachear resultados de validação
        debounceTime: 300      // Tempo de debounce para operações em tempo real (ms)
    },
    
    // Configurações de interface
    ui: {
        theme: 'light',        // Tema: 'light' ou 'dark'
        showTooltips: true,    // Mostrar tooltips de ajuda
        animationsEnabled: true, // Habilitar animações
        defaultItemsPerPage: 25 // Itens por página padrão
    },
    
    // Configurações de exportação
    export: {
        formats: ['xlsx', 'csv', 'pdf'],
        defaultFormat: 'xlsx',
        includeHeaders: true,
        dateFormat: 'DD/MM/YYYY'
    }
};

// Aplicação principal
const App = (function() {
    // Estado da aplicação
    const state = {
        data: [],
        validationResults: [],
        isProcessing: false,
        currentFile: null,
        table: null,
        worker: null,
        hasErrors: false,
        errorCount: 0,
        warningCount: 0
    };
    
    // Inicializa a aplicação
    function init() {
        console.log('Inicializando aplicação...');
        
        // Carrega as preferências do usuário
        loadUserPreferences();
        
        // Inicializa o tema
        ThemeManager.init(CONFIG.ui.theme);
        
        // Inicializa os componentes da UI
        initUI();
        
        // Configura os event listeners
        setupEventListeners();
        
        // Inicializa o Web Worker se habilitado
        if (CONFIG.performance.useWorker) {
            initWorker();
        }
        
        // Carrega as regras de validação
        loadValidationRules();
        
        console.log('Aplicação inicializada com sucesso!');
    }
    
    // Carrega as preferências do usuário
    function loadUserPreferences() {
        try {
            // Carrega o tema
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                CONFIG.ui.theme = savedTheme;
            }
            
            // Carrega os itens por página
            const savedItemsPerPage = localStorage.getItem('itemsPerPage');
            if (savedItemsPerPage) {
                CONFIG.ui.defaultItemsPerPage = parseInt(savedItemsPerPage, 10);
            }
            
            // Carrega outras preferências...
            
            console.log('Preferências do usuário carregadas com sucesso.');
        } catch (e) {
            console.error('Erro ao carregar preferências do usuário:', e);
        }
    }
    
    // Inicializa a interface do usuário
    function initUI() {
        // Inicializa os tooltips
        if (CONFIG.ui.showTooltips) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
        
        // Inicializa os popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
        
        // Inicializa o sistema de filtros
        if (typeof FilterSystem !== 'undefined') {
            FilterSystem.loadSavedPresets();
        }
        
        // Inicializa o editor de regras
        if (typeof RulesEditor !== 'undefined') {
            RulesEditor.loadSavedRuleSets();
        }
        
        // Inicializa a tabela
        initTable();
    }
    
    // Inicializa a tabela de resultados
    function initTable() {
        // Verifica se o container da tabela existe
        const tableContainer = document.getElementById('table-container');
        if (!tableContainer) {
            console.error('Container da tabela não encontrado!');
            return;
        }
        
        // Limpa o container
        tableContainer.innerHTML = '';
        
        // Inicializa a tabela
        state.table = AdvancedTable.init({
            columns: CONFIG.tableColumns,
            data: [],
            itemsPerPage: CONFIG.ui.defaultItemsPerPage,
            onRowClick: handleRowClick
        });
    }
    
    // Inicializa o Web Worker
    function initWorker() {
        try {
            state.worker = new Worker('js/worker.js');
            
            // Configura o listener para mensagens do worker
            state.worker.onmessage = function(e) {
                const { type, data } = e.data;
                
                switch (type) {
                    case 'validation_results':
                        handleValidationResults(data);
                        break;
                    case 'progress':
                        updateProgressBar(data.progress);
                        break;
                    case 'error':
                        showError(data.message);
                        break;
                }
            };
            
            console.log('Web Worker inicializado com sucesso.');
        } catch (e) {
            console.error('Erro ao inicializar Web Worker:', e);
            CONFIG.performance.useWorker = false;
        }
    }
    
    // Carrega as regras de validação
    function loadValidationRules() {
        // Carrega as regras do localStorage, se disponíveis
        try {
            const savedRules = localStorage.getItem('validationRules');
            if (savedRules) {
                const parsedRules = JSON.parse(savedRules);
                
                if (parsedRules.cfopRules) CONFIG.cfopRules = parsedRules.cfopRules;
                if (parsedRules.cstIcmsRules) CONFIG.cstIcmsRules = parsedRules.cstIcmsRules;
                if (parsedRules.cstPisCofinsRules) CONFIG.cstPisCofinsRules = parsedRules.cstPisCofinsRules;
                
                console.log('Regras de validação carregadas do localStorage.');
            } else {
                // Carrega as regras padrão
                loadDefaultRules();
            }
        } catch (e) {
            console.error('Erro ao carregar regras de validação:', e);
            // Carrega as regras padrão em caso de erro
            loadDefaultRules();
        }
    }
    
    // Carrega as regras de validação padrão
    function loadDefaultRules() {
        // As regras padrão são definidas no arquivo rules.js
        // e já estão disponíveis globalmente
        console.log('Carregando regras de validação padrão...');
        
        // Inicializa o validador com as regras
        Validator.init({
            cfopRules: CONFIG.cfopRules,
            cstIcmsRules: CONFIG.cstIcmsRules,
            cstPisCofinsRules: CONFIG.cstPisCofinsRules
        });
    }
    
    // Configura os event listeners
    function setupEventListeners() {
        // Event listener para o formulário de upload
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            uploadForm.addEventListener('submit', handleFileUpload);
        }
        
        // Event listener para o input de arquivo
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', handleFileChange);
        }
        
        // Event listener para o botão de validar
        const validateBtn = document.getElementById('validate-btn');
        if (validateBtn) {
            validateBtn.addEventListener('click', handleValidateClick);
        }
        
        // Event listener para o botão de exportar
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', handleExportClick);
        }
        
        // Event listener para o botão de alternar tema
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', handleThemeToggle);
        }
        
        // Event listener para o botão de abrir editor de regras
        const rulesEditorBtn = document.getElementById('rules-editor-btn');
        if (rulesEditorBtn) {
            rulesEditorBtn.addEventListener('click', handleRulesEditorClick);
        }
        
        // Event listener para mudanças nas regras
        document.addEventListener('rulesChanged', handleRulesChanged);
        
        // Event listener para o botão de limpar filtros
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', handleClearFilters);
        }
    }
    
    // Manipula o envio do formulário de upload
    function handleFileUpload(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('file-input');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            showError('Por favor, selecione um arquivo para upload.');
            return;
        }
        
        const file = fileInput.files[0];
        processFile(file);
    }
    
    // Manipula a mudança do input de arquivo
    function handleFileChange(e) {
        const fileInput = e.target;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            return;
        }
        
        const file = fileInput.files[0];
        
        // Atualiza o label com o nome do arquivo
        const fileLabel = document.querySelector('.custom-file-label');
        if (fileLabel) {
            fileLabel.textContent = file.name;
        }
        
        // Habilita o botão de validar
        const validateBtn = document.getElementById('validate-btn');
        if (validateBtn) {
            validateBtn.disabled = false;
        }
        
        // Armazena o arquivo atual
        state.currentFile = file;
    }
    
    // Manipula o clique no botão de validar
    function handleValidateClick() {
        if (!state.currentFile) {
            showError('Por favor, selecione um arquivo para validar.');
            return;
        }
        
        processFile(state.currentFile);
    }
    
    // Manipula o clique no botão de exportar
    function handleExportClick() {
        if (state.data.length === 0) {
            showError('Não há dados para exportar.');
            return;
        }
        
        // Mostra o modal de exportação
        showExportModal();
    }
    
    // Manipula o clique no botão de alternar tema
    function handleThemeToggle() {
        const currentTheme = ThemeManager.getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        ThemeManager.setTheme(newTheme);
        
        // Atualiza o ícone do botão
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
        
        // Salva a preferência
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.error('Erro ao salvar preferência de tema:', e);
        }
    }
    
    // Manipula o clique no botão de abrir editor de regras
    function handleRulesEditorClick() {
        // Mostra o modal do editor de regras
        const rulesEditorModal = new bootstrap.Modal(document.getElementById('rules-editor-modal'));
        rulesEditorModal.show();
        
        // Inicializa o editor de regras
        if (typeof RulesEditor !== 'undefined') {
            RulesEditor.init();
        }
    }
    
    // Manipula mudanças nas regras
    function handleRulesChanged(event) {
        const { rules } = event.detail;
        
        // Separa as regras por tipo
        const cfopRules = [];
        const cstIcmsRules = [];
        const cstPisCofinsRules = [];
        
        rules.forEach(rule => {
            if (rule.type === 'cfop') {
                cfopRules.push({
                    cfop: rule.cfop,
                    conditions: rule.conditions
                });
            } else if (rule.type === 'cst_icms') {
                cstIcmsRules.push({
                    cst: rule.cst,
                    conditions: rule.conditions
                });
            } else if (rule.type === 'cst_pis_cofins') {
                cstPisCofinsRules.push({
                    cst: rule.cst,
                    type: rule.taxType,
                    conditions: rule.conditions,
                    exceptions: rule.exceptions
                });
            }
        });
        
        // Atualiza as regras no CONFIG
        CONFIG.cfopRules = cfopRules;
        CONFIG.cstIcmsRules = cstIcmsRules;
        CONFIG.cstPisCofinsRules = cstPisCofinsRules;
        
        // Salva as regras no localStorage
        try {
            localStorage.setItem('validationRules', JSON.stringify({
                cfopRules,
                cstIcmsRules,
                cstPisCofinsRules
            }));
        } catch (e) {
            console.error('Erro ao salvar regras no localStorage:', e);
        }
        
        // Atualiza o validador
        Validator.updateRules({
            cfopRules,
            cstIcmsRules,
            cstPisCofinsRules
        });
        
        // Se houver dados carregados, revalida
        if (state.data.length > 0) {
            validateData(state.data);
        }
    }
    
    // Manipula o clique no botão de limpar filtros
    function handleClearFilters() {
        if (typeof FilterSystem !== 'undefined') {
            FilterSystem.clearAllFilters();
        }
    }
    
    // Manipula o clique em uma linha da tabela
    function handleRowClick(row, index) {
        console.log('Linha clicada:', row, 'Índice:', index);
        
        // Mostra os detalhes da linha
        showRowDetails(row, index);
    }
    
    // Processa o arquivo selecionado
    function processFile(file) {
        // Verifica se o arquivo é válido
        if (!isValidFile(file)) {
            showError('Formato de arquivo inválido. Por favor, selecione um arquivo XLS, XLSX ou CSV.');
            return;
        }
        
        // Mostra o indicador de carregamento
        showLoading('Processando arquivo...');
        
        // Limpa os dados anteriores
        state.data = [];
        state.validationResults = [];
        state.hasErrors = false;
        state.errorCount = 0;
        state.warningCount = 0;
        
        // Processa o arquivo
        readFile(file)
            .then(data => {
                // Armazena os dados
                state.data = data;
                
                // Atualiza a tabela
                updateTable(data);
                
                // Inicializa o sistema de filtros
                if (typeof FilterSystem !== 'undefined') {
                    FilterSystem.init(data, Object.keys(CONFIG.columnMapping));
                }
                
                // Valida os dados
                validateData(data);
                
                // Mostra o resumo
                showSummary(data);
                
                // Esconde o indicador de carregamento
                hideLoading();
                
                // Mostra a seção de resultados
                showResultsSection();
            })
            .catch(error => {
                console.error('Erro ao processar arquivo:', error);
                showError('Erro ao processar o arquivo: ' + error.message);
                hideLoading();
            });
    }
    
    // Verifica se o arquivo é válido
    function isValidFile(file) {
        const validExtensions = ['.xls', '.xlsx', '.csv'];
        const fileName = file.name.toLowerCase();
        
        return validExtensions.some(ext => fileName.endsWith(ext));
    }
    
    // Lê o arquivo e retorna os dados
    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const data = e.target.result;
                    const fileName = file.name.toLowerCase();
                    
                    if (fileName.endsWith('.csv')) {
                        // Processa CSV
                        const parsedData = parseCSV(data);
                        resolve(parsedData);
                    } else {
                        // Processa XLS/XLSX
                        const parsedData = parseExcel(data);
                        resolve(parsedData);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = function() {
                reject(new Error('Erro ao ler o arquivo.'));
            };
            
            if (file.name.toLowerCase().endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }
    
    // Processa arquivo CSV
    function parseCSV(data) {
        // Implementação simplificada - em produção, usar uma biblioteca robusta como PapaParse
        const lines = data.split('\n');
        const headers = lines[0].split(';').map(header => header.trim().replace(/"/g, ''));
        
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(';').map(value => value.trim().replace(/"/g, ''));
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            result.push(row);
        }
        
        return result;
    }
    
    // Processa arquivo Excel
    function parseExcel(data) {
        // Em produção, usar uma biblioteca como SheetJS (xlsx)
        // Aqui, usamos uma implementação simplificada para demonstração
        
        // Converte o ArrayBuffer para um array de bytes
        const array = new Uint8Array(data);
        
        // Carrega o workbook
        const workbook = XLSX.read(array, { type: 'array' });
        
        // Pega a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converte para JSON
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Extrai os cabeçalhos
        const headers = json[0];
        
        // Converte para array de objetos
        const result = [];
        
        for (let i = 1; i < json.length; i++) {
            const row = {};
            const values = json[i];
            
            // Pula linhas vazias
            if (values.length === 0) continue;
            
            headers.forEach((header, index) => {
                row[header] = values[index] !== undefined ? values[index] : '';
            });
            
            result.push(row);
        }
        
        return result;
    }
    
    // Valida os dados
    function validateData(data) {
        // Mostra a barra de progresso
        showProgressBar();
        
        // Se estiver usando Web Worker
        if (CONFIG.performance.useWorker && state.worker) {
            // Envia os dados para o worker
            state.worker.postMessage({
                type: 'validate',
                data: data,
                config: {
                    cfopRules: CONFIG.cfopRules,
                    cstIcmsRules: CONFIG.cstIcmsRules,
                    cstPisCofinsRules: CONFIG.cstPisCofinsRules,
                    chunkSize: CONFIG.performance.chunkSize
                }
            });
        } else {
            // Processa em lotes para não bloquear a UI
            processInChunks(data, validateChunk, CONFIG.performance.chunkSize)
                .then(results => {
                    handleValidationResults(results);
                })
                .catch(error => {
                    console.error('Erro ao validar dados:', error);
                    showError('Erro ao validar os dados: ' + error.message);
                    hideProgressBar();
                });
        }
    }
    
    // Processa os dados em lotes
    function processInChunks(data, processFn, chunkSize) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            const totalChunks = Math.ceil(data.length / chunkSize);
            let processedChunks = 0;
            let results = [];
            
            // Divide os dados em lotes
            for (let i = 0; i < data.length; i += chunkSize) {
                chunks.push(data.slice(i, i + chunkSize));
            }
            
            // Função para processar o próximo lote
            function processNextChunk() {
                if (processedChunks >= chunks.length) {
                    // Todos os lotes foram processados
                    resolve(results);
                    return;
                }
                
                const chunk = chunks[processedChunks];
                
                // Processa o lote
                try {
                    const chunkResults = processFn(chunk);
                    results = results.concat(chunkResults);
                    
                    // Atualiza o progresso
                    processedChunks++;
                    const progress = Math.round((processedChunks / totalChunks) * 100);
                    updateProgressBar(progress);
                    
                    // Agenda o processamento do próximo lote
                    setTimeout(processNextChunk, 0);
                } catch (error) {
                    reject(error);
                }
            }
            
            // Inicia o processamento
            processNextChunk();
        });
    }
    
    // Valida um lote de dados
    function validateChunk(chunk) {
        return chunk.map(row => Validator.validate(row));
    }
    
    // Manipula os resultados da validação
    function handleValidationResults(results) {
        // Armazena os resultados
        state.validationResults = results;
        
        // Conta os erros e avisos
        let errorCount = 0;
        let warningCount = 0;
        
        results.forEach(result => {
            if (result.errors && result.errors.length > 0) {
                errorCount += result.errors.length;
            }
            if (result.warnings && result.warnings.length > 0) {
                warningCount += result.warnings.length;
            }
        });
        
        state.hasErrors = errorCount > 0;
        state.errorCount = errorCount;
        state.warningCount = warningCount;
        
        // Atualiza a tabela com os erros
        updateTableWithErrors(results);
        
        // Atualiza o resumo
        updateSummary(errorCount, warningCount);
        
        // Esconde a barra de progresso
        hideProgressBar();
        
        // Mostra o relatório de erros
        showErrorReport(results);
    }
    
    // Atualiza a tabela com os dados
    function updateTable(data) {
        if (state.table) {
            state.table.updateData(data);
        }
    }
    
    // Atualiza a tabela com os erros
    function updateTableWithErrors(results) {
        if (!state.table) return;
        
        // Limpa os destaques de erro anteriores
        state.table.clearErrorHighlights();
        
        // Adiciona os destaques de erro
        results.forEach((result, index) => {
            if (result.errors && result.errors.length > 0) {
                const row = state.data[index];
                
                result.errors.forEach(error => {
                    state.table.addErrorHighlight(row, error.field, error.code, error.message);
                });
                
                // Destaca a linha
                state.table.highlightRow(index, true);
            }
        });
    }
    
    // Mostra o resumo dos dados
    function showSummary(data) {
        const summaryContainer = document.getElementById('summary-container');
        if (!summaryContainer) return;
        
        summaryContainer.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Resumo</h5>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="summary-item">
                                <div class="summary-label">Total de Registros</div>
                                <div class="summary-value">${data.length}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="summary-item">
                                <div class="summary-label">Erros</div>
                                <div class="summary-value" id="error-count">0</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="summary-item">
                                <div class="summary-label">Avisos</div>
                                <div class="summary-value" id="warning-count">0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Atualiza o resumo com os erros e avisos
    function updateSummary(errorCount, warningCount) {
        const errorCountElement = document.getElementById('error-count');
        const warningCountElement = document.getElementById('warning-count');
        
        if (errorCountElement) {
            errorCountElement.textContent = errorCount;
            errorCountElement.className = 'summary-value' + (errorCount > 0 ? ' text-danger' : '');
        }
        
        if (warningCountElement) {
            warningCountElement.textContent = warningCount;
            warningCountElement.className = 'summary-value' + (warningCount > 0 ? ' text-warning' : '');
        }
    }
    
    // Mostra o relatório de erros
    function showErrorReport(results) {
        const errorReportContainer = document.getElementById('error-report-container');
        if (!errorReportContainer) return;
        
        // Filtra apenas os resultados com erros
        const resultsWithErrors = results.filter(result => result.errors && result.errors.length > 0);
        
        if (resultsWithErrors.length === 0) {
            errorReportContainer.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    Nenhum erro encontrado na validação.
                </div>
            `;
            return;
        }
        
        // Agrupa os erros por código
        const errorsByCode = {};
        
        resultsWithErrors.forEach((result, index) => {
            result.errors.forEach(error => {
                if (!errorsByCode[error.code]) {
                    errorsByCode[error.code] = {
                        code: error.code,
                        message: error.message,
                        count: 0,
                        examples: []
                    };
                }
                
                errorsByCode[error.code].count++;
                
                // Adiciona até 3 exemplos
                if (errorsByCode[error.code].examples.length < 3) {
                    errorsByCode[error.code].examples.push({
                        rowIndex: index,
                        row: state.data[index]
                    });
                }
            });
        });
        
        // Converte para array e ordena por contagem (decrescente)
        const errorList = Object.values(errorsByCode).sort((a, b) => b.count - a.count);
        
        // Renderiza o relatório
        errorReportContainer.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Relatório de Erros</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Descrição</th>
                                    <th>Ocorrências</th>
                                    <th>Exemplos</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${errorList.map(error => `
                                    <tr>
                                        <td><span class="badge bg-danger">${error.code}</span></td>
                                        <td>${error.message}</td>
                                        <td>${error.count}</td>
                                        <td>
                                            ${error.examples.map(example => `
                                                <div class="error-example">
                                                    <button class="btn btn-sm btn-outline-primary show-row-btn" data-index="${example.rowIndex}">
                                                        Ver linha ${example.rowIndex + 1}
                                                    </button>
                                                </div>
                                            `).join('')}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        // Adiciona event listeners para os botões de ver linha
        const showRowButtons = errorReportContainer.querySelectorAll('.show-row-btn');
        showRowButtons.forEach(button => {
            button.addEventListener('click', () => {
                const rowIndex = parseInt(button.dataset.index, 10);
                showRowDetails(state.data[rowIndex], rowIndex);
                
                // Destaca a linha na tabela
                if (state.table) {
                    // Calcula a página
                    const itemsPerPage = state.table.getItemsPerPage();
                    const page = Math.floor(rowIndex / itemsPerPage) + 1;
                    
                    // Navega para a página
                    if (page !== state.table.getCurrentPage()) {
                        // TODO: Implementar navegação para a página específica
                    }
                    
                    // Seleciona a linha
                    state.table.handleRowClick(rowIndex);
                }
            });
        });
    }
    
    // Mostra os detalhes de uma linha
    function showRowDetails(row, index) {
        // Cria o modal se não existir
        let modal = document.getElementById('row-details-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'row-details-modal';
            modal.className = 'modal fade';
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-hidden', 'true');
            
            modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detalhes do Registro</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <div id="row-details-content"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Inicializa o modal Bootstrap
            new bootstrap.Modal(modal);
        }
        
        // Preenche o conteúdo do modal
        const content = document.getElementById('row-details-content');
        if (content) {
            // Obtém os erros para esta linha
            const validationResult = state.validationResults[index] || { errors: [], warnings: [] };
            
            content.innerHTML = `
                <div class="row-details">
                    <div class="row-info mb-3">
                        <div class="alert ${validationResult.errors.length > 0 ? 'alert-danger' : 'alert-success'}">
                            <strong>Registro #${index + 1}</strong>
                            ${validationResult.errors.length > 0 
                                ? `<span class="ms-2 badge bg-danger">${validationResult.errors.length} erro(s)</span>` 
                                : '<span class="ms-2 badge bg-success">Sem erros</span>'}
                            ${validationResult.warnings.length > 0 
                                ? `<span class="ms-2 badge bg-warning text-dark">${validationResult.warnings.length} aviso(s)</span>` 
                                : ''}
                        </div>
                    </div>
                    
                    ${validationResult.errors.length > 0 ? `
                        <div class="row-errors mb-3">
                            <h6>Erros</h6>
                            <ul class="list-group">
                                ${validationResult.errors.map(error => `
                                    <li class="list-group-item list-group-item-danger">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span class="badge bg-danger me-2">${error.code}</span>
                                                ${error.message}
                                            </div>
                                            <span class="badge bg-secondary">${error.field}</span>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${validationResult.warnings.length > 0 ? `
                        <div class="row-warnings mb-3">
                            <h6>Avisos</h6>
                            <ul class="list-group">
                                ${validationResult.warnings.map(warning => `
                                    <li class="list-group-item list-group-item-warning">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span class="badge bg-warning text-dark me-2">${warning.code}</span>
                                                ${warning.message}
                                            </div>
                                            <span class="badge bg-secondary">${warning.field}</span>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="row-data">
                        <h6>Dados</h6>
                        <div class="table-responsive">
                            <table class="table table-sm table-striped">
                                <thead>
                                    <tr>
                                        <th>Campo</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${Object.entries(row).map(([key, value]) => {
                                        // Verifica se o campo tem erro
                                        const hasError = validationResult.errors.some(error => error.field === key);
                                        
                                        return `
                                            <tr class="${hasError ? 'table-danger' : ''}">
                                                <td>${key}</td>
                                                <td>${value !== undefined && value !== null ? value : '<span class="text-muted">-</span>'}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Mostra o modal
        bootstrap.Modal.getInstance(modal).show();
    }
    
    // Mostra o modal de exportação
    function showExportModal() {
        // Cria o modal se não existir
        let modal = document.getElementById('export-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'export-modal';
            modal.className = 'modal fade';
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-hidden', 'true');
            
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Exportar Dados</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <form id="export-form">
                                <div class="mb-3">
                                    <label for="export-format" class="form-label">Formato</label>
                                    <select id="export-format" class="form-select" required>
                                        ${CONFIG.export.formats.map(format => `
                                            <option value="${format}" ${format === CONFIG.export.defaultFormat ? 'selected' : ''}>
                                                ${format.toUpperCase()}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="export-filename" class="form-label">Nome do arquivo</label>
                                    <input type="text" id="export-filename" class="form-control" value="dados_exportados" required>
                                </div>
                                
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="export-include-headers" checked>
                                    <label class="form-check-label" for="export-include-headers">Incluir cabeçalhos</label>
                                </div>
                                
                                <div class="mb-3 form-check">
                                    <input type="checkbox" class="form-check-input" id="export-only-errors">
                                    <label class="form-check-label" for="export-only-errors">Exportar apenas registros com erros</label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="confirm-export-btn">Exportar</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Inicializa o modal Bootstrap
            new bootstrap.Modal(modal);
            
            // Adiciona event listener para o botão de confirmar exportação
            const confirmExportBtn = document.getElementById('confirm-export-btn');
            if (confirmExportBtn) {
                confirmExportBtn.addEventListener('click', handleConfirmExport);
            }
        }
        
        // Mostra o modal
        bootstrap.Modal.getInstance(modal).show();
    }
    
    // Manipula a confirmação de exportação
    function handleConfirmExport() {
        const format = document.getElementById('export-format').value;
        const filename = document.getElementById('export-filename').value;
        const includeHeaders = document.getElementById('export-include-headers').checked;
        const onlyErrors = document.getElementById('export-only-errors').checked;
        
        // Filtra os dados se necessário
        let dataToExport = state.data;
        
        if (onlyErrors) {
            dataToExport = state.data.filter((row, index) => {
                const result = state.validationResults[index];
                return result && result.errors && result.errors.length > 0;
            });
        }
        
        // Exporta os dados
        ExportManager.exportData(dataToExport, {
            format,
            filename,
            includeHeaders,
            columns: CONFIG.tableColumns.map(col => col.field)
        });
        
        // Fecha o modal
        bootstrap.Modal.getInstance(document.getElementById('export-modal')).hide();
    }
    
    // Mostra a seção de resultados
    function showResultsSection() {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.classList.remove('d-none');
            
            // Rola para a seção de resultados
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Mostra o indicador de carregamento
    function showLoading(message = 'Carregando...') {
        // Cria o overlay de carregamento se não existir
        let loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.className = 'loading-overlay';
            
            loadingOverlay.innerHTML = `
                <div class="loading-content">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <div class="loading-message mt-3" id="loading-message"></div>
                </div>
            `;
            
            document.body.appendChild(loadingOverlay);
        }
        
        // Atualiza a mensagem
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
            loadingMessage.textContent = message;
        }
        
        // Mostra o overlay
        loadingOverlay.classList.add('show');
        
        // Desabilita o scroll do body
        document.body.classList.add('loading');
    }
    
    // Esconde o indicador de carregamento
    function hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
        }
        
        // Habilita o scroll do body
        document.body.classList.remove('loading');
    }
    
    // Mostra a barra de progresso
    function showProgressBar() {
        const progressContainer = document.getElementById('progress-container');
        if (!progressContainer) return;
        
        progressContainer.innerHTML = `
            <div class="progress">
                <div id="progress-bar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
        
        progressContainer.classList.remove('d-none');
    }
    
    // Atualiza a barra de progresso
    function updateProgressBar(progress) {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }
    
    // Esconde a barra de progresso
    function hideProgressBar() {
        const progressContainer = document.getElementById('progress-container');
        if (!progressContainer) return;
        
        progressContainer.classList.add('d-none');
    }
    
    // Mostra uma mensagem de erro
    function showError(message) {
        // Cria o toast container se não existir
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Cria o toast
        const toastId = `toast-${Date.now()}`;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.id = toastId;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="toast-header bg-danger text-white">
                <strong class="me-auto">Erro</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Fechar"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Inicializa e mostra o toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove o toast após ser escondido
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
    
    // Retorna a API pública
    return {
        init,
        processFile,
        validateData,
        showError,
        getState: () => ({ ...state })
    };
})();

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
