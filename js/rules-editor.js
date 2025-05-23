/**
 * Arquivo: rules-editor.js
 * Implementação do editor de regras de validação com interface avançada
 */

// Editor de Regras
const RulesEditor = (function() {
    // Estado do editor
    const state = {
        ruleSets: [],
        currentRuleSet: null,
        activeTab: 'cfop',
        isDirty: false
    };
    
    // Tipos de regras suportados
    const ruleTypes = {
        cfop: 'Regras por CFOP',
        cst_icms: 'Regras por CST ICMS',
        cst_pis_cofins: 'Regras por CST PIS/COFINS'
    };
    
    // Operadores de condição suportados
    const operators = {
        eq: 'Igual a',
        neq: 'Diferente de',
        gt: 'Maior que',
        gte: 'Maior ou igual a',
        lt: 'Menor que',
        lte: 'Menor ou igual a',
        in: 'Está em (lista)',
        nin: 'Não está em (lista)',
        contains: 'Contém',
        startsWith: 'Começa com',
        endsWith: 'Termina com',
        empty: 'Está vazio',
        notEmpty: 'Não está vazio',
        regex: 'Corresponde à regex'
    };
    
    // Inicializa o editor de regras
    function init() {
        // Carrega os conjuntos de regras salvos
        loadSavedRuleSets();
        
        // Configura os event listeners
        setupEventListeners();
        
        // Renderiza o editor
        renderEditor();
        
        return state;
    }
    
    // Configura os event listeners
    function setupEventListeners() {
        // Event listener para as abas
        document.querySelectorAll('#rules-editor-tabs .nav-link').forEach(tab => {
            tab.addEventListener('click', handleTabChange);
        });
        
        // Event listener para o botão de adicionar regra
        const addRuleBtn = document.getElementById('add-rule-btn');
        if (addRuleBtn) {
            addRuleBtn.addEventListener('click', handleAddRule);
        }
        
        // Event listener para o botão de salvar regras
        const saveRulesBtn = document.getElementById('save-rules-btn');
        if (saveRulesBtn) {
            saveRulesBtn.addEventListener('click', handleSaveRules);
        }
        
        // Event listener para o botão de exportar regras
        const exportRulesBtn = document.getElementById('export-rules-btn');
        if (exportRulesBtn) {
            exportRulesBtn.addEventListener('click', handleExportRules);
        }
        
        // Event listener para o botão de importar regras
        const importRulesBtn = document.getElementById('import-rules-btn');
        if (importRulesBtn) {
            importRulesBtn.addEventListener('click', () => document.getElementById('import-rules-input').click());
        }
        
        // Event listener para o input de importação
        const importRulesInput = document.getElementById('import-rules-input');
        if (importRulesInput) {
            importRulesInput.addEventListener('change', handleImportRules);
        }
    }
    
    // Manipula a mudança de aba
    function handleTabChange(event) {
        const tabId = event.target.dataset.tab;
        state.activeTab = tabId;
        renderEditorContent();
    }
    
    // Manipula o clique no botão de adicionar regra
    function handleAddRule() {
        // Cria uma nova regra vazia
        const newRule = createEmptyRule(state.activeTab);
        
        // Adiciona a regra ao conjunto atual
        if (!state.currentRuleSet) {
            state.currentRuleSet = { id: Date.now(), name: 'Conjunto Padrão', rules: [] };
            state.ruleSets.push(state.currentRuleSet);
        }
        
        state.currentRuleSet.rules.push(newRule);
        state.isDirty = true;
        
        // Renderiza o conteúdo do editor
        renderEditorContent();
    }
    
    // Manipula o clique no botão de salvar regras
    function handleSaveRules() {
        if (!state.currentRuleSet) {
            showToast('Erro', 'Nenhum conjunto de regras ativo para salvar.', 'error');
            return;
        }
        
        // Salva o conjunto de regras atual
        saveRuleSet(state.currentRuleSet);
        
        // Dispara o evento de regras alteradas
        dispatchRulesChangedEvent();
        
        state.isDirty = false;
        showToast('Sucesso', 'Regras salvas com sucesso!', 'success');
    }
    
    // Manipula o clique no botão de exportar regras
    function handleExportRules() {
        if (!state.currentRuleSet) {
            showToast('Erro', 'Nenhum conjunto de regras ativo para exportar.', 'error');
            return;
        }
        
        // Converte as regras para JSON
        const rulesJson = JSON.stringify(state.currentRuleSet, null, 2);
        
        // Cria um blob com o JSON
        const blob = new Blob([rulesJson], { type: 'application/json' });
        
        // Cria um link para download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `regras_${state.currentRuleSet.name.replace(/\s+/g, '_') || 'exportadas'}.json`;
        
        // Simula o clique no link
        document.body.appendChild(link);
        link.click();
        
        // Limpa o link e a URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('Sucesso', 'Regras exportadas com sucesso!', 'success');
    }
    
    // Manipula a importação de regras
    function handleImportRules(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedRuleSet = JSON.parse(e.target.result);
                
                // Valida o formato do conjunto de regras importado
                if (!isValidRuleSet(importedRuleSet)) {
                    throw new Error('Formato de arquivo inválido.');
                }
                
                // Adiciona ou atualiza o conjunto de regras
                const existingIndex = state.ruleSets.findIndex(rs => rs.id === importedRuleSet.id);
                if (existingIndex !== -1) {
                    state.ruleSets[existingIndex] = importedRuleSet;
                } else {
                    state.ruleSets.push(importedRuleSet);
                }
                
                // Define como conjunto atual
                state.currentRuleSet = importedRuleSet;
                state.isDirty = true;
                
                // Renderiza o editor
                renderEditor();
                
                showToast('Sucesso', 'Regras importadas com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao importar regras:', error);
                showToast('Erro', `Erro ao importar regras: ${error.message}`, 'error');
            }
        };
        
        reader.readAsText(file);
        
        // Limpa o input para permitir importar o mesmo arquivo novamente
        event.target.value = null;
    }
    
    // Renderiza o editor completo
    function renderEditor() {
        // Renderiza a lista de conjuntos de regras
        renderRuleSetList();
        
        // Renderiza o conteúdo do editor
        renderEditorContent();
    }
    
    // Renderiza a lista de conjuntos de regras
    function renderRuleSetList() {
        const ruleSetList = document.getElementById('rule-set-list');
        if (!ruleSetList) return;
        
        ruleSetList.innerHTML = 
            '<option value="">Selecione um conjunto de regras</option>';
        
        state.ruleSets.forEach(ruleSet => {
            const option = document.createElement('option');
            option.value = ruleSet.id;
            option.textContent = ruleSet.name;
            if (state.currentRuleSet && state.currentRuleSet.id === ruleSet.id) {
                option.selected = true;
            }
            ruleSetList.appendChild(option);
        });
        
        // Adiciona event listener para mudança de conjunto de regras
        ruleSetList.addEventListener('change', (event) => {
            const ruleSetId = event.target.value;
            if (ruleSetId) {
                state.currentRuleSet = state.ruleSets.find(rs => rs.id == ruleSetId);
            } else {
                state.currentRuleSet = null;
            }
            state.isDirty = false;
            renderEditorContent();
        });
    }
    
    // Renderiza o conteúdo do editor (regras da aba ativa)
    function renderEditorContent() {
        const editorContent = document.getElementById('rules-editor-content');
        if (!editorContent) return;
        
        // Limpa o conteúdo anterior
        editorContent.innerHTML = 
            '<div class="text-muted">Selecione um conjunto de regras para editar.</div>';
        
        // Se não houver conjunto de regras selecionado, retorna
        if (!state.currentRuleSet) return;
        
        // Filtra as regras para a aba ativa
        const rules = state.currentRuleSet.rules.filter(rule => rule.type === state.activeTab);
        
        // Renderiza as regras
        if (rules.length === 0) {
            editorContent.innerHTML = 
                '<div class="text-muted">Nenhuma regra encontrada para esta categoria.</div>';
        } else {
            editorContent.innerHTML = 
                rules.map((rule, index) => renderRule(rule, index)).join(
                    '<hr class="my-4">'
                );
            
            // Adiciona event listeners para os elementos das regras
            setupRuleEventListeners(editorContent);
        }
    }
    
    // Renderiza uma regra individual
    function renderRule(rule, index) {
        return `
            <div class="rule-item card mb-3" data-index="${index}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="card-title mb-0">Regra ${index + 1}</h5>
                        <button class="btn btn-sm btn-outline-danger remove-rule-btn" title="Remover regra">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    
                    ${renderRuleIdentifier(rule)}
                    
                    <h6>Condições (Se)</h6>
                    <div class="conditions-container mb-3">
                        ${rule.conditions.map((condition, condIndex) => 
                            renderCondition(condition, index, condIndex, 'conditions')
                        ).join(
                            '<div class="text-center my-2">E</div>'
                        )}
                    </div>
                    <button class="btn btn-sm btn-outline-success add-condition-btn" data-type="conditions">
                        <i class="fas fa-plus"></i> Adicionar Condição (Se)
                    </button>
                    
                    ${rule.type === 'cst_pis_cofins' ? `
                        <h6 class="mt-4">Exceções (Se Não)</h6>
                        <div class="exceptions-container mb-3">
                            ${rule.exceptions ? rule.exceptions.map((exception, excIndex) => 
                                renderException(exception, index, excIndex)
                            ).join(
                                '<hr class="my-3">'
                            ) : 
                            '<div class="text-muted">Nenhuma exceção definida.</div>'}
                        </div>
                        <button class="btn btn-sm btn-outline-warning add-exception-btn">
                            <i class="fas fa-plus"></i> Adicionar Exceção (Se Não)
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Renderiza o identificador da regra (CFOP ou CST)
    function renderRuleIdentifier(rule) {
        let identifierField = '';
        let identifierLabel = '';
        
        switch (rule.type) {
            case 'cfop':
                identifierField = 'cfop';
                identifierLabel = 'CFOP';
                break;
            case 'cst_icms':
                identifierField = 'cst';
                identifierLabel = 'CST ICMS';
                break;
            case 'cst_pis_cofins':
                identifierField = 'cst';
                identifierLabel = 'CST PIS/COFINS';
                break;
        }
        
        return `
            <div class="mb-3">
                <label class="form-label">${identifierLabel}</label>
                <input type="text" class="form-control rule-identifier" 
                       value="${rule[identifierField] || ''}" 
                       data-field="${identifierField}" required>
            </div>
        `;
    }
    
    // Renderiza uma condição
    function renderCondition(condition, ruleIndex, condIndex, type) {
        return `
            <div class="condition-item card card-body bg-light mb-2" data-index="${condIndex}" data-type="${type}">
                <div class="row g-2 align-items-center">
                    <div class="col-md-4">
                        <label class="form-label">Campo</label>
                        <input type="text" class="form-control form-control-sm condition-field" 
                               value="${condition.field || ''}" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Operador</label>
                        <select class="form-select form-select-sm condition-operator" required>
                            ${Object.entries(operators).map(([key, label]) => `
                                <option value="${key}" ${condition.operator === key ? 'selected' : ''}>${label}</option>
                            `).join(
                                ''
                            )}
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Valor</label>
                        <input type="text" class="form-control form-control-sm condition-value" 
                               value="${condition.value || ''}">
                    </div>
                    <div class="col-md-1 text-end">
                        <button class="btn btn-sm btn-outline-danger remove-condition-btn" title="Remover condição">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                ${type === 'conditions' ? `
                    <div class="row g-2 mt-2">
                        <div class="col-md-6">
                            <label class="form-label">Código de Erro (Opcional)</label>
                            <input type="text" class="form-control form-control-sm condition-error-code" 
                                   value="${condition.errorCode || ''}">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Mensagem de Erro (Opcional)</label>
                            <input type="text" class="form-control form-control-sm condition-error-message" 
                                   value="${condition.errorMessage || ''}">
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Renderiza uma exceção
    function renderException(exception, ruleIndex, excIndex) {
        return `
            <div class="exception-item card card-body bg-light mb-2" data-index="${excIndex}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Exceção ${excIndex + 1}</h6>
                    <button class="btn btn-sm btn-outline-danger remove-exception-btn" title="Remover exceção">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="exception-conditions-container">
                    ${exception.conditions.map((condition, condIndex) => 
                        renderCondition(condition, ruleIndex, condIndex, `exceptions[${excIndex}]`)
                    ).join(
                        '<div class="text-center my-2">E</div>'
                    )}
                </div>
                <button class="btn btn-sm btn-outline-secondary add-exception-condition-btn mt-2">
                    <i class="fas fa-plus"></i> Adicionar Condição à Exceção
                </button>
            </div>
        `;
    }
    
    // Configura os event listeners para os elementos das regras
    function setupRuleEventListeners(container) {
        // Remover regra
        container.querySelectorAll('.remove-rule-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const ruleItem = event.target.closest('.rule-item');
                const index = parseInt(ruleItem.dataset.index, 10);
                removeRule(index);
            });
        });
        
        // Adicionar condição (Se)
        container.querySelectorAll('.add-condition-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const ruleItem = event.target.closest('.rule-item');
                const index = parseInt(ruleItem.dataset.index, 10);
                addCondition(index, 'conditions');
            });
        });
        
        // Remover condição
        container.querySelectorAll('.remove-condition-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const conditionItem = event.target.closest('.condition-item');
                const ruleItem = event.target.closest('.rule-item');
                const ruleIndex = parseInt(ruleItem.dataset.index, 10);
                const condIndex = parseInt(conditionItem.dataset.index, 10);
                const type = conditionItem.dataset.type;
                removeCondition(ruleIndex, condIndex, type);
            });
        });
        
        // Adicionar exceção (Se Não)
        container.querySelectorAll('.add-exception-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const ruleItem = event.target.closest('.rule-item');
                const index = parseInt(ruleItem.dataset.index, 10);
                addException(index);
            });
        });
        
        // Remover exceção
        container.querySelectorAll('.remove-exception-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const exceptionItem = event.target.closest('.exception-item');
                const ruleItem = event.target.closest('.rule-item');
                const ruleIndex = parseInt(ruleItem.dataset.index, 10);
                const excIndex = parseInt(exceptionItem.dataset.index, 10);
                removeException(ruleIndex, excIndex);
            });
        });
        
        // Adicionar condição à exceção
        container.querySelectorAll('.add-exception-condition-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const exceptionItem = event.target.closest('.exception-item');
                const ruleItem = event.target.closest('.rule-item');
                const ruleIndex = parseInt(ruleItem.dataset.index, 10);
                const excIndex = parseInt(exceptionItem.dataset.index, 10);
                addCondition(ruleIndex, `exceptions[${excIndex}]`);
            });
        });
        
        // Atualizar regra ao mudar inputs
        container.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('change', (event) => {
                updateRuleFromInput(event.target);
            });
        });
    }
    
    // Atualiza a regra com base na mudança de um input
    function updateRuleFromInput(element) {
        const ruleItem = element.closest('.rule-item');
        if (!ruleItem) return;
        
        const ruleIndex = parseInt(ruleItem.dataset.index, 10);
        const rule = state.currentRuleSet.rules[ruleIndex];
        
        // Atualiza o identificador da regra
        if (element.classList.contains('rule-identifier')) {
            rule[element.dataset.field] = element.value;
        }
        
        // Atualiza uma condição
        const conditionItem = element.closest('.condition-item');
        if (conditionItem) {
            const condIndex = parseInt(conditionItem.dataset.index, 10);
            const type = conditionItem.dataset.type;
            
            let condition;
            if (type === 'conditions') {
                condition = rule.conditions[condIndex];
            } else if (type.startsWith('exceptions')) {
                const match = type.match(/exceptions\[(\d+)\]/);
                if (match) {
                    const excIndex = parseInt(match[1], 10);
                    condition = rule.exceptions[excIndex].conditions[condIndex];
                }
            }
            
            if (condition) {
                if (element.classList.contains('condition-field')) condition.field = element.value;
                if (element.classList.contains('condition-operator')) condition.operator = element.value;
                if (element.classList.contains('condition-value')) condition.value = element.value;
                if (element.classList.contains('condition-error-code')) condition.errorCode = element.value;
                if (element.classList.contains('condition-error-message')) condition.errorMessage = element.value;
            }
        }
        
        state.isDirty = true;
    }
    
    // Remove uma regra
    function removeRule(index) {
        if (!state.currentRuleSet) return;
        
        state.currentRuleSet.rules.splice(index, 1);
        state.isDirty = true;
        renderEditorContent();
    }
    
    // Adiciona uma condição
    function addCondition(ruleIndex, type) {
        if (!state.currentRuleSet) return;
        
        const rule = state.currentRuleSet.rules[ruleIndex];
        const newCondition = { field: '', operator: 'eq', value: '' };
        
        if (type === 'conditions') {
            rule.conditions.push(newCondition);
        } else if (type.startsWith('exceptions')) {
            const match = type.match(/exceptions\[(\d+)\]/);
            if (match) {
                const excIndex = parseInt(match[1], 10);
                rule.exceptions[excIndex].conditions.push(newCondition);
            }
        }
        
        state.isDirty = true;
        renderEditorContent();
    }
    
    // Remove uma condição
    function removeCondition(ruleIndex, condIndex, type) {
        if (!state.currentRuleSet) return;
        
        const rule = state.currentRuleSet.rules[ruleIndex];
        
        if (type === 'conditions') {
            rule.conditions.splice(condIndex, 1);
        } else if (type.startsWith('exceptions')) {
            const match = type.match(/exceptions\[(\d+)\]/);
            if (match) {
                const excIndex = parseInt(match[1], 10);
                rule.exceptions[excIndex].conditions.splice(condIndex, 1);
            }
        }
        
        state.isDirty = true;
        renderEditorContent();
    }
    
    // Adiciona uma exceção
    function addException(ruleIndex) {
        if (!state.currentRuleSet) return;
        
        const rule = state.currentRuleSet.rules[ruleIndex];
        if (!rule.exceptions) {
            rule.exceptions = [];
        }
        
        rule.exceptions.push({ conditions: [{ field: '', operator: 'eq', value: '' }] });
        state.isDirty = true;
        renderEditorContent();
    }
    
    // Remove uma exceção
    function removeException(ruleIndex, excIndex) {
        if (!state.currentRuleSet || !state.currentRuleSet.rules[ruleIndex].exceptions) return;
        
        state.currentRuleSet.rules[ruleIndex].exceptions.splice(excIndex, 1);
        state.isDirty = true;
        renderEditorContent();
    }
    
    // Cria uma regra vazia
    function createEmptyRule(type) {
        const rule = { type, conditions: [{ field: '', operator: 'eq', value: '' }] };
        
        switch (type) {
            case 'cfop':
                rule.cfop = '';
                break;
            case 'cst_icms':
                rule.cst = '';
                break;
            case 'cst_pis_cofins':
                rule.cst = '';
                rule.taxType = 'PIS'; // Padrão para PIS
                rule.exceptions = [];
                break;
        }
        
        return rule;
    }
    
    // Carrega os conjuntos de regras salvos
    function loadSavedRuleSets() {
        try {
            const savedRuleSets = localStorage.getItem('ruleSets');
            if (savedRuleSets) {
                state.ruleSets = JSON.parse(savedRuleSets);
                
                // Define o primeiro conjunto como atual, se existir
                if (state.ruleSets.length > 0) {
                    state.currentRuleSet = state.ruleSets[0];
                }
            } else {
                // Cria um conjunto padrão se não houver nenhum salvo
                state.currentRuleSet = { 
                    id: Date.now(), 
                    name: 'Conjunto Padrão', 
                    rules: [
                        ...DefaultRules.cfopRules.map(r => ({ ...r, type: 'cfop' })),
                        ...DefaultRules.cstIcmsRules.map(r => ({ ...r, type: 'cst_icms' })),
                        ...DefaultRules.cstPisCofinsRules.map(r => ({ ...r, type: 'cst_pis_cofins' }))
                    ]
                };
                state.ruleSets.push(state.currentRuleSet);
                saveRuleSet(state.currentRuleSet);
            }
        } catch (e) {
            console.error('Erro ao carregar conjuntos de regras:', e);
            state.ruleSets = [];
            state.currentRuleSet = null;
        }
    }
    
    // Salva um conjunto de regras
    function saveRuleSet(ruleSet) {
        // Atualiza o conjunto na lista
        const index = state.ruleSets.findIndex(rs => rs.id === ruleSet.id);
        if (index !== -1) {
            state.ruleSets[index] = ruleSet;
        } else {
            state.ruleSets.push(ruleSet);
        }
        
        // Salva todos os conjuntos no localStorage
        try {
            localStorage.setItem('ruleSets', JSON.stringify(state.ruleSets));
        } catch (e) {
            console.error('Erro ao salvar conjuntos de regras:', e);
        }
    }
    
    // Valida o formato de um conjunto de regras
    function isValidRuleSet(ruleSet) {
        return ruleSet && ruleSet.id && ruleSet.name && Array.isArray(ruleSet.rules);
    }
    
    // Dispara o evento de regras alteradas
    function dispatchRulesChangedEvent() {
        if (!state.currentRuleSet) return;
        
        const event = new CustomEvent('rulesChanged', {
            detail: {
                rules: state.currentRuleSet.rules
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // Mostra um toast
    function showToast(title, message, type = 'info') {
        // Reutiliza a função de toast do FilterSystem ou App
        if (typeof FilterSystem !== 'undefined' && FilterSystem.showToast) {
            FilterSystem.showToast(title, message, type);
        } else if (typeof App !== 'undefined' && App.showToast) {
            App.showToast(title, message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        }
    }
    
    // Retorna a API pública
    return {
        init,
        loadSavedRuleSets,
        getState: () => ({ ...state })
    };
})();

// Exportar o módulo para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RulesEditor;
} else {
    window.RulesEditor = RulesEditor;
}
