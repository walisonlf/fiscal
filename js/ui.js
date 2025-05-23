/**
 * Arquivo: ui.js
 * Implementa componentes de interface e melhorias de experiência do usuário
 */

// Importar dependências
let Utils, CONFIG, ThemeSystem;

// Verificar ambiente de execução
if (typeof module !== 'undefined' && module.exports) {
    Utils = require('./utils');
    CONFIG = require('./config');
    ThemeSystem = require('./theme');
} else {
    Utils = window.Utils;
    CONFIG = window.CONFIG;
    ThemeSystem = window.ThemeSystem;
}

/**
 * Classe que implementa componentes de interface e melhorias de UX
 */
class UISystem {
    /**
     * Construtor do sistema de UI
     */
    constructor() {
        this.theme = new ThemeSystem();
        this.isMobile = window.innerWidth < CONFIG.ui.breakpoints.mobile;
        this.isTablet = window.innerWidth < CONFIG.ui.breakpoints.tablet && window.innerWidth >= CONFIG.ui.breakpoints.mobile;
        
        // Inicializar componentes
        this.init();
    }
    
    /**
     * Inicializa o sistema de UI
     */
    init() {
        // Adicionar classe ao body para identificar o dispositivo
        this.updateDeviceClasses();
        
        // Configurar responsividade
        this.setupResponsiveness();
        
        // Configurar atalhos de teclado
        this.theme.setupKeyboardShortcuts();
        
        // Adicionar tooltips
        this.theme.addTooltips();
        
        // Inicializar componentes
        this.initComponents();
    }
    
    /**
     * Atualiza as classes no body para identificar o tipo de dispositivo
     */
    updateDeviceClasses() {
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
            document.body.classList.remove('tablet-device', 'desktop-device');
        } else if (this.isTablet) {
            document.body.classList.add('tablet-device');
            document.body.classList.remove('mobile-device', 'desktop-device');
        } else {
            document.body.classList.add('desktop-device');
            document.body.classList.remove('mobile-device', 'tablet-device');
        }
    }
    
    /**
     * Configura a responsividade
     */
    setupResponsiveness() {
        // Adicionar listener para redimensionamento da janela
        window.addEventListener('resize', Utils.debounce(() => {
            // Atualizar flags de dispositivo
            this.isMobile = window.innerWidth < CONFIG.ui.breakpoints.mobile;
            this.isTablet = window.innerWidth < CONFIG.ui.breakpoints.tablet && window.innerWidth >= CONFIG.ui.breakpoints.mobile;
            
            // Atualizar classes
            this.updateDeviceClasses();
            
            // Disparar evento personalizado
            const event = new CustomEvent('responsive-update', {
                detail: {
                    isMobile: this.isMobile,
                    isTablet: this.isTablet,
                    isDesktop: !this.isMobile && !this.isTablet
                }
            });
            
            document.dispatchEvent(event);
        }, 250));
    }
    
    /**
     * Inicializa componentes de UI
     */
    initComponents() {
        // Inicializar dropdowns
        this.initDropdowns();
        
        // Inicializar modais
        this.initModals();
        
        // Inicializar tabs
        this.initTabs();
        
        // Inicializar accordions
        this.initAccordions();
    }
    
    /**
     * Inicializa dropdowns
     */
    initDropdowns() {
        const dropdownToggles = document.querySelectorAll('[data-toggle="dropdown"]');
        
        dropdownToggles.forEach(toggle => {
            // Verificar se já foi inicializado
            if (toggle.hasAttribute('data-dropdown-initialized')) {
                return;
            }
            
            // Marcar como inicializado
            toggle.setAttribute('data-dropdown-initialized', 'true');
            
            // Obter o target
            const targetId = toggle.getAttribute('data-target');
            const target = document.querySelector(targetId);
            
            if (!target) return;
            
            // Adicionar evento de clique
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Fechar outros dropdowns
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    if (menu !== target) {
                        menu.classList.remove('show');
                    }
                });
                
                // Alternar visibilidade
                target.classList.toggle('show');
            });
        });
        
        // Fechar dropdowns ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-menu') && !e.target.closest('[data-toggle="dropdown"]')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });
    }
    
    /**
     * Inicializa modais
     */
    initModals() {
        const modalToggles = document.querySelectorAll('[data-toggle="modal"]');
        
        modalToggles.forEach(toggle => {
            // Verificar se já foi inicializado
            if (toggle.hasAttribute('data-modal-initialized')) {
                return;
            }
            
            // Marcar como inicializado
            toggle.setAttribute('data-modal-initialized', 'true');
            
            // Obter o target
            const targetId = toggle.getAttribute('data-target');
            const target = document.querySelector(targetId);
            
            if (!target) return;
            
            // Adicionar evento de clique
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(target);
            });
            
            // Adicionar evento para fechar
            const closeBtns = target.querySelectorAll('[data-dismiss="modal"]');
            closeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeModal(target);
                });
            });
            
            // Fechar ao clicar no backdrop
            target.addEventListener('click', (e) => {
                if (e.target === target) {
                    this.closeModal(target);
                }
            });
            
            // Fechar com Escape
            target.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal(target);
                }
            });
        });
    }
    
    /**
     * Abre um modal
     * @param {HTMLElement} modal - Elemento do modal
     */
    openModal(modal) {
        // Adicionar backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);
        
        // Mostrar o modal
        modal.classList.add('show');
        modal.style.display = 'block';
        
        // Adicionar classe ao body
        document.body.classList.add('modal-open');
        
        // Focar no primeiro elemento focável
        setTimeout(() => {
            const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable.length > 0) {
                focusable[0].focus();
            }
        }, 100);
        
        // Disparar evento
        const event = new CustomEvent('modal-opened', {
            detail: { modal }
        });
        
        document.dispatchEvent(event);
    }
    
    /**
     * Fecha um modal
     * @param {HTMLElement} modal - Elemento do modal
     */
    closeModal(modal) {
        // Remover backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        
        // Esconder o modal
        modal.classList.remove('show');
        modal.style.display = 'none';
        
        // Remover classe do body
        document.body.classList.remove('modal-open');
        
        // Disparar evento
        const event = new CustomEvent('modal-closed', {
            detail: { modal }
        });
        
        document.dispatchEvent(event);
    }
    
    /**
     * Inicializa tabs
     */
    initTabs() {
        const tabToggles = document.querySelectorAll('[data-toggle="tab"]');
        
        tabToggles.forEach(toggle => {
            // Verificar se já foi inicializado
            if (toggle.hasAttribute('data-tab-initialized')) {
                return;
            }
            
            // Marcar como inicializado
            toggle.setAttribute('data-tab-initialized', 'true');
            
            // Adicionar evento de clique
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Obter o target
                const targetId = toggle.getAttribute('data-target');
                const target = document.querySelector(targetId);
                
                if (!target) return;
                
                // Obter o container de tabs
                const tabContainer = toggle.closest('.tabs');
                if (!tabContainer) return;
                
                // Remover classe active de todas as tabs
                tabContainer.querySelectorAll('[data-toggle="tab"]').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Adicionar classe active à tab clicada
                toggle.classList.add('active');
                
                // Obter o container de conteúdo
                const contentContainer = document.querySelector(toggle.getAttribute('data-content-container'));
                if (!contentContainer) return;
                
                // Esconder todos os conteúdos
                contentContainer.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                    pane.classList.remove('show');
                });
                
                // Mostrar o conteúdo da tab clicada
                target.classList.add('active');
                
                // Adicionar animação
                setTimeout(() => {
                    target.classList.add('show');
                }, 10);
                
                // Disparar evento
                const event = new CustomEvent('tab-changed', {
                    detail: {
                        tab: toggle,
                        content: target
                    }
                });
                
                document.dispatchEvent(event);
            });
        });
    }
    
    /**
     * Inicializa accordions
     */
    initAccordions() {
        const accordionToggles = document.querySelectorAll('[data-toggle="accordion"]');
        
        accordionToggles.forEach(toggle => {
            // Verificar se já foi inicializado
            if (toggle.hasAttribute('data-accordion-initialized')) {
                return;
            }
            
            // Marcar como inicializado
            toggle.setAttribute('data-accordion-initialized', 'true');
            
            // Adicionar evento de clique
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Obter o target
                const targetId = toggle.getAttribute('data-target');
                const target = document.querySelector(targetId);
                
                if (!target) return;
                
                // Obter o container de accordion
                const accordionContainer = toggle.closest('.accordion');
                if (!accordionContainer) return;
                
                // Verificar se é para fechar outros itens
                const closeOthers = accordionContainer.hasAttribute('data-close-others') && 
                                   accordionContainer.getAttribute('data-close-others') !== 'false';
                
                if (closeOthers) {
                    // Fechar outros itens
                    accordionContainer.querySelectorAll('.accordion-item').forEach(item => {
                        if (item !== toggle.closest('.accordion-item')) {
                            const itemToggle = item.querySelector('[data-toggle="accordion"]');
                            const itemContent = item.querySelector('.accordion-content');
                            
                            if (itemToggle && itemContent) {
                                itemToggle.classList.remove('active');
                                itemContent.style.maxHeight = null;
                                itemContent.classList.remove('show');
                            }
                        }
                    });
                }
                
                // Alternar visibilidade
                toggle.classList.toggle('active');
                
                if (toggle.classList.contains('active')) {
                    target.style.maxHeight = target.scrollHeight + 'px';
                    target.classList.add('show');
                } else {
                    target.style.maxHeight = null;
                    target.classList.remove('show');
                }
                
                // Disparar evento
                const event = new CustomEvent('accordion-toggled', {
                    detail: {
                        toggle,
                        content: target,
                        isOpen: toggle.classList.contains('active')
                    }
                });
                
                document.dispatchEvent(event);
            });
        });
    }
    
    /**
     * Cria um modal dinamicamente
     * @param {Object} options - Opções do modal
     * @returns {HTMLElement} Elemento do modal
     */
    createModal(options = {}) {
        const defaults = {
            id: 'dynamic-modal-' + Date.now(),
            title: 'Modal',
            content: '',
            size: 'medium', // small, medium, large
            buttons: [
                {
                    text: 'Fechar',
                    type: 'secondary',
                    dismiss: true
                }
            ],
            onOpen: null,
            onClose: null
        };
        
        const settings = { ...defaults, ...options };
        
        // Criar o elemento do modal
        const modal = document.createElement('div');
        modal.className = `modal fade ${settings.size}`;
        modal.id = settings.id;
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', `${settings.id}-title`);
        modal.setAttribute('aria-hidden', 'true');
        
        // Criar o conteúdo do modal
        modal.innerHTML = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${settings.id}-title">${settings.title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${settings.content}
                    </div>
                    <div class="modal-footer">
                        ${settings.buttons.map(button => `
                            <button type="button" class="btn btn-${button.type}" ${button.dismiss ? 'data-dismiss="modal"' : ''}>
                                ${button.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar ao body
        document.body.appendChild(modal);
        
        // Adicionar eventos aos botões
        settings.buttons.forEach((button, index) => {
            const buttonElement = modal.querySelectorAll('.modal-footer .btn')[index];
            
            if (buttonElement && button.onClick) {
                buttonElement.addEventListener('click', (e) => {
                    button.onClick(e, modal);
                });
            }
        });
        
        // Adicionar eventos de abertura e fechamento
        if (settings.onOpen) {
            document.addEventListener('modal-opened', (e) => {
                if (e.detail.modal === modal) {
                    settings.onOpen(modal);
                }
            });
        }
        
        if (settings.onClose) {
            document.addEventListener('modal-closed', (e) => {
                if (e.detail.modal === modal) {
                    settings.onClose(modal);
                }
            });
        }
        
        // Inicializar o modal
        this.initModals();
        
        return modal;
    }
    
    /**
     * Exibe uma caixa de diálogo de confirmação
     * @param {Object} options - Opções da caixa de diálogo
     * @returns {Promise} Promise que resolve com true (confirmado) ou false (cancelado)
     */
    confirm(options = {}) {
        const defaults = {
            title: 'Confirmação',
            message: 'Tem certeza que deseja continuar?',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            confirmType: 'primary',
            cancelType: 'secondary'
        };
        
        const settings = { ...defaults, ...options };
        
        return new Promise((resolve) => {
            const modal = this.createModal({
                title: settings.title,
                content: `<p>${settings.message}</p>`,
                buttons: [
                    {
                        text: settings.cancelText,
                        type: settings.cancelType,
                        dismiss: true,
                        onClick: () => resolve(false)
                    },
                    {
                        text: settings.confirmText,
                        type: settings.confirmType,
                        dismiss: true,
                        onClick: () => resolve(true)
                    }
                ]
            });
            
            // Abrir o modal
            this.openModal(modal);
        });
    }
    
    /**
     * Exibe uma caixa de diálogo de alerta
     * @param {Object} options - Opções da caixa de diálogo
     * @returns {Promise} Promise que resolve quando o alerta é fechado
     */
    alert(options = {}) {
        const defaults = {
            title: 'Alerta',
            message: 'Esta é uma mensagem de alerta.',
            buttonText: 'OK',
            buttonType: 'primary'
        };
        
        const settings = { ...defaults, ...options };
        
        return new Promise((resolve) => {
            const modal = this.createModal({
                title: settings.title,
                content: `<p>${settings.message}</p>`,
                buttons: [
                    {
                        text: settings.buttonText,
                        type: settings.buttonType,
                        dismiss: true,
                        onClick: () => resolve()
                    }
                ]
            });
            
            // Abrir o modal
            this.openModal(modal);
        });
    }
    
    /**
     * Exibe uma caixa de diálogo de prompt
     * @param {Object} options - Opções da caixa de diálogo
     * @returns {Promise} Promise que resolve com o valor digitado ou null se cancelado
     */
    prompt(options = {}) {
        const defaults = {
            title: 'Prompt',
            message: 'Digite um valor:',
            defaultValue: '',
            confirmText: 'OK',
            cancelText: 'Cancelar',
            confirmType: 'primary',
            cancelType: 'secondary',
            inputType: 'text',
            placeholder: ''
        };
        
        const settings = { ...defaults, ...options };
        
        return new Promise((resolve) => {
            const inputId = 'prompt-input-' + Date.now();
            
            const modal = this.createModal({
                title: settings.title,
                content: `
                    <p>${settings.message}</p>
                    <div class="form-group">
                        <input type="${settings.inputType}" class="form-control" id="${inputId}" value="${settings.defaultValue}" placeholder="${settings.placeholder}">
                    </div>
                `,
                buttons: [
                    {
                        text: settings.cancelText,
                        type: settings.cancelType,
                        dismiss: true,
                        onClick: () => resolve(null)
                    },
                    {
                        text: settings.confirmText,
                        type: settings.confirmType,
                        dismiss: true,
                        onClick: () => {
                            const input = document.getElementById(inputId);
                            resolve(input ? input.value : null);
                        }
                    }
                ],
                onOpen: () => {
                    // Focar no input
                    const input = document.getElementById(inputId);
                    if (input) {
                        input.focus();
                        input.select();
                    }
                }
            });
            
            // Abrir o modal
            this.openModal(modal);
        });
    }
    
    /**
     * Exibe uma notificação toast
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo de notificação (success, error, warning, info)
     * @param {number} duration - Duração em ms
     */
    showToast(message, type = 'info', duration = CONFIG.ui.toast.duration) {
        this.theme.showToast(message, type, duration);
    }
    
    /**
     * Alterna entre modo claro e escuro
     */
    toggleDarkMode() {
        this.theme.toggleDarkMode();
    }
}

// Exportar a classe para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UISystem;
} else {
    window.UISystem = UISystem;
}
