/**
 * Arquivo: rules-integration.js
 * Integração completa das regras de validação fiscal
 */

// Regras de validação fiscal
const FiscalRules = (function() {
    // Regras carregadas do arquivo de texto
    const rules = {
        // Regras para CFOP
        cfop: {
            "1101": {
                description: "Compra para industrialização",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 1101" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 1101" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 1101" }
                ]
            },
            "1102": {
                description: "Compra para comercialização",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 1102" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 1102" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 1102" }
                ]
            },
            "1124": {
                description: "Industrialização efetuada por outra empresa",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 1124" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 1124" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 1124" }
                ]
            },
            "1201": {
                description: "Devolução de venda de produção do estabelecimento",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 1201" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 1201" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 1201" }
                ]
            },
            "1202": {
                description: "Devolução de venda de mercadoria adquirida ou recebida de terceiros",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 1202" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 1202" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 1202" }
                ]
            },
            "1411": {
                description: "Devolução de venda de produção do estabelecimento em operação com produto sujeito ao regime de substituição tributária",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 1411" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 1411" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 1411" }
                ]
            },
            "1551": {
                description: "Compra de bem para o ativo imobilizado",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 1551" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 1551" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 1551" }
                ]
            },
            "1556": {
                description: "Compra de material para uso ou consumo",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 1556" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 1556" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 1556" }
                ]
            },
            "2101": {
                description: "Compra para industrialização",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 2101" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 2101" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 2101" }
                ]
            },
            "2102": {
                description: "Compra para comercialização",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 2102" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 2102" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 2102" }
                ]
            },
            "2201": {
                description: "Devolução de venda de produção do estabelecimento",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 2201" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 2201" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 2201" }
                ]
            },
            "2202": {
                description: "Devolução de venda de mercadoria adquirida ou recebida de terceiros",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 2202" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 2202" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 2202" }
                ]
            },
            "2551": {
                description: "Compra de bem para o ativo imobilizado",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 2551" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 2551" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 2551" }
                ]
            },
            "2556": {
                description: "Compra de material para uso ou consumo",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "90"], message: "CST ICMS inválido para CFOP 2556" },
                    { field: "CST PIS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST PIS inválido para CFOP 2556" },
                    { field: "CST COFINS", values: ["50", "51", "52", "53", "54", "55", "56"], message: "CST COFINS inválido para CFOP 2556" }
                ]
            },
            "5101": {
                description: "Venda de produção do estabelecimento",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 5101" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 5101" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 5101" }
                ]
            },
            "5102": {
                description: "Venda de mercadoria adquirida ou recebida de terceiros",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 5102" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 5102" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 5102" }
                ]
            },
            "5201": {
                description: "Devolução de compra para industrialização",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 5201" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 5201" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 5201" }
                ]
            },
            "5202": {
                description: "Devolução de compra para comercialização",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 5202" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 5202" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 5202" }
                ]
            },
            "5551": {
                description: "Venda de bem do ativo imobilizado",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 5551" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 5551" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 5551" }
                ]
            },
            "5556": {
                description: "Venda de material de uso ou consumo",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 5556" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 5556" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 5556" }
                ]
            },
            "6101": {
                description: "Venda de produção do estabelecimento",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 6101" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 6101" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 6101" }
                ]
            },
            "6102": {
                description: "Venda de mercadoria adquirida ou recebida de terceiros",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 6102" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 6102" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 6102" }
                ]
            },
            "6201": {
                description: "Devolução de compra para industrialização",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 6201" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 6201" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 6201" }
                ]
            },
            "6202": {
                description: "Devolução de compra para comercialização",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 6202" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 6202" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 6202" }
                ]
            },
            "6551": {
                description: "Venda de bem do ativo imobilizado",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 6551" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 6551" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 6551" }
                ]
            },
            "6556": {
                description: "Venda de material de uso ou consumo",
                validations: [
                    { field: "CST ICMS", values: ["00", "10", "20", "30", "40", "41", "50", "51", "60", "70", "90"], message: "CST ICMS inválido para CFOP 6556" },
                    { field: "CST PIS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST PIS inválido para CFOP 6556" },
                    { field: "CST COFINS", values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], message: "CST COFINS inválido para CFOP 6556" }
                ]
            }
        },
        
        // Regras para CST ICMS
        cst_icms: {
            "00": {
                description: "Tributada integralmente",
                validations: [
                    { field: "Base ICMS", condition: "value > 0", message: "Base ICMS deve ser maior que zero para CST ICMS 00" },
                    { field: "Valor ICMS", condition: "value > 0", message: "Valor ICMS deve ser maior que zero para CST ICMS 00" }
                ]
            },
            "10": {
                description: "Tributada e com cobrança do ICMS por substituição tributária",
                validations: [
                    { field: "Base ICMS", condition: "value > 0", message: "Base ICMS deve ser maior que zero para CST ICMS 10" },
                    { field: "Valor ICMS", condition: "value > 0", message: "Valor ICMS deve ser maior que zero para CST ICMS 10" },
                    { field: "Base ICMS_ST", condition: "value > 0", message: "Base ICMS_ST deve ser maior que zero para CST ICMS 10" },
                    { field: "Valor ICMS_ST", condition: "value > 0", message: "Valor ICMS_ST deve ser maior que zero para CST ICMS 10" }
                ]
            },
            "20": {
                description: "Com redução de base de cálculo",
                validations: [
                    { field: "Base ICMS", condition: "value > 0", message: "Base ICMS deve ser maior que zero para CST ICMS 20" },
                    { field: "Valor ICMS", condition: "value > 0", message: "Valor ICMS deve ser maior que zero para CST ICMS 20" }
                ]
            },
            "30": {
                description: "Isenta ou não tributada e com cobrança do ICMS por substituição tributária",
                validations: [
                    { field: "Base ICMS", condition: "value == 0", message: "Base ICMS deve ser zero para CST ICMS 30" },
                    { field: "Valor ICMS", condition: "value == 0", message: "Valor ICMS deve ser zero para CST ICMS 30" },
                    { field: "Base ICMS_ST", condition: "value > 0", message: "Base ICMS_ST deve ser maior que zero para CST ICMS 30" },
                    { field: "Valor ICMS_ST", condition: "value > 0", message: "Valor ICMS_ST deve ser maior que zero para CST ICMS 30" }
                ]
            },
            "40": {
                description: "Isenta",
                validations: [
                    { field: "Base ICMS", condition: "value == 0", message: "Base ICMS deve ser zero para CST ICMS 40" },
                    { field: "Valor ICMS", condition: "value == 0", message: "Valor ICMS deve ser zero para CST ICMS 40" }
                ]
            },
            "41": {
                description: "Não tributada",
                validations: [
                    { field: "Base ICMS", condition: "value == 0", message: "Base ICMS deve ser zero para CST ICMS 41" },
                    { field: "Valor ICMS", condition: "value == 0", message: "Valor ICMS deve ser zero para CST ICMS 41" }
                ]
            },
            "50": {
                description: "Suspensão",
                validations: [
                    { field: "Base ICMS", condition: "value == 0", message: "Base ICMS deve ser zero para CST ICMS 50" },
                    { field: "Valor ICMS", condition: "value == 0", message: "Valor ICMS deve ser zero para CST ICMS 50" }
                ]
            },
            "51": {
                description: "Diferimento",
                validations: [
                    { field: "Base ICMS", condition: "value >= 0", message: "Base ICMS deve ser maior ou igual a zero para CST ICMS 51" },
                    { field: "Valor ICMS", condition: "value >= 0", message: "Valor ICMS deve ser maior ou igual a zero para CST ICMS 51" }
                ]
            },
            "60": {
                description: "ICMS cobrado anteriormente por substituição tributária",
                validations: [
                    { field: "Base ICMS", condition: "value == 0", message: "Base ICMS deve ser zero para CST ICMS 60" },
                    { field: "Valor ICMS", condition: "value == 0", message: "Valor ICMS deve ser zero para CST ICMS 60" }
                ]
            },
            "70": {
                description: "Com redução de base de cálculo e cobrança do ICMS por substituição tributária",
                validations: [
                    { field: "Base ICMS", condition: "value > 0", message: "Base ICMS deve ser maior que zero para CST ICMS 70" },
                    { field: "Valor ICMS", condition: "value > 0", message: "Valor ICMS deve ser maior que zero para CST ICMS 70" },
                    { field: "Base ICMS_ST", condition: "value > 0", message: "Base ICMS_ST deve ser maior que zero para CST ICMS 70" },
                    { field: "Valor ICMS_ST", condition: "value > 0", message: "Valor ICMS_ST deve ser maior que zero para CST ICMS 70" }
                ]
            },
            "90": {
                description: "Outras",
                validations: [
                    { field: "Base ICMS", condition: "value >= 0", message: "Base ICMS deve ser maior ou igual a zero para CST ICMS 90" },
                    { field: "Valor ICMS", condition: "value >= 0", message: "Valor ICMS deve ser maior ou igual a zero para CST ICMS 90" }
                ]
            }
        },
        
        // Regras para CST PIS/COFINS
        cst_pis_cofins: {
            "01": {
                description: "Operação Tributável com Alíquota Básica",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 01" },
                    { field: "Aliquota PIS", condition: "value > 0", message: "Aliquota PIS deve ser maior que zero para CST PIS 01" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 01" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 01" },
                    { field: "Aliquota COFINS", condition: "value > 0", message: "Aliquota COFINS deve ser maior que zero para CST COFINS 01" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 01" }
                ]
            },
            "02": {
                description: "Operação Tributável com Alíquota Diferenciada",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 02" },
                    { field: "Aliquota PIS", condition: "value > 0", message: "Aliquota PIS deve ser maior que zero para CST PIS 02" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 02" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 02" },
                    { field: "Aliquota COFINS", condition: "value > 0", message: "Aliquota COFINS deve ser maior que zero para CST COFINS 02" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 02" }
                ]
            },
            "03": {
                description: "Operação Tributável com Alíquota por Unidade de Medida de Produto",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 03" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 03" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 03" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 03" }
                ]
            },
            "04": {
                description: "Operação Tributável Monofásica - Revenda a Alíquota Zero",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 04" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 04" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 04" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 04" }
                ]
            },
            "05": {
                description: "Operação Tributável por Substituição Tributária",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 05" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 05" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 05" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 05" }
                ]
            },
            "06": {
                description: "Operação Tributável a Alíquota Zero",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 06" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 06" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 06" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 06" }
                ]
            },
            "07": {
                description: "Operação Isenta da Contribuição",
                validations: [
                    { field: "Base PIS", condition: "value == 0", message: "Base PIS deve ser zero para CST PIS 07" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 07" },
                    { field: "Base COFINS", condition: "value == 0", message: "Base COFINS deve ser zero para CST COFINS 07" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 07" }
                ]
            },
            "08": {
                description: "Operação sem Incidência da Contribuição",
                validations: [
                    { field: "Base PIS", condition: "value == 0", message: "Base PIS deve ser zero para CST PIS 08" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 08" },
                    { field: "Base COFINS", condition: "value == 0", message: "Base COFINS deve ser zero para CST COFINS 08" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 08" }
                ]
            },
            "09": {
                description: "Operação com Suspensão da Contribuição",
                validations: [
                    { field: "Base PIS", condition: "value == 0", message: "Base PIS deve ser zero para CST PIS 09" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 09" },
                    { field: "Base COFINS", condition: "value == 0", message: "Base COFINS deve ser zero para CST COFINS 09" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 09" }
                ]
            },
            "49": {
                description: "Outras Operações de Saída",
                validations: [
                    { field: "Base PIS", condition: "value >= 0", message: "Base PIS deve ser maior ou igual a zero para CST PIS 49" },
                    { field: "Valor PIS", condition: "value >= 0", message: "Valor PIS deve ser maior ou igual a zero para CST PIS 49" },
                    { field: "Base COFINS", condition: "value >= 0", message: "Base COFINS deve ser maior ou igual a zero para CST COFINS 49" },
                    { field: "Valor COFINS", condition: "value >= 0", message: "Valor COFINS deve ser maior ou igual a zero para CST COFINS 49" }
                ]
            },
            "50": {
                description: "Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 50" },
                    { field: "Aliquota PIS", condition: "value > 0", message: "Aliquota PIS deve ser maior que zero para CST PIS 50" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 50" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 50" },
                    { field: "Aliquota COFINS", condition: "value > 0", message: "Aliquota COFINS deve ser maior que zero para CST COFINS 50" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 50" }
                ]
            },
            "51": {
                description: "Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 51" },
                    { field: "Aliquota PIS", condition: "value > 0", message: "Aliquota PIS deve ser maior que zero para CST PIS 51" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 51" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 51" },
                    { field: "Aliquota COFINS", condition: "value > 0", message: "Aliquota COFINS deve ser maior que zero para CST COFINS 51" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 51" }
                ]
            },
            "52": {
                description: "Operação com Direito a Crédito - Vinculada Exclusivamente a Receita de Exportação",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 52" },
                    { field: "Aliquota PIS", condition: "value > 0", message: "Aliquota PIS deve ser maior que zero para CST PIS 52" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 52" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 52" },
                    { field: "Aliquota COFINS", condition: "value > 0", message: "Aliquota COFINS deve ser maior que zero para CST COFINS 52" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 52" }
                ]
            },
            "53": {
                description: "Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 53" },
                    { field: "Aliquota PIS", condition: "value > 0", message: "Aliquota PIS deve ser maior que zero para CST PIS 53" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 53" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 53" },
                    { field: "Aliquota COFINS", condition: "value > 0", message: "Aliquota COFINS deve ser maior que zero para CST COFINS 53" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 53" }
                ]
            },
            "54": {
                description: "Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 54" },
                    { field: "Aliquota PIS", condition: "value > 0", message: "Aliquota PIS deve ser maior que zero para CST PIS 54" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 54" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 54" },
                    { field: "Aliquota COFINS", condition: "value > 0", message: "Aliquota COFINS deve ser maior que zero para CST COFINS 54" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 54" }
                ]
            },
            "55": {
                description: "Operação com Direito a Crédito - Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 55" },
                    { field: "Aliquota PIS", condition: "value > 0", message: "Aliquota PIS deve ser maior que zero para CST PIS 55" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 55" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 55" },
                    { field: "Aliquota COFINS", condition: "value > 0", message: "Aliquota COFINS deve ser maior que zero para CST COFINS 55" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 55" }
                ]
            },
            "56": {
                description: "Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 56" },
                    { field: "Aliquota PIS", condition: "value > 0", message: "Aliquota PIS deve ser maior que zero para CST PIS 56" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 56" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 56" },
                    { field: "Aliquota COFINS", condition: "value > 0", message: "Aliquota COFINS deve ser maior que zero para CST COFINS 56" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 56" }
                ]
            },
            "60": {
                description: "Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 60" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 60" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 60" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 60" }
                ]
            },
            "61": {
                description: "Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 61" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 61" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 61" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 61" }
                ]
            },
            "62": {
                description: "Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 62" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 62" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 62" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 62" }
                ]
            },
            "63": {
                description: "Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 63" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 63" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 63" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 63" }
                ]
            },
            "64": {
                description: "Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 64" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 64" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 64" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 64" }
                ]
            },
            "65": {
                description: "Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 65" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 65" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 65" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 65" }
                ]
            },
            "66": {
                description: "Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 66" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 66" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 66" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 66" }
                ]
            },
            "67": {
                description: "Crédito Presumido - Outras Operações",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 67" },
                    { field: "Valor PIS", condition: "value > 0", message: "Valor PIS deve ser maior que zero para CST PIS 67" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 67" },
                    { field: "Valor COFINS", condition: "value > 0", message: "Valor COFINS deve ser maior que zero para CST COFINS 67" }
                ]
            },
            "70": {
                description: "Operação de Aquisição sem Direito a Crédito",
                validations: [
                    { field: "Base PIS", condition: "value == 0", message: "Base PIS deve ser zero para CST PIS 70" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 70" },
                    { field: "Base COFINS", condition: "value == 0", message: "Base COFINS deve ser zero para CST COFINS 70" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 70" }
                ]
            },
            "71": {
                description: "Operação de Aquisição com Isenção",
                validations: [
                    { field: "Base PIS", condition: "value == 0", message: "Base PIS deve ser zero para CST PIS 71" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 71" },
                    { field: "Base COFINS", condition: "value == 0", message: "Base COFINS deve ser zero para CST COFINS 71" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 71" }
                ]
            },
            "72": {
                description: "Operação de Aquisição com Suspensão",
                validations: [
                    { field: "Base PIS", condition: "value == 0", message: "Base PIS deve ser zero para CST PIS 72" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 72" },
                    { field: "Base COFINS", condition: "value == 0", message: "Base COFINS deve ser zero para CST COFINS 72" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 72" }
                ]
            },
            "73": {
                description: "Operação de Aquisição a Alíquota Zero",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 73" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 73" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 73" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 73" }
                ]
            },
            "74": {
                description: "Operação de Aquisição sem Incidência da Contribuição",
                validations: [
                    { field: "Base PIS", condition: "value == 0", message: "Base PIS deve ser zero para CST PIS 74" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 74" },
                    { field: "Base COFINS", condition: "value == 0", message: "Base COFINS deve ser zero para CST COFINS 74" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 74" }
                ]
            },
            "75": {
                description: "Operação de Aquisição por Substituição Tributária",
                validations: [
                    { field: "Base PIS", condition: "value > 0", message: "Base PIS deve ser maior que zero para CST PIS 75" },
                    { field: "Valor PIS", condition: "value == 0", message: "Valor PIS deve ser zero para CST PIS 75" },
                    { field: "Base COFINS", condition: "value > 0", message: "Base COFINS deve ser maior que zero para CST COFINS 75" },
                    { field: "Valor COFINS", condition: "value == 0", message: "Valor COFINS deve ser zero para CST COFINS 75" }
                ]
            },
            "98": {
                description: "Outras Operações de Entrada",
                validations: [
                    { field: "Base PIS", condition: "value >= 0", message: "Base PIS deve ser maior ou igual a zero para CST PIS 98" },
                    { field: "Valor PIS", condition: "value >= 0", message: "Valor PIS deve ser maior ou igual a zero para CST PIS 98" },
                    { field: "Base COFINS", condition: "value >= 0", message: "Base COFINS deve ser maior ou igual a zero para CST COFINS 98" },
                    { field: "Valor COFINS", condition: "value >= 0", message: "Valor COFINS deve ser maior ou igual a zero para CST COFINS 98" }
                ]
            },
            "99": {
                description: "Outras Operações",
                validations: [
                    { field: "Base PIS", condition: "value >= 0", message: "Base PIS deve ser maior ou igual a zero para CST PIS 99" },
                    { field: "Valor PIS", condition: "value >= 0", message: "Valor PIS deve ser maior ou igual a zero para CST PIS 99" },
                    { field: "Base COFINS", condition: "value >= 0", message: "Base COFINS deve ser maior ou igual a zero para CST COFINS 99" },
                    { field: "Valor COFINS", condition: "value >= 0", message: "Valor COFINS deve ser maior ou igual a zero para CST COFINS 99" }
                ]
            }
        }
    };
    
    // Função para validar um registro com base nas regras
    function validateRecord(record) {
        const errors = [];
        const warnings = [];
        
        // Validação por CFOP
        if (record.CFOP && rules.cfop[record.CFOP]) {
            const cfopRules = rules.cfop[record.CFOP];
            
            cfopRules.validations.forEach(validation => {
                const fieldValue = record[validation.field];
                
                // Verifica se o valor está na lista de valores válidos
                if (validation.values && !validation.values.includes(fieldValue)) {
                    errors.push({
                        field: validation.field,
                        message: validation.message,
                        code: `CFOP_${record.CFOP}_${validation.field}`
                    });
                }
            });
        } else if (record.CFOP) {
            // CFOP não encontrado nas regras
            warnings.push({
                field: 'CFOP',
                message: `CFOP ${record.CFOP} não possui regras de validação definidas`,
                code: 'CFOP_UNKNOWN'
            });
        }
        
        // Validação por CST ICMS
        if (record['CST ICMS'] && rules.cst_icms[record['CST ICMS']]) {
            const cstIcmsRules = rules.cst_icms[record['CST ICMS']];
            
            cstIcmsRules.validations.forEach(validation => {
                const fieldValue = parseFloat(record[validation.field] || 0);
                
                // Avalia a condição
                const condition = validation.condition.replace('value', fieldValue);
                if (!eval(condition)) {
                    errors.push({
                        field: validation.field,
                        message: validation.message,
                        code: `CST_ICMS_${record['CST ICMS']}_${validation.field}`
                    });
                }
            });
        } else if (record['CST ICMS']) {
            // CST ICMS não encontrado nas regras
            warnings.push({
                field: 'CST ICMS',
                message: `CST ICMS ${record['CST ICMS']} não possui regras de validação definidas`,
                code: 'CST_ICMS_UNKNOWN'
            });
        }
        
        // Validação por CST PIS
        if (record['CST PIS'] && rules.cst_pis_cofins[record['CST PIS']]) {
            const cstPisRules = rules.cst_pis_cofins[record['CST PIS']];
            
            cstPisRules.validations.forEach(validation => {
                // Verifica se a validação é para um campo PIS
                if (validation.field.includes('PIS')) {
                    const fieldValue = parseFloat(record[validation.field] || 0);
                    
                    // Avalia a condição
                    const condition = validation.condition.replace('value', fieldValue);
                    if (!eval(condition)) {
                        errors.push({
                            field: validation.field,
                            message: validation.message,
                            code: `CST_PIS_${record['CST PIS']}_${validation.field}`
                        });
                    }
                }
            });
        } else if (record['CST PIS']) {
            // CST PIS não encontrado nas regras
            warnings.push({
                field: 'CST PIS',
                message: `CST PIS ${record['CST PIS']} não possui regras de validação definidas`,
                code: 'CST_PIS_UNKNOWN'
            });
        }
        
        // Validação por CST COFINS
        if (record['CST COFINS'] && rules.cst_pis_cofins[record['CST COFINS']]) {
            const cstCofinsRules = rules.cst_pis_cofins[record['CST COFINS']];
            
            cstCofinsRules.validations.forEach(validation => {
                // Verifica se a validação é para um campo COFINS
                if (validation.field.includes('COFINS')) {
                    const fieldValue = parseFloat(record[validation.field] || 0);
                    
                    // Avalia a condição
                    const condition = validation.condition.replace('value', fieldValue);
                    if (!eval(condition)) {
                        errors.push({
                            field: validation.field,
                            message: validation.message,
                            code: `CST_COFINS_${record['CST COFINS']}_${validation.field}`
                        });
                    }
                }
            });
        } else if (record['CST COFINS']) {
            // CST COFINS não encontrado nas regras
            warnings.push({
                field: 'CST COFINS',
                message: `CST COFINS ${record['CST COFINS']} não possui regras de validação definidas`,
                code: 'CST_COFINS_UNKNOWN'
            });
        }
        
        // Validações adicionais
        
        // Verifica se a chave de acesso NFe tem 44 dígitos
        if (record['Chave de acesso NFe'] && record['Chave de acesso NFe'].length !== 44) {
            errors.push({
                field: 'Chave de acesso NFe',
                message: 'Chave de acesso NFe deve ter 44 dígitos',
                code: 'CHAVE_NFE_LENGTH'
            });
        }
        
        // Verifica se a data de emissão é anterior à data de lançamento
        if (record['Data Emissão'] && record['Data Lançamento']) {
            const dataEmissao = new Date(record['Data Emissão']);
            const dataLancamento = new Date(record['Data Lançamento']);
            
            if (dataEmissao > dataLancamento) {
                errors.push({
                    field: 'Data Emissão',
                    message: 'Data de emissão não pode ser posterior à data de lançamento',
                    code: 'DATA_EMISSAO_POSTERIOR'
                });
            }
        }
        
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    // Função para obter a descrição de um CFOP
    function getCfopDescription(cfop) {
        return rules.cfop[cfop] ? rules.cfop[cfop].description : 'Descrição não disponível';
    }
    
    // Função para obter a descrição de um CST ICMS
    function getCstIcmsDescription(cstIcms) {
        return rules.cst_icms[cstIcms] ? rules.cst_icms[cstIcms].description : 'Descrição não disponível';
    }
    
    // Função para obter a descrição de um CST PIS/COFINS
    function getCstPisCofinsDescription(cstPisCofins) {
        return rules.cst_pis_cofins[cstPisCofins] ? rules.cst_pis_cofins[cstPisCofins].description : 'Descrição não disponível';
    }
    
    // Função para obter todas as regras
    function getAllRules() {
        return rules;
    }
    
    // Função para adicionar ou atualizar uma regra
    function updateRule(type, code, ruleData) {
        if (!rules[type]) {
            return false;
        }
        
        rules[type][code] = ruleData;
        return true;
    }
    
    // Função para remover uma regra
    function removeRule(type, code) {
        if (!rules[type] || !rules[type][code]) {
            return false;
        }
        
        delete rules[type][code];
        return true;
    }
    
    // Função para exportar as regras
    function exportRules() {
        return JSON.stringify(rules, null, 2);
    }
    
    // Função para importar as regras
    function importRules(rulesJson) {
        try {
            const importedRules = JSON.parse(rulesJson);
            
            // Validação básica da estrutura
            if (!importedRules.cfop || !importedRules.cst_icms || !importedRules.cst_pis_cofins) {
                return false;
            }
            
            // Atualiza as regras
            rules.cfop = importedRules.cfop;
            rules.cst_icms = importedRules.cst_icms;
            rules.cst_pis_cofins = importedRules.cst_pis_cofins;
            
            return true;
        } catch (error) {
            console.error('Erro ao importar regras:', error);
            return false;
        }
    }
    
    // Retorna a API pública
    return {
        validateRecord,
        getCfopDescription,
        getCstIcmsDescription,
        getCstPisCofinsDescription,
        getAllRules,
        updateRule,
        removeRule,
        exportRules,
        importRules
    };
})();

// Integração com o validador principal
document.addEventListener('DOMContentLoaded', function() {
    console.log('Regras fiscais carregadas com sucesso!');
    
    // Adiciona as regras ao objeto global para acesso pelo validador
    window.FiscalRules = FiscalRules;
});
