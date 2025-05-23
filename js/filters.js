/**
 * Arquivo: filters.js
 * Implementação do sistema de filtros avançados para o relatório
 */

// Sistema de Filtros
const FilterSystem = (function() {
    // Estado do sistema de filtros
    const state = {
        data: [],
        filteredData: [],
        columns: [],
        activeFilters: {},
        presets: [],
        history: []
    };
    
    // Inicializa o sistema de filtros
    function init(data, columns) {
        state.data = data || [];
        state.filteredData = [...state.data];
        state.columns = columns || [];
        state.activeFilters = {};
        
        // Carrega os presets salvos
        loadSavedPresets();
        
        // Configura os event listeners
        setupEventListeners();
        
        // Renderiza os filtros
        renderFilters();
        
        return state;
    }
    
    // Configura os event listeners
    function setupEventListeners() {
        // Event listener para o botão de salvar filtros
        const saveFilterBtn = document.getElementById('save-filter-btn');
        if (saveFilterBtn) {
            saveFilterBtn.addEventListener('click', handleSaveFilter);
        }
        
        // Event listener para o botão de limpar filtros
        const clearFilterBtn = document.getElementById('clear-filter-btn');
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', clearAllFilters);
        }
        
        // Event listeners para os inputs de filtro
        document.querySelectorAll('.filter-input').forEach(input => {
            input.addEventListener('input', debounce(handleFilterChange, 300));
        });
        
        // Event listeners para os selects de filtro
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', handleFilterChange);
        });
    }
    
    // Renderiza os filtros
    function renderFilters() {
        // Implementação real dos filtros
        const filterContainer = document.getElementById('filter-container');
        if (!filterContainer) return;
        
        // Limpa o container
        filterContainer.innerHTML = '';
        
        // Cria os filtros para cada coluna
        state.columns.forEach(column => {
            // Cria o elemento de filtro
            const filterElement = document.createElement('div');
            filterElement.className = 'filter-item mb-3';
            
            // Determina o tipo de filtro com base no tipo de dados da coluna
            const dataType = getColumnDataType(column);
            
            // Cria o label
            const label = document.createElement('label');
            label.className = 'form-label';
            label.textContent = column;
            filterElement.appendChild(label);
            
            // Cria o input ou select de acordo com o tipo de dados
            if (dataType === 'select') {
                // Cria um select para valores discretos (como CFOP, CST, etc.)
                const select = document.createElement('select');
                select.className = 'form-select filter-select';
                select.dataset.column = column;
                
                // Adiciona a opção padrão
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = `Selecione ${column}`;
                select.appendChild(defaultOption);
                
                // Obtém os valores únicos para a coluna
                const uniqueValues = getUniqueValues(column);
                
                // Adiciona as opções
                uniqueValues.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });
                
                filterElement.appendChild(select);
            } else {
                // Cria um input para valores contínuos
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control filter-input';
                input.placeholder = `Filtrar por ${column}`;
                input.dataset.column = column;
                
                filterElement.appendChild(input);
            }
            
            // Adiciona o elemento de filtro ao container
            filterContainer.appendChild(filterElement);
        });
        
        // Atualiza os valores dos filtros ativos
        updateFilterValues();
    }
    
    // Atualiza os valores dos filtros ativos
    function updateFilterValues() {
        // Atualiza os inputs
        document.querySelectorAll('.filter-input').forEach(input => {
            const column = input.dataset.column;
            if (state.activeFilters[column]) {
                input.value = state.activeFilters[column].value;
            } else {
                input.value = '';
            }
        });
        
        // Atualiza os selects
        document.querySelectorAll('.filter-select').forEach(select => {
            const column = select.dataset.column;
            if (state.activeFilters[column]) {
                select.value = state.activeFilters[column].value;
            } else {
                select.value = '';
            }
        });
    }
    
    // Manipula a mudança de filtro
    function handleFilterChange(event) {
        const element = event.target;
        const column = element.dataset.column;
        const value = element.value.trim();
        
        // Se o valor estiver vazio, remove o filtro
        if (!value) {
            delete state.activeFilters[column];
        } else {
            // Adiciona ou atualiza o filtro
            state.activeFilters[column] = {
                value,
                type: element.tagName === 'SELECT' ? 'exact' : 'contains'
            };
        }
        
        // Adiciona ao histórico
        addToHistory();
        
        // Aplica os filtros
        applyFilters();
    }
    
    // Manipula o salvamento de filtro
    function handleSaveFilter() {
        // Verifica se há filtros ativos
        if (Object.keys(state.activeFilters).length === 0) {
            showToast('Erro', 'Não há filtros ativos para salvar.', 'error');
            return;
        }
        
        // Pede um nome para o preset
        const presetName = prompt('Digite um nome para este conjunto de filtros:');
        if (!presetName) return;
        
        // Cria o preset
        const preset = {
            id: Date.now(),
            name: presetName,
            filters: { ...state.activeFilters }
        };
        
        // Adiciona o preset à lista
        state.presets.push(preset);
        
        // Salva os presets
        savePresets();
        
        // Atualiza a lista de presets
        updatePresetsList();
        
        showToast('Sucesso', 'Filtros salvos com sucesso!', 'success');
    }
    
    // Aplica os filtros aos dados
    function applyFilters() {
        // Se não houver filtros ativos, retorna todos os dados
        if (Object.keys(state.activeFilters).length === 0) {
            state.filteredData = [...state.data];
        } else {
            // Filtra os dados
            state.filteredData = state.data.filter(row => {
                // Verifica se o registro atende a todos os filtros
                return Object.entries(state.activeFilters).every(([column, filter]) => {
                    const cellValue = row[column];
                    
                    // Se o valor da célula for nulo ou indefinido, não atende ao filtro
                    if (cellValue === null || cellValue === undefined) {
                        return false;
                    }
                    
                    // Converte para string para comparação
                    const cellValueStr = String(cellValue).toLowerCase();
                    const filterValue = String(filter.value).toLowerCase();
                    
                    // Aplica o filtro de acordo com o tipo
                    if (filter.type === 'exact') {
                        return cellValueStr === filterValue;
                    } else if (filter.type === 'contains') {
                        return cellValueStr.includes(filterValue);
                    } else if (filter.type === 'startsWith') {
                        return cellValueStr.startsWith(filterValue);
                    } else if (filter.type === 'endsWith') {
                        return cellValueStr.endsWith(filterValue);
                    } else if (filter.type === 'greater') {
                        return parseFloat(cellValue) > parseFloat(filter.value);
                    } else if (filter.type === 'less') {
                        return parseFloat(cellValue) < parseFloat(filter.value);
                    }
                    
                    return true;
                });
            });
        }
        
        // Dispara o evento de dados filtrados
        dispatchFilteredEvent();
    }
    
    // Dispara o evento de dados filtrados
    function dispatchFilteredEvent() {
        const event = new CustomEvent('dataFiltered', {
            detail: {
                data: state.filteredData,
                filters: state.activeFilters
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // Limpa todos os filtros
    function clearAllFilters() {
        // Limpa os filtros ativos
        state.activeFilters = {};
        
        // Atualiza os valores dos filtros
        updateFilterValues();
        
        // Adiciona ao histórico
        addToHistory();
        
        // Aplica os filtros
        applyFilters();
        
        showToast('Informação', 'Todos os filtros foram limpos.', 'info');
    }
    
    // Carrega um preset de filtros
    function loadPreset(presetId) {
        // Busca o preset
        const preset = state.presets.find(p => p.id === presetId);
        if (!preset) return;
        
        // Aplica os filtros do preset
        state.activeFilters = { ...preset.filters };
        
        // Atualiza os valores dos filtros
        updateFilterValues();
        
        // Adiciona ao histórico
        addToHistory();
        
        // Aplica os filtros
        applyFilters();
        
        showToast('Informação', `Filtros "${preset.name}" carregados.`, 'info');
    }
    
    // Remove um preset de filtros
    function removePreset(presetId) {
        // Remove o preset da lista
        state.presets = state.presets.filter(p => p.id !== presetId);
        
        // Salva os presets
        savePresets();
        
        // Atualiza a lista de presets
        updatePresetsList();
        
        showToast('Informação', 'Preset removido com sucesso.', 'info');
    }
    
    // Atualiza a lista de presets
    function updatePresetsList() {
        const presetsContainer = document.getElementById('presets-container');
        if (!presetsContainer) return;
        
        // Limpa o container
        presetsContainer.innerHTML = '';
        
        // Se não houver presets, mostra uma mensagem
        if (state.presets.length === 0) {
            presetsContainer.innerHTML = '<div class="text-muted">Nenhum preset salvo.</div>';
            return;
        }
        
        // Cria a lista de presets
        const presetsList = document.createElement('div');
        presetsList.className = 'list-group';
        
        // Adiciona os presets
        state.presets.forEach(preset => {
            const presetItem = document.createElement('div');
            presetItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
            
            // Nome do preset
            const presetName = document.createElement('div');
            presetName.textContent = preset.name;
            presetItem.appendChild(presetName);
            
            // Botões de ação
            const actionButtons = document.createElement('div');
            actionButtons.className = 'btn-group';
            
            // Botão de carregar
            const loadButton = document.createElement('button');
            loadButton.className = 'btn btn-sm btn-outline-primary';
            loadButton.innerHTML = '<i class="fas fa-upload"></i>';
            loadButton.title = 'Carregar filtros';
            loadButton.addEventListener('click', () => loadPreset(preset.id));
            actionButtons.appendChild(loadButton);
            
            // Botão de remover
            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-sm btn-outline-danger';
            removeButton.innerHTML = '<i class="fas fa-trash"></i>';
            removeButton.title = 'Remover preset';
            removeButton.addEventListener('click', () => removePreset(preset.id));
            actionButtons.appendChild(removeButton);
            
            presetItem.appendChild(actionButtons);
            
            presetsList.appendChild(presetItem);
        });
        
        presetsContainer.appendChild(presetsList);
    }
    
    // Adiciona o estado atual ao histórico
    function addToHistory() {
        // Cria uma cópia dos filtros ativos
        const historyItem = {
            timestamp: Date.now(),
            filters: { ...state.activeFilters }
        };
        
        // Adiciona ao histórico
        state.history.push(historyItem);
        
        // Limita o histórico a 10 itens
        if (state.history.length > 10) {
            state.history.shift();
        }
    }
    
    // Carrega os presets salvos
    function loadSavedPresets() {
        try {
            const savedPresets = localStorage.getItem('filterPresets');
            if (savedPresets) {
                state.presets = JSON.parse(savedPresets);
                updatePresetsList();
            }
        } catch (e) {
            console.error('Erro ao carregar presets:', e);
        }
    }
    
    // Salva os presets
    function savePresets() {
        try {
            localStorage.setItem('filterPresets', JSON.stringify(state.presets));
        } catch (e) {
            console.error('Erro ao salvar presets:', e);
        }
    }
    
    // Obtém os valores únicos para uma coluna
    function getUniqueValues(column) {
        const values = new Set();
        
        state.data.forEach(row => {
            if (row[column] !== undefined && row[column] !== null) {
                values.add(row[column]);
            }
        });
        
        return Array.from(values).sort();
    }
    
    // Determina o tipo de dados de uma coluna
    function getColumnDataType(column) {
        // Colunas que devem ser tratadas como selects
        const selectColumns = [
            'CFOP',
            'CST ICMS',
            'CST PIS',
            'CST COFINS',
            'Empresa',
            'Local de negócios'
        ];
        
        // Se a coluna estiver na lista de selects, retorna 'select'
        if (selectColumns.includes(column)) {
            return 'select';
        }
        
        // Verifica os valores da coluna para determinar o tipo
        let hasNumeric = false;
        let hasNonNumeric = false;
        let uniqueValues = new Set();
        
        // Verifica até 100 registros para determinar o tipo
        const sampleSize = Math.min(100, state.data.length);
        
        for (let i = 0; i < sampleSize; i++) {
            const value = state.data[i][column];
            
            if (value !== undefined && value !== null) {
                uniqueValues.add(value);
                
                if (!isNaN(parseFloat(value)) && isFinite(value)) {
                    hasNumeric = true;
                } else {
                    hasNonNumeric = true;
                }
            }
        }
        
        // Se tiver poucos valores únicos, usa select
        if (uniqueValues.size <= 10 && uniqueValues.size > 0) {
            return 'select';
        }
        
        // Se tiver apenas valores numéricos, usa number
        if (hasNumeric && !hasNonNumeric) {
            return 'number';
        }
        
        // Por padrão, usa text
        return 'text';
    }
    
    // Função de debounce para evitar muitas chamadas em sequência
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Mostra um toast
    function showToast(title, message, type = 'info') {
        // Implementação simplificada - em produção, usar uma biblioteca de toast
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        
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
        
        // Define a cor do cabeçalho com base no tipo
        let headerClass = 'bg-info';
        if (type === 'success') headerClass = 'bg-success';
        if (type === 'error') headerClass = 'bg-danger';
        if (type === 'warning') headerClass = 'bg-warning';
        
        toast.innerHTML = `
            <div class="toast-header ${headerClass} text-white">
                <strong class="me-auto">${title}</strong>
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
        applyFilters,
        clearAllFilters,
        loadPreset,
        loadSavedPresets,
        getState: () => ({ ...state })
    };
})();

// Exportar o módulo para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterSystem;
} else {
    window.FilterSystem = FilterSystem;
}
