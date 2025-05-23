/**
 * Arquivo: table.js
 * Implementação do componente de tabela avançada com paginação, ordenação e filtros
 */

// Componente de Tabela Avançada
const AdvancedTable = (function() {
    // Estado interno da tabela
    const state = {
        data: [],
        filteredData: [],
        columns: [],
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
        sortColumn: null,
        sortDirection: 'asc',
        tableElement: null,
        paginationElement: null,
        itemsPerPageElement: null,
        tableId: null,
        onRowClick: null,
        selectedRow: null,
        highlightedRows: new Set(),
        errorHighlights: {},
        isLoading: false
    };

    // Opções de itens por página
    const itemsPerPageOptions = [10, 25, 50, 100, 250, 500];

    // Inicializa a tabela
    function init(options) {
        // Mescla as opções com o estado
        Object.assign(state, options);
        
        // Garante que temos um ID para a tabela
        if (!state.tableId) {
            state.tableId = 'advanced-table-' + Date.now();
        }
        
        // Inicializa os dados filtrados
        state.filteredData = [...state.data];
        
        // Calcula o total de páginas
        updateTotalPages();
        
        // Renderiza a tabela
        renderTable();
        
        // Configura os event listeners
        setupEventListeners();
        
        // Escuta eventos de filtro
        document.addEventListener('dataFiltered', handleDataFiltered);
        
        return state;
    }

    // Atualiza o total de páginas
    function updateTotalPages() {
        state.totalPages = Math.max(1, Math.ceil(state.filteredData.length / state.itemsPerPage));
        
        // Ajusta a página atual se necessário
        if (state.currentPage > state.totalPages) {
            state.currentPage = state.totalPages;
        }
    }

    // Renderiza a tabela
    function renderTable() {
        // Cria o elemento da tabela se não existir
        if (!state.tableElement) {
            const tableContainer = document.createElement('div');
            tableContainer.className = 'advanced-table-container';
            tableContainer.innerHTML = `
                <div class="table-controls mb-3">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <div class="items-per-page-container">
                                <label for="items-per-page-${state.tableId}" class="form-label me-2">Itens por página:</label>
                                <select id="items-per-page-${state.tableId}" class="form-select form-select-sm items-per-page-select">
                                    ${itemsPerPageOptions.map(option => 
                                        `<option value="${option}" ${option === state.itemsPerPage ? 'selected' : ''}>${option}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="table-info text-md-end">
                                <span class="table-count">Exibindo <span id="showing-count-${state.tableId}">0</span> de <span id="total-count-${state.tableId}">0</span> registros</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table id="${state.tableId}" class="table table-striped table-hover advanced-table">
                        <thead>
                            <tr></tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                
                <div class="table-pagination mt-3">
                    <nav aria-label="Paginação da tabela">
                        <ul class="pagination pagination-sm justify-content-center" id="pagination-${state.tableId}"></ul>
                    </nav>
                </div>
            `;
            
            // Adiciona a tabela ao DOM
            document.getElementById('table-container').appendChild(tableContainer);
            
            // Armazena as referências aos elementos
            state.tableElement = document.getElementById(state.tableId);
            state.paginationElement = document.getElementById(`pagination-${state.tableId}`);
            state.itemsPerPageElement = document.getElementById(`items-per-page-${state.tableId}`);
        }
        
        // Renderiza o cabeçalho da tabela
        renderTableHeader();
        
        // Renderiza o corpo da tabela
        renderTableBody();
        
        // Renderiza a paginação
        renderPagination();
        
        // Atualiza as contagens
        updateCounts();
    }

    // Renderiza o cabeçalho da tabela
    function renderTableHeader() {
        const headerRow = state.tableElement.querySelector('thead tr');
        headerRow.innerHTML = '';
        
        // Adiciona as colunas
        state.columns.forEach(column => {
            const th = document.createElement('th');
            th.className = column.sortable ? 'sortable' : '';
            th.dataset.column = column.field;
            
            // Adiciona o ícone de ordenação se a coluna for ordenável
            if (column.sortable) {
                let sortIcon = '';
                if (state.sortColumn === column.field) {
                    sortIcon = state.sortDirection === 'asc' ? 
                        '<i class="fas fa-sort-up ms-1"></i>' : 
                        '<i class="fas fa-sort-down ms-1"></i>';
                } else {
                    sortIcon = '<i class="fas fa-sort ms-1 text-muted"></i>';
                }
                
                th.innerHTML = `
                    <div class="d-flex align-items-center">
                        <span>${column.label}</span>
                        ${sortIcon}
                    </div>
                `;
            } else {
                th.textContent = column.label;
            }
            
            headerRow.appendChild(th);
        });
    }

    // Renderiza o corpo da tabela
    function renderTableBody() {
        const tbody = state.tableElement.querySelector('tbody');
        tbody.innerHTML = '';
        
        // Se estiver carregando, mostra o indicador de carregamento
        if (state.isLoading) {
            const loadingRow = document.createElement('tr');
            loadingRow.className = 'loading-row';
            loadingRow.innerHTML = `
                <td colspan="${state.columns.length}" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <div class="mt-2">Carregando dados...</div>
                </td>
            `;
            tbody.appendChild(loadingRow);
            return;
        }
        
        // Se não houver dados, mostra uma mensagem
        if (state.filteredData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';
            emptyRow.innerHTML = `
                <td colspan="${state.columns.length}" class="text-center py-4">
                    <div class="empty-table-message">
                        <i class="fas fa-search fa-2x mb-2 text-muted"></i>
                        <div>Nenhum registro encontrado</div>
                    </div>
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }
        
        // Calcula o índice inicial e final para a página atual
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = Math.min(startIndex + state.itemsPerPage, state.filteredData.length);
        
        // Adiciona as linhas para a página atual
        for (let i = startIndex; i < endIndex; i++) {
            const row = state.filteredData[i];
            const tr = document.createElement('tr');
            
            // Adiciona a classe de selecionado se for a linha selecionada
            if (state.selectedRow === i) {
                tr.classList.add('selected-row');
            }
            
            // Adiciona a classe de destacado se a linha estiver destacada
            if (state.highlightedRows.has(i)) {
                tr.classList.add('highlighted-row');
            }
            
            // Adiciona o atributo de dados para o índice da linha
            tr.dataset.index = i;
            
            // Adiciona as células
            state.columns.forEach(column => {
                const td = document.createElement('td');
                
                // Obtém o valor da célula
                let cellValue = row[column.field];
                
                // Aplica o formatador, se existir
                if (column.formatter) {
                    cellValue = column.formatter(cellValue, row);
                }
                
                // Define o conteúdo da célula
                if (cellValue === undefined || cellValue === null) {
                    td.innerHTML = '<span class="text-muted">-</span>';
                } else {
                    td.textContent = cellValue;
                }
                
                // Adiciona classes de alinhamento
                if (column.align) {
                    td.classList.add(`text-${column.align}`);
                }
                
                // Verifica se há destaque de erro para esta célula
                const rowKey = getRowKey(row);
                if (state.errorHighlights[rowKey] && state.errorHighlights[rowKey][column.field]) {
                    const errorInfo = state.errorHighlights[rowKey][column.field];
                    td.classList.add('error-cell');
                    td.dataset.errorCode = errorInfo.code;
                    td.dataset.errorMessage = errorInfo.message;
                    
                    // Adiciona um ícone de erro com tooltip
                    const originalContent = td.innerHTML;
                    td.innerHTML = `
                        <div class="d-flex align-items-center">
                            <div class="me-2">${originalContent}</div>
                            <i class="fas fa-exclamation-circle text-danger error-icon"></i>
                        </div>
                    `;
                }
                
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        }
        
        // Inicializa os tooltips para os ícones de erro
        const errorIcons = tbody.querySelectorAll('.error-icon');
        errorIcons.forEach(icon => {
            const cell = icon.closest('td');
            const errorCode = cell.dataset.errorCode;
            const errorMessage = cell.dataset.errorMessage;
            
            new bootstrap.Tooltip(icon, {
                title: `[${errorCode}] ${errorMessage}`,
                placement: 'top',
                html: true
            });
        });
    }

    // Renderiza a paginação
    function renderPagination() {
        if (!state.paginationElement) return;
        
        state.paginationElement.innerHTML = '';
        
        // Se não houver dados ou apenas uma página, não mostra a paginação
        if (state.filteredData.length === 0 || state.totalPages <= 1) {
            return;
        }
        
        // Botão para a primeira página
        const firstPageItem = document.createElement('li');
        firstPageItem.className = `page-item ${state.currentPage === 1 ? 'disabled' : ''}`;
        firstPageItem.innerHTML = `
            <button class="page-link" data-page="first" aria-label="Primeira página">
                <i class="fas fa-angle-double-left"></i>
            </button>
        `;
        state.paginationElement.appendChild(firstPageItem);
        
        // Botão para a página anterior
        const prevPageItem = document.createElement('li');
        prevPageItem.className = `page-item ${state.currentPage === 1 ? 'disabled' : ''}`;
        prevPageItem.innerHTML = `
            <button class="page-link" data-page="prev" aria-label="Página anterior">
                <i class="fas fa-angle-left"></i>
            </button>
        `;
        state.paginationElement.appendChild(prevPageItem);
        
        // Determina quais páginas mostrar
        let startPage = Math.max(1, state.currentPage - 2);
        let endPage = Math.min(state.totalPages, startPage + 4);
        
        // Ajusta o startPage se não tivermos 5 páginas para mostrar
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Adiciona os botões para as páginas
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === state.currentPage ? 'active' : ''}`;
            pageItem.innerHTML = `
                <button class="page-link" data-page="${i}">${i}</button>
            `;
            state.paginationElement.appendChild(pageItem);
        }
        
        // Botão para a próxima página
        const nextPageItem = document.createElement('li');
        nextPageItem.className = `page-item ${state.currentPage === state.totalPages ? 'disabled' : ''}`;
        nextPageItem.innerHTML = `
            <button class="page-link" data-page="next" aria-label="Próxima página">
                <i class="fas fa-angle-right"></i>
            </button>
        `;
        state.paginationElement.appendChild(nextPageItem);
        
        // Botão para a última página
        const lastPageItem = document.createElement('li');
        lastPageItem.className = `page-item ${state.currentPage === state.totalPages ? 'disabled' : ''}`;
        lastPageItem.innerHTML = `
            <button class="page-link" data-page="last" aria-label="Última página">
                <i class="fas fa-angle-double-right"></i>
            </button>
        `;
        state.paginationElement.appendChild(lastPageItem);
    }

    // Atualiza as contagens de registros
    function updateCounts() {
        const showingCountElement = document.getElementById(`showing-count-${state.tableId}`);
        const totalCountElement = document.getElementById(`total-count-${state.tableId}`);
        
        if (showingCountElement && totalCountElement) {
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = Math.min(startIndex + state.itemsPerPage, state.filteredData.length);
            const showing = state.filteredData.length > 0 ? `${startIndex + 1}-${endIndex}` : '0';
            
            showingCountElement.textContent = showing;
            totalCountElement.textContent = state.filteredData.length;
        }
    }

    // Configura os event listeners
    function setupEventListeners() {
        // Event listener para cliques na paginação
        if (state.paginationElement) {
            state.paginationElement.addEventListener('click', (e) => {
                const pageButton = e.target.closest('[data-page]');
                if (pageButton) {
                    const page = pageButton.dataset.page;
                    handlePageChange(page);
                }
            });
        }
        
        // Event listener para mudança de itens por página
        if (state.itemsPerPageElement) {
            state.itemsPerPageElement.addEventListener('change', (e) => {
                const newItemsPerPage = parseInt(e.target.value, 10);
                handleItemsPerPageChange(newItemsPerPage);
            });
        }
        
        // Event listener para cliques no cabeçalho (ordenação)
        if (state.tableElement) {
            const headerRow = state.tableElement.querySelector('thead tr');
            headerRow.addEventListener('click', (e) => {
                const th = e.target.closest('th.sortable');
                if (th) {
                    const column = th.dataset.column;
                    handleSort(column);
                }
            });
            
            // Event listener para cliques nas linhas
            const tbody = state.tableElement.querySelector('tbody');
            tbody.addEventListener('click', (e) => {
                const tr = e.target.closest('tr');
                if (tr && tr.dataset.index) {
                    const index = parseInt(tr.dataset.index, 10);
                    handleRowClick(index);
                }
            });
        }
    }

    // Manipula a mudança de página
    function handlePageChange(page) {
        let newPage = state.currentPage;
        
        switch (page) {
            case 'first':
                newPage = 1;
                break;
            case 'prev':
                newPage = Math.max(1, state.currentPage - 1);
                break;
            case 'next':
                newPage = Math.min(state.totalPages, state.currentPage + 1);
                break;
            case 'last':
                newPage = state.totalPages;
                break;
            default:
                newPage = parseInt(page, 10);
        }
        
        if (newPage !== state.currentPage && newPage >= 1 && newPage <= state.totalPages) {
            state.currentPage = newPage;
            renderTableBody();
            renderPagination();
            updateCounts();
            
            // Rola para o topo da tabela
            state.tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Manipula a mudança de itens por página
    function handleItemsPerPageChange(newItemsPerPage) {
        if (newItemsPerPage !== state.itemsPerPage) {
            state.itemsPerPage = newItemsPerPage;
            state.currentPage = 1; // Volta para a primeira página
            updateTotalPages();
            renderTableBody();
            renderPagination();
            updateCounts();
            
            // Salva a preferência no localStorage
            try {
                localStorage.setItem('itemsPerPage', newItemsPerPage);
            } catch (e) {
                console.error('Erro ao salvar preferência de itens por página:', e);
            }
        }
    }

    // Manipula a ordenação
    function handleSort(column) {
        // Se clicar na mesma coluna, inverte a direção
        if (state.sortColumn === column) {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortColumn = column;
            state.sortDirection = 'asc';
        }
        
        // Ordena os dados
        sortData();
        
        // Renderiza a tabela
        renderTableHeader();
        renderTableBody();
        updateCounts();
    }

    // Manipula o clique em uma linha
    function handleRowClick(index) {
        // Atualiza a linha selecionada
        state.selectedRow = index;
        
        // Renderiza o corpo da tabela para atualizar a seleção
        renderTableBody();
        
        // Chama o callback, se existir
        if (state.onRowClick) {
            state.onRowClick(state.filteredData[index], index);
        }
    }

    // Manipula os dados filtrados
    function handleDataFiltered(event) {
        const { data } = event.detail;
        
        // Atualiza os dados filtrados
        state.filteredData = data;
        
        // Volta para a primeira página
        state.currentPage = 1;
        
        // Atualiza o total de páginas
        updateTotalPages();
        
        // Renderiza a tabela
        renderTableBody();
        renderPagination();
        updateCounts();
    }

    // Ordena os dados
    function sortData() {
        if (!state.sortColumn) return;
        
        const column = state.columns.find(col => col.field === state.sortColumn);
        if (!column) return;
        
        state.filteredData.sort((a, b) => {
            let valueA = a[state.sortColumn];
            let valueB = b[state.sortColumn];
            
            // Aplica o sorter personalizado, se existir
            if (column.sorter) {
                return column.sorter(valueA, valueB, a, b) * (state.sortDirection === 'asc' ? 1 : -1);
            }
            
            // Ordenação padrão
            if (valueA === valueB) return 0;
            if (valueA === null || valueA === undefined) return 1;
            if (valueB === null || valueB === undefined) return -1;
            
            // Ordenação por tipo
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return valueA.localeCompare(valueB, 'pt-BR') * (state.sortDirection === 'asc' ? 1 : -1);
            }
            
            return (valueA - valueB) * (state.sortDirection === 'asc' ? 1 : -1);
        });
    }

    // Obtém uma chave única para a linha
    function getRowKey(row) {
        // Tenta usar campos que podem ser únicos
        if (row.id) return `id-${row.id}`;
        if (row['Nº da Nota Fiscal'] && row['Empresa']) return `nf-${row['Nº da Nota Fiscal']}-${row['Empresa']}`;
        if (row['Chave de acesso NFe']) return `chave-${row['Chave de acesso NFe']}`;
        
        // Fallback para um hash dos valores da linha
        return Object.values(row).join('-');
    }

    // Atualiza os dados da tabela
    function updateData(newData) {
        state.data = newData;
        state.filteredData = [...newData];
        state.currentPage = 1;
        updateTotalPages();
        renderTableBody();
        renderPagination();
        updateCounts();
    }

    // Define o estado de carregamento
    function setLoading(isLoading) {
        state.isLoading = isLoading;
        renderTableBody();
    }

    // Destaca uma linha
    function highlightRow(index, highlight = true) {
        if (highlight) {
            state.highlightedRows.add(index);
        } else {
            state.highlightedRows.delete(index);
        }
        renderTableBody();
    }

    // Limpa todos os destaques
    function clearHighlights() {
        state.highlightedRows.clear();
        renderTableBody();
    }

    // Adiciona um destaque de erro para uma célula
    function addErrorHighlight(row, field, errorCode, errorMessage) {
        const rowKey = getRowKey(row);
        
        if (!state.errorHighlights[rowKey]) {
            state.errorHighlights[rowKey] = {};
        }
        
        state.errorHighlights[rowKey][field] = {
            code: errorCode,
            message: errorMessage
        };
        
        renderTableBody();
    }

    // Limpa todos os destaques de erro
    function clearErrorHighlights() {
        state.errorHighlights = {};
        renderTableBody();
    }

    // Retorna a API pública
    return {
        init,
        updateData,
        setLoading,
        highlightRow,
        clearHighlights,
        addErrorHighlight,
        clearErrorHighlights,
        getState: () => ({ ...state }),
        getCurrentPage: () => state.currentPage,
        getTotalPages: () => state.totalPages,
        getItemsPerPage: () => state.itemsPerPage,
        getSelectedRow: () => state.selectedRow ? state.filteredData[state.selectedRow] : null
    };
})();

// Exportar o módulo para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedTable;
} else {
    window.AdvancedTable = AdvancedTable;
}
