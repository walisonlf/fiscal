/**
 * Arquivo: validator.js
 * Implementação do validador de planilhas fiscais com regras completas
 */

// Validador de Planilhas Fiscais
const Validator = (function() {
    // Configuração do validador
    let config = {
        cfopRules: [],
        cstIcmsRules: [],
        cstPisCofinsRules: [],
        useCache: true
    };
    
    // Cache de resultados
    const validationCache = new Map();
    
    // Inicializa o validador
    function init(options = {}) {
        // Mescla as opções com a configuração padrão
        config = { ...config, ...options };
        
        // Carrega as regras padrão se não foram fornecidas
        if (!config.cfopRules || config.cfopRules.length === 0) {
            config.cfopRules = DefaultRules.cfopRules;
        }
        
        if (!config.cstIcmsRules || config.cstIcmsRules.length === 0) {
            config.cstIcmsRules = DefaultRules.cstIcmsRules;
        }
        
        if (!config.cstPisCofinsRules || config.cstPisCofinsRules.length === 0) {
            config.cstPisCofinsRules = DefaultRules.cstPisCofinsRules;
        }
        
        console.log('Validador inicializado com', 
            config.cfopRules.length, 'regras de CFOP,',
            config.cstIcmsRules.length, 'regras de CST ICMS e',
            config.cstPisCofinsRules.length, 'regras de CST PIS/COFINS');
        
        return { validate };
    }
    
    // Atualiza as regras do validador
    function updateRules(rules = {}) {
        if (rules.cfopRules) config.cfopRules = rules.cfopRules;
        if (rules.cstIcmsRules) config.cstIcmsRules = rules.cstIcmsRules;
        if (rules.cstPisCofinsRules) config.cstPisCofinsRules = rules.cstPisCofinsRules;
        
        // Limpa o cache ao atualizar as regras
        validationCache.clear();
        
        console.log('Regras do validador atualizadas');
    }
    
    // Valida um registro
    function validate(row) {
        // Verifica se o resultado está em cache
        if (config.useCache) {
            const cacheKey = getCacheKey(row);
            if (validationCache.has(cacheKey)) {
                return validationCache.get(cacheKey);
            }
        }
        
        // Resultado da validação
        const result = {
            valid: true,
            errors: [],
            warnings: []
        };
        
        // Valida as regras de CFOP
        validateCfopRules(row, result);
        
        // Valida as regras de CST ICMS
        validateCstIcmsRules(row, result);
        
        // Valida as regras de CST PIS/COFINS
        validateCstPisCofinsRules(row, result);
        
        // Atualiza o status de validade
        result.valid = result.errors.length === 0;
        
        // Armazena o resultado em cache
        if (config.useCache) {
            const cacheKey = getCacheKey(row);
            validationCache.set(cacheKey, result);
        }
        
        return result;
    }
    
    // Valida as regras de CFOP
    function validateCfopRules(row, result) {
        const cfop = row['CFOP'];
        
        // Verifica se o CFOP existe
        if (!cfop) {
            result.errors.push({
                code: 'CFOP001',
                field: 'CFOP',
                message: 'CFOP não informado'
            });
            return;
        }
        
        // Busca a regra para o CFOP
        const rule = config.cfopRules.find(r => r.cfop === cfop);
        
        // Se não encontrou regra, adiciona um aviso
        if (!rule) {
            result.warnings.push({
                code: 'CFOP002',
                field: 'CFOP',
                message: `Não há regras definidas para o CFOP ${cfop}`
            });
            return;
        }
        
        // Valida as condições da regra
        if (rule.conditions) {
            rule.conditions.forEach(condition => {
                validateCondition(condition, row, result, 'CFOP');
            });
        }
    }
    
    // Valida as regras de CST ICMS
    function validateCstIcmsRules(row, result) {
        const cst = row['CST ICMS'];
        
        // Verifica se o CST ICMS existe
        if (!cst) {
            result.errors.push({
                code: 'CSTICMS001',
                field: 'CST ICMS',
                message: 'CST ICMS não informado'
            });
            return;
        }
        
        // Busca a regra para o CST ICMS
        const rule = config.cstIcmsRules.find(r => r.cst === cst);
        
        // Se não encontrou regra, adiciona um aviso
        if (!rule) {
            result.warnings.push({
                code: 'CSTICMS002',
                field: 'CST ICMS',
                message: `Não há regras definidas para o CST ICMS ${cst}`
            });
            return;
        }
        
        // Valida as condições da regra
        if (rule.conditions) {
            rule.conditions.forEach(condition => {
                validateCondition(condition, row, result, 'CST ICMS');
            });
        }
    }
    
    // Valida as regras de CST PIS/COFINS
    function validateCstPisCofinsRules(row, result) {
        // Valida CST PIS
        validateCstPisCofins(row, 'CST PIS', 'PIS', result);
        
        // Valida CST COFINS
        validateCstPisCofins(row, 'CST COFINS', 'COFINS', result);
    }
    
    // Valida um CST PIS ou COFINS específico
    function validateCstPisCofins(row, cstField, taxType, result) {
        const cst = row[cstField];
        
        // Verifica se o CST existe
        if (!cst) {
            result.errors.push({
                code: `CST${taxType}001`,
                field: cstField,
                message: `${cstField} não informado`
            });
            return;
        }
        
        // Busca a regra para o CST
        const rule = config.cstPisCofinsRules.find(r => r.cst === cst && (r.type === taxType || !r.type));
        
        // Se não encontrou regra, adiciona um aviso
        if (!rule) {
            result.warnings.push({
                code: `CST${taxType}002`,
                field: cstField,
                message: `Não há regras definidas para o ${cstField} ${cst}`
            });
            return;
        }
        
        // Valida as condições da regra
        if (rule.conditions) {
            rule.conditions.forEach(condition => {
                validateCondition(condition, row, result, cstField);
            });
        }
        
        // Verifica se há exceções e se o registro se enquadra em alguma
        if (rule.exceptions) {
            const matchesException = rule.exceptions.some(exception => {
                // Verifica se todas as condições da exceção são atendidas
                return exception.conditions.every(condition => {
                    return evaluateCondition(condition, row);
                });
            });
            
            // Se não se enquadra em nenhuma exceção, valida as condições normais
            if (!matchesException && rule.conditions) {
                rule.conditions.forEach(condition => {
                    validateCondition(condition, row, result, cstField);
                });
            }
        }
    }
    
    // Valida uma condição
    function validateCondition(condition, row, result, contextField) {
        const { field, operator, value, errorCode, errorMessage, warningCode, warningMessage } = condition;
        
        // Verifica se a condição é atendida
        const conditionMet = evaluateCondition(condition, row);
        
        // Se a condição não for atendida e houver código de erro, adiciona o erro
        if (!conditionMet && errorCode) {
            result.errors.push({
                code: errorCode,
                field: field || contextField,
                message: errorMessage || `Valor inválido para ${field}`
            });
        }
        
        // Se a condição não for atendida e houver código de aviso, adiciona o aviso
        if (!conditionMet && warningCode) {
            result.warnings.push({
                code: warningCode,
                field: field || contextField,
                message: warningMessage || `Valor suspeito para ${field}`
            });
        }
    }
    
    // Avalia uma condição
    function evaluateCondition(condition, row) {
        const { field, operator, value, or, and } = condition;
        
        // Se for uma condição composta com OR
        if (or && Array.isArray(or)) {
            return or.some(subCondition => evaluateCondition(subCondition, row));
        }
        
        // Se for uma condição composta com AND
        if (and && Array.isArray(and)) {
            return and.every(subCondition => evaluateCondition(subCondition, row));
        }
        
        // Obtém o valor do campo no registro
        const fieldValue = row[field];
        
        // Avalia a condição com base no operador
        switch (operator) {
            case 'eq':
                return fieldValue == value;
            case 'neq':
                return fieldValue != value;
            case 'gt':
                return parseFloat(fieldValue) > parseFloat(value);
            case 'gte':
                return parseFloat(fieldValue) >= parseFloat(value);
            case 'lt':
                return parseFloat(fieldValue) < parseFloat(value);
            case 'lte':
                return parseFloat(fieldValue) <= parseFloat(value);
            case 'in':
                return Array.isArray(value) && value.includes(fieldValue);
            case 'nin':
                return Array.isArray(value) && !value.includes(fieldValue);
            case 'contains':
                return typeof fieldValue === 'string' && fieldValue.includes(value);
            case 'startsWith':
                return typeof fieldValue === 'string' && fieldValue.startsWith(value);
            case 'endsWith':
                return typeof fieldValue === 'string' && fieldValue.endsWith(value);
            case 'empty':
                return fieldValue === undefined || fieldValue === null || fieldValue === '';
            case 'notEmpty':
                return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
            case 'regex':
                return new RegExp(value).test(fieldValue);
            case 'function':
                // Avalia uma função personalizada
                if (typeof value === 'function') {
                    return value(fieldValue, row);
                }
                return false;
            default:
                console.warn(`Operador desconhecido: ${operator}`);
                return false;
        }
    }
    
    // Obtém uma chave de cache para o registro
    function getCacheKey(row) {
        // Usa campos-chave para identificar o registro
        const keyFields = [
            'Empresa',
            'Nº da Nota Fiscal',
            'CFOP',
            'CST ICMS',
            'CST PIS',
            'CST COFINS'
        ];
        
        // Constrói a chave com os valores dos campos
        return keyFields.map(field => `${field}:${row[field] || ''}`).join('|');
    }
    
    // Retorna a API pública
    return {
        init,
        validate,
        updateRules
    };
})();

// Exportar o módulo para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validator;
} else {
    window.Validator = Validator;
}
