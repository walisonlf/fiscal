/**
 * Arquivo: rules.js
 * Definição das regras de validação fiscal para o sistema
 */

// Configuração global
const CONFIG = {
    // Mapeamento de colunas da planilha
    columnMapping: {
        "Empresa": ["Empresa"],
        "Local de negócios": ["Local de negócios"],
        "Nº de documento": ["Nº documento"],
        "Nº da Nota Fiscal": ["Nº documento"],
        "Val.Total NF": ["Valor"],
        "Material": ["Material"],
        "Descrição": ["Texto breve material"],
        "CFOP": ["CFOP"],
        "CST ICMS": ["Código IVA"],
        "Base ICMS": ["Base cálculo ICMS"],
        "Valor ICMS": ["Valor ICMS"],
        "CST COFINS": ["Código IVA COFINS"],
        "Base COFINS": ["Base cálculo COFINS"],
        "Aliquota COFINS": ["% COFINS"],
        "Valor COFINS": ["Valor COFINS"],
        "CST PIS": ["Código IVA PIS"],
        "Base PIS": ["Base cálculo PIS"],
        "Aliquota PIS": ["% PIS"],
        "Valor PIS": ["Valor PIS"],
        "Base ICMS_ST": ["Base cálculo ICMS-ST"],
        "Aliquota ICMS_ST": ["% ICMS-ST"],
        "Valor ICMS_ST": ["Valor ICMS-ST"],
        "Isentas ICMS": ["Isentas ICMS"],
        "Outras ICMS": ["Outras ICMS"],
        "Texto CFOP": ["Texto CFOP"],
        "Chave de acesso NFe": ["Chave de acesso NFe"]
    },
    
    // Colunas obrigatórias para validação
    requiredColumns: [
        "CFOP", 
        "CST ICMS", 
        "CST PIS", 
        "CST COFINS", 
        "Base ICMS", 
        "Valor ICMS", 
        "Base ICMS_ST", 
        "Valor ICMS_ST", 
        "Base PIS", 
        "Aliquota PIS", 
        "Valor PIS", 
        "Base COFINS", 
        "Aliquota COFINS", 
        "Valor COFINS",
        "Val.Total NF"
    ],
    
    // Regras de validação por CFOP
    cfopRules: [
        {
            cfop: ["5910", "6910", "5927"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "10", "20", "30", "40", "60", "70"],
                    errorCode: "E001",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 10, 20, 30, 40, 60, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E002",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E003",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1910", "2910"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "10", "20", "30", "40", "60", "70"],
                    errorCode: "E004",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 10, 20, 30, 40, 60, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E005",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E006",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["6912"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "10", "20", "60", "50", "70"],
                    errorCode: "E007",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 10, 20, 60, 50, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E008",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E009",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["6125", "5106", "5116", "5117", "5119", "6101", "6108", "6117", "6118", "6119", "6123", "5120", "6120", "5112", "6112", "5114", "6114", "5123", "5104", "6104", "5115", "6115", "6116", "5105", "5122", "6122", "6107"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20"],
                    errorCode: "E010",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E011",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E012",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["5917", "6917", "5904", "6904", "5606"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20"],
                    errorCode: "E013",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E014",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E015",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1117", "1125", "1202", "1118", "2118", "1122", "1120", "2120", "1932", "2101", "2117", "1201", "2122", "2201", "2202", "2124", "2125", "2932", "3101", "3102"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20"],
                    errorCode: "E016",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E017",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E018",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["1923", "2923", "1904", "2904"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20"],
                    errorCode: "E019",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E020",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E021",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["6102"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40"],
                    errorCode: "E022",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E023",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E024",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["6152"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40"],
                    errorCode: "E025",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E026",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E027",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["2102", "1204"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40"],
                    errorCode: "E028",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E029",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E030",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["1302", "2302", "1303", "1203", "2152", "2203", "2204", "2303"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40"],
                    errorCode: "E031",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E032",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E033",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["5151", "5152"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40", "41"],
                    errorCode: "E034",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40, 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E035",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E036",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["5201", "5202", "6201", "6202"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40", "41", "50", "51", "61", "90"],
                    errorCode: "E037",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40, 41, 50, 51, 61, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E038",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E039",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["5949", "6949"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40", "41", "50", "51", "90"],
                    errorCode: "E040",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40, 41, 50, 51, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E041",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E042",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1949", "2949"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40", "41", "50", "51", "90"],
                    errorCode: "E043",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40, 41, 50, 51, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E044",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E045",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["5102", "5101"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40", "51"],
                    errorCode: "E046",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40, 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E047",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E048",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["1101", "1102"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "40", "51"],
                    errorCode: "E049",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 40, 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E050",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E051",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["1352", "1353", "2352", "2353"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "30", "40", "90"],
                    errorCode: "E052",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 30, 40, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E053",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E054",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["6106"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "41"],
                    errorCode: "E055",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E056",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E057",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["6908", "6909", "5908", "5909"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "41"],
                    errorCode: "E058",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E059",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E060",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["2912"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "41", "60"],
                    errorCode: "E061",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 41, 60"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E062",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E063",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["1121", "2121"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "50"],
                    errorCode: "E064",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 50"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E065",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E066",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["5125"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "51"],
                    errorCode: "E067",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E068",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E069",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["1124"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "51"],
                    errorCode: "E070",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E071",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E072",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["5118"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "70"],
                    errorCode: "E073",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E074",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E075",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["5258", "6258", "5257", "6257", "5251", "6251", "5253", "6253", "5256", "6256", "5252", "6252", "5255", "6255", "5254", "6254"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "20", "90"],
                    errorCode: "E076",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 20, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E077",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E078",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["6151", "6552"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "40", "41"],
                    errorCode: "E079",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 40, 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E080",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E081",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["5907", "6907", "6905"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "41"],
                    errorCode: "E082",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E083",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E084",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1905", "2905"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "41"],
                    errorCode: "E085",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E086",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E087",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["5905"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "41", "50"],
                    errorCode: "E088",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 41, 50"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E089",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E090",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["6906", "5906"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "41", "90"],
                    errorCode: "E091",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 41, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E092",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E093",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1906", "2906"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["00", "41", "90"],
                    errorCode: "E094",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 00, 41, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E095",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E096",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["5403"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["10", "30"],
                    errorCode: "E097",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 10, 30"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E098",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E099",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["5408", "5411", "6408", "6403", "6404", "6411", "5402", "6402", "5401", "6401"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["10", "30", "60", "70"],
                    errorCode: "E100",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 10, 30, 60, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E101",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E102",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["5661", "6661", "5657", "6657", "5415", "6415", "5414", "6414", "5663", "6663", "5409", "5666", "6666", "5664", "6664", "5655", "5659", "5665", "6665", "5658", "6658", "5667", "6667", "5654", "6654", "5652", "6652", "5653", "6653", "5651", "6651", "6409", "6413", "6655", "6656", "6659"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["10", "30", "60", "70"],
                    errorCode: "E103",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 10, 30, 60, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E104",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E105",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["2652", "1651", "2651", "1403", "1411", "1401", "2401", "1652", "1661", "2661", "1662", "1660", "2660", "1410", "2410", "2403", "2411", "2662"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["10", "30", "60", "70"],
                    errorCode: "E106",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 10, 30, 60, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E107",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E108",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["1406", "1407", "1408", "1409", "1659", "2406", "2407", "2409", "1901", "2901", "2659", "1664", "2664", "1415", "2415", "1414", "2414", "1658", "2658", "2408"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["10", "30", "60", "70"],
                    errorCode: "E109",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 10, 30, 60, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E110",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E111",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["2907"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["20", "41"],
                    errorCode: "E112",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 20, 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E113",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E114",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["1907"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["20", "41", "50"],
                    errorCode: "E115",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 20, 41, 50"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E116",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E117",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["6110", "5110", "5109", "6109"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["30", "40"],
                    errorCode: "E118",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 30, 40"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E119",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E120",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["5911", "6911", "5451", "5914", "6914", "5209", "5920", "5921", "5601", "5557", "5156", "6156", "5155", "6155", "5602", "5605", "6209", "6557", "6920", "6921"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["40"],
                    errorCode: "E121",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 40"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E122",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E123",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1911", "1920", "2209", "2911", "2920", "2921", "1601", "1602", "1605", "1914", "2914", "1921", "2153", "1557", "2557", "2154"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["40"],
                    errorCode: "E124",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 40"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E125",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E126",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["5551", "5552", "6551"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["40", "41"],
                    errorCode: "E127",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 40, 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E128",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E129",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["2151"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["40", "41"],
                    errorCode: "E130",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 40, 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E131",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E132",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["6451", "5452", "6452", "1453", "6453", "5453", "5455", "5454", "6454", "1454", "1455", "2455"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["40", "41", "90"],
                    errorCode: "E133",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 40, 41, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E134",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E135",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["1209"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["40", "51"],
                    errorCode: "E136",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 40, 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E137",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E138",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["5554", "5502", "6502", "5504", "6504", "5505", "6505", "5501", "6501", "5922", "5153", "6153", "6554", "6922"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["41"],
                    errorCode: "E139",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E140",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E141",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1922", "1933", "2922"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["41"],
                    errorCode: "E142",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E143",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E144",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["1552", "1555", "1908", "2908", "2552", "5934", "6934", "1554", "2554", "1909", "2909", "2902"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["41"],
                    errorCode: "E145",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 41"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E146",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E147",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["1902", "1915", "1916", "2915", "2916"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["41", "50"],
                    errorCode: "E148",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 41, 50"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E149",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E150",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["5913", "5912", "5915", "5923", "6913"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["41", "50", "51"],
                    errorCode: "E151",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 41, 50, 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E152",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E153",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1925", "2925"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["41", "50", "51"],
                    errorCode: "E154",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 41, 50, 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E155",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E156",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["5925", "6925"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["41", "51"],
                    errorCode: "E157",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 41, 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E158",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E159",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1551", "2551"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["41", "90"],
                    errorCode: "E160",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 41, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["70"],
                    errorCode: "E161",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 70"
                },
                {
                    field: "CST COFINS",
                    validValues: ["70"],
                    errorCode: "E162",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 70"
                }
            ]
        },
        {
            cfop: ["2556"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["41", "90"],
                    errorCode: "E163",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 41, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E164",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E165",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["5924", "5916", "6915", "6916", "6923", "6924"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["50"],
                    errorCode: "E166",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E167",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E168",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1903", "1912", "1913", "1451", "1452", "2913"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["50"],
                    errorCode: "E169",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E170",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E171",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["6901", "5903", "6903", "5902", "6902", "5901"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["50", "51"],
                    errorCode: "E172",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 50, 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E173",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E174",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["5124", "6124"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["51"],
                    errorCode: "E175",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E176",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E177",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["1152"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["51"],
                    errorCode: "E178",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 51"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E179",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E180",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        },
        {
            cfop: ["6105"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["60"],
                    errorCode: "E181",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 60"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E182",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E183",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["5405"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["60", "70"],
                    errorCode: "E184",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 60, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["01"],
                    errorCode: "E185",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 01"
                },
                {
                    field: "CST COFINS",
                    validValues: ["01"],
                    errorCode: "E186",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 01"
                }
            ]
        },
        {
            cfop: ["5656"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["60", "70"],
                    errorCode: "E187",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 60, 70"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E188",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E189",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["1653", "2653"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["60", "90"],
                    errorCode: "E190",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valores permitidos: 60, 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E191",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E192",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["6556", "5556"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["90"],
                    errorCode: "E193",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["49"],
                    errorCode: "E194",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 49"
                },
                {
                    field: "CST COFINS",
                    validValues: ["49"],
                    errorCode: "E195",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 49"
                }
            ]
        },
        {
            cfop: ["2252", "1252", "1253", "2253"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["90"],
                    errorCode: "E196",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["50"],
                    errorCode: "E197",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 50"
                },
                {
                    field: "CST COFINS",
                    validValues: ["50"],
                    errorCode: "E198",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 50"
                }
            ]
        },
        {
            cfop: ["1556"],
            conditions: [
                {
                    field: "CST ICMS",
                    validValues: ["90"],
                    errorCode: "E199",
                    errorMessage: "CST ICMS inválido para CFOP {value}. Valor permitido: 90"
                },
                {
                    field: "CST PIS",
                    validValues: ["98"],
                    errorCode: "E200",
                    errorMessage: "CST PIS inválido para CFOP {value}. Valor permitido: 98"
                },
                {
                    field: "CST COFINS",
                    validValues: ["98"],
                    errorCode: "E201",
                    errorMessage: "CST COFINS inválido para CFOP {value}. Valor permitido: 98"
                }
            ]
        }
    ],
    
    // Regras de validação por CST ICMS
    cstIcmsRules: [
        {
            cst: "00",
            conditions: [
                {
                    expression: "Base ICMS == Val.Total NF",
                    errorCode: "E202",
                    errorMessage: "Para CST ICMS 00, a Base ICMS deve ser igual ao Valor Total NF"
                },
                {
                    expression: "Valor ICMS == Base ICMS * (Aliquota ICMS / 100)",
                    tolerance: 0.01,
                    errorCode: "E203",
                    errorMessage: "Para CST ICMS 00, o Valor ICMS deve ser igual a Base ICMS × Alíquota"
                },
                {
                    expression: "Base ICMS_ST == 0",
                    errorCode: "E204",
                    errorMessage: "Para CST ICMS 00, a Base ICMS_ST deve ser zero"
                },
                {
                    expression: "Valor ICMS_ST == 0",
                    errorCode: "E205",
                    errorMessage: "Para CST ICMS 00, o Valor ICMS_ST deve ser zero"
                }
            ]
        },
        {
            cst: "10",
            conditions: [
                {
                    expression: "Base ICMS > 0",
                    errorCode: "E206",
                    errorMessage: "Para CST ICMS 10, a Base ICMS deve ser maior que zero"
                },
                {
                    expression: "Valor ICMS > 0",
                    errorCode: "E207",
                    errorMessage: "Para CST ICMS 10, o Valor ICMS deve ser maior que zero"
                },
                {
                    expression: "Base ICMS_ST > 0",
                    errorCode: "E208",
                    errorMessage: "Para CST ICMS 10, a Base ICMS_ST deve ser maior que zero"
                },
                {
                    expression: "Valor ICMS_ST > 0",
                    errorCode: "E209",
                    errorMessage: "Para CST ICMS 10, o Valor ICMS_ST deve ser maior que zero"
                }
            ]
        },
        {
            cst: "20",
            conditions: [
                {
                    expression: "Base ICMS < Val.Total NF",
                    errorCode: "E210",
                    errorMessage: "Para CST ICMS 20, a Base ICMS deve ser menor que o Valor Total NF"
                },
                {
                    expression: "Valor ICMS == Base ICMS * (Aliquota ICMS / 100)",
                    tolerance: 0.01,
                    errorCode: "E211",
                    errorMessage: "Para CST ICMS 20, o Valor ICMS deve ser igual a Base ICMS × Alíquota"
                },
                {
                    expression: "Base ICMS_ST == 0",
                    errorCode: "E212",
                    errorMessage: "Para CST ICMS 20, a Base ICMS_ST deve ser zero"
                },
                {
                    expression: "Valor ICMS_ST == 0",
                    errorCode: "E213",
                    errorMessage: "Para CST ICMS 20, o Valor ICMS_ST deve ser zero"
                }
            ]
        },
        {
            cst: "30",
            conditions: [
                {
                    expression: "Base ICMS == 0",
                    errorCode: "E214",
                    errorMessage: "Para CST ICMS 30, a Base ICMS deve ser zero"
                },
                {
                    expression: "Valor ICMS == 0",
                    errorCode: "E215",
                    errorMessage: "Para CST ICMS 30, o Valor ICMS deve ser zero"
                },
                {
                    expression: "Base ICMS_ST > 0",
                    errorCode: "E216",
                    errorMessage: "Para CST ICMS 30, a Base ICMS_ST deve ser maior que zero"
                },
                {
                    expression: "Valor ICMS_ST > 0",
                    errorCode: "E217",
                    errorMessage: "Para CST ICMS 30, o Valor ICMS_ST deve ser maior que zero"
                }
            ]
        },
        {
            cst: "40",
            conditions: [
                {
                    expression: "Base ICMS == 0",
                    errorCode: "E218",
                    errorMessage: "Para CST ICMS 40, a Base ICMS deve ser zero"
                },
                {
                    expression: "Valor ICMS == 0",
                    errorCode: "E219",
                    errorMessage: "Para CST ICMS 40, o Valor ICMS deve ser zero"
                },
                {
                    expression: "(Isentas ICMS + Outras ICMS) == Val.Total NF",
                    tolerance: 0.01,
                    errorCode: "E220",
                    errorMessage: "Para CST ICMS 40, a soma de Isentas ICMS e Outras ICMS deve ser igual ao Valor Total NF"
                }
            ]
        },
        {
            cst: "41",
            conditions: [
                {
                    expression: "Base ICMS == 0",
                    errorCode: "E221",
                    errorMessage: "Para CST ICMS 41, a Base ICMS deve ser zero"
                },
                {
                    expression: "Valor ICMS == 0",
                    errorCode: "E222",
                    errorMessage: "Para CST ICMS 41, o Valor ICMS deve ser zero"
                },
                {
                    expression: "(Isentas ICMS + Outras ICMS) == Val.Total NF",
                    tolerance: 0.01,
                    errorCode: "E223",
                    errorMessage: "Para CST ICMS 41, a soma de Isentas ICMS e Outras ICMS deve ser igual ao Valor Total NF"
                }
            ]
        },
        {
            cst: "50",
            conditions: [
                {
                    expression: "Base ICMS == 0",
                    errorCode: "E224",
                    errorMessage: "Para CST ICMS 50, a Base ICMS deve ser zero"
                },
                {
                    expression: "Valor ICMS == 0",
                    errorCode: "E225",
                    errorMessage: "Para CST ICMS 50, o Valor ICMS deve ser zero"
                },
                {
                    expression: "(Isentas ICMS + Outras ICMS) == Val.Total NF",
                    tolerance: 0.01,
                    errorCode: "E226",
                    errorMessage: "Para CST ICMS 50, a soma de Isentas ICMS e Outras ICMS deve ser igual ao Valor Total NF"
                }
            ]
        },
        {
            cst: "51",
            conditions: [
                {
                    expression: "Base ICMS > 0",
                    errorCode: "E227",
                    errorMessage: "Para CST ICMS 51, a Base ICMS deve ser maior que zero"
                },
                {
                    expression: "Valor ICMS == 0",
                    errorCode: "E228",
                    errorMessage: "Para CST ICMS 51, o Valor ICMS deve ser zero"
                },
                {
                    expression: "(Isentas ICMS + Outras ICMS) == Base ICMS * (Aliquota ICMS / 100)",
                    tolerance: 0.01,
                    errorCode: "E229",
                    errorMessage: "Para CST ICMS 51, a soma de Isentas ICMS e Outras ICMS deve ser igual a Base × Alíquota"
                }
            ]
        },
        {
            cst: "60",
            conditions: [
                {
                    expression: "Base ICMS == 0",
                    errorCode: "E230",
                    errorMessage: "Para CST ICMS 60, a Base ICMS deve ser zero"
                },
                {
                    expression: "Valor ICMS == 0",
                    errorCode: "E231",
                    errorMessage: "Para CST ICMS 60, o Valor ICMS deve ser zero"
                },
                {
                    expression: "Base ICMS_ST == 0",
                    errorCode: "E232",
                    errorMessage: "Para CST ICMS 60, a Base ICMS_ST deve ser zero"
                },
                {
                    expression: "Valor ICMS_ST == 0",
                    errorCode: "E233",
                    errorMessage: "Para CST ICMS 60, o Valor ICMS_ST deve ser zero"
                }
            ]
        },
        {
            cst: "70",
            conditions: [
                {
                    expression: "Base ICMS < Val.Total NF",
                    errorCode: "E234",
                    errorMessage: "Para CST ICMS 70, a Base ICMS deve ser menor que o Valor Total NF"
                },
                {
                    expression: "Valor ICMS > 0",
                    errorCode: "E235",
                    errorMessage: "Para CST ICMS 70, o Valor ICMS deve ser maior que zero"
                },
                {
                    expression: "Base ICMS_ST > 0",
                    errorCode: "E236",
                    errorMessage: "Para CST ICMS 70, a Base ICMS_ST deve ser maior que zero"
                },
                {
                    expression: "Valor ICMS_ST > 0",
                    errorCode: "E237",
                    errorMessage: "Para CST ICMS 70, o Valor ICMS_ST deve ser maior que zero"
                }
            ]
        },
        {
            cst: "90",
            conditions: [
                {
                    expression: "Base ICMS == 0",
                    errorCode: "E238",
                    errorMessage: "Para CST ICMS 90, a Base ICMS deve ser zero"
                },
                {
                    expression: "Valor ICMS == 0",
                    errorCode: "E239",
                    errorMessage: "Para CST ICMS 90, o Valor ICMS deve ser zero"
                },
                {
                    expression: "Base ICMS_ST == 0",
                    errorCode: "E240",
                    errorMessage: "Para CST ICMS 90, a Base ICMS_ST deve ser zero"
                },
                {
                    expression: "Valor ICMS_ST == 0",
                    errorCode: "E241",
                    errorMessage: "Para CST ICMS 90, o Valor ICMS_ST deve ser zero"
                }
            ]
        }
    ],
    
    // Regras de validação por CST PIS/COFINS
    cstPisCofinsRules: [
        {
            cst: "01",
            type: "PIS",
            conditions: [
                {
                    expression: "Base PIS > 0",
                    errorCode: "E242",
                    errorMessage: "Para CST PIS 01, a Base PIS deve ser maior que zero"
                },
                {
                    expression: "Aliquota PIS > 0",
                    errorCode: "E243",
                    errorMessage: "Para CST PIS 01, a Alíquota PIS deve ser maior que zero"
                },
                {
                    expression: "Valor PIS > 0",
                    errorCode: "E244",
                    errorMessage: "Para CST PIS 01, o Valor PIS deve ser maior que zero"
                },
                {
                    expression: "Valor PIS == Base PIS * (Aliquota PIS / 100)",
                    tolerance: 0.01,
                    errorCode: "E245",
                    errorMessage: "Para CST PIS 01, o Valor PIS deve ser igual a Base PIS × Alíquota PIS"
                }
            ]
        },
        {
            cst: "01",
            type: "COFINS",
            conditions: [
                {
                    expression: "Base COFINS > 0",
                    errorCode: "E246",
                    errorMessage: "Para CST COFINS 01, a Base COFINS deve ser maior que zero"
                },
                {
                    expression: "Aliquota COFINS > 0",
                    errorCode: "E247",
                    errorMessage: "Para CST COFINS 01, a Alíquota COFINS deve ser maior que zero"
                },
                {
                    expression: "Valor COFINS > 0",
                    errorCode: "E248",
                    errorMessage: "Para CST COFINS 01, o Valor COFINS deve ser maior que zero"
                },
                {
                    expression: "Valor COFINS == Base COFINS * (Aliquota COFINS / 100)",
                    tolerance: 0.01,
                    errorCode: "E249",
                    errorMessage: "Para CST COFINS 01, o Valor COFINS deve ser igual a Base COFINS × Alíquota COFINS"
                }
            ]
        },
        {
            cst: "02",
            type: "PIS",
            conditions: [
                {
                    expression: "Base PIS > 0",
                    errorCode: "E250",
                    errorMessage: "Para CST PIS 02, a Base PIS deve ser maior que zero"
                },
                {
                    expression: "Aliquota PIS > 0",
                    errorCode: "E251",
                    errorMessage: "Para CST PIS 02, a Alíquota PIS deve ser maior que zero"
                },
                {
                    expression: "Valor PIS > 0",
                    errorCode: "E252",
                    errorMessage: "Para CST PIS 02, o Valor PIS deve ser maior que zero"
                },
                {
                    expression: "Valor PIS == Base PIS * (Aliquota PIS / 100)",
                    tolerance: 0.01,
                    errorCode: "E253",
                    errorMessage: "Para CST PIS 02, o Valor PIS deve ser igual a Base PIS × Alíquota PIS"
                }
            ]
        },
        {
            cst: "02",
            type: "COFINS",
            conditions: [
                {
                    expression: "Base COFINS > 0",
                    errorCode: "E254",
                    errorMessage: "Para CST COFINS 02, a Base COFINS deve ser maior que zero"
                },
                {
                    expression: "Aliquota COFINS > 0",
                    errorCode: "E255",
                    errorMessage: "Para CST COFINS 02, a Alíquota COFINS deve ser maior que zero"
                },
                {
                    expression: "Valor COFINS > 0",
                    errorCode: "E256",
                    errorMessage: "Para CST COFINS 02, o Valor COFINS deve ser maior que zero"
                },
                {
                    expression: "Valor COFINS == Base COFINS * (Aliquota COFINS / 100)",
                    tolerance: 0.01,
                    errorCode: "E257",
                    errorMessage: "Para CST COFINS 02, o Valor COFINS deve ser igual a Base COFINS × Alíquota COFINS"
                }
            ]
        },
        {
            cst: ["04", "06", "07", "08", "09", "72", "73", "74", "98", "99"],
            type: "PIS",
            conditions: [
                {
                    expression: "Base PIS == 0",
                    errorCode: "E258",
                    errorMessage: "Para CST PIS {value}, a Base PIS deve ser zero"
                },
                {
                    expression: "Aliquota PIS == 0",
                    errorCode: "E259",
                    errorMessage: "Para CST PIS {value}, a Alíquota PIS deve ser zero"
                },
                {
                    expression: "Valor PIS == 0",
                    errorCode: "E260",
                    errorMessage: "Para CST PIS {value}, o Valor PIS deve ser zero"
                }
            ]
        },
        {
            cst: ["04", "06", "07", "08", "09", "72", "73", "74", "98", "99"],
            type: "COFINS",
            conditions: [
                {
                    expression: "Base COFINS == 0",
                    errorCode: "E261",
                    errorMessage: "Para CST COFINS {value}, a Base COFINS deve ser zero"
                },
                {
                    expression: "Aliquota COFINS == 0",
                    errorCode: "E262",
                    errorMessage: "Para CST COFINS {value}, a Alíquota COFINS deve ser zero"
                },
                {
                    expression: "Valor COFINS == 0",
                    errorCode: "E263",
                    errorMessage: "Para CST COFINS {value}, o Valor COFINS deve ser zero"
                }
            ]
        },
        {
            cst: "49",
            type: "PIS",
            conditions: [
                {
                    expression: "Base PIS == 0",
                    errorCode: "E264",
                    errorMessage: "Para CST PIS 49, a Base PIS deve ser zero"
                },
                {
                    expression: "Aliquota PIS == 0",
                    errorCode: "E265",
                    errorMessage: "Para CST PIS 49, a Alíquota PIS deve ser zero"
                },
                {
                    expression: "Valor PIS == 0",
                    errorCode: "E266",
                    errorMessage: "Para CST PIS 49, o Valor PIS deve ser zero"
                }
            ],
            exceptions: ["5201", "5202", "5411", "5927", "6201", "6202", "6411"]
        },
        {
            cst: "49",
            type: "COFINS",
            conditions: [
                {
                    expression: "Base COFINS == 0",
                    errorCode: "E267",
                    errorMessage: "Para CST COFINS 49, a Base COFINS deve ser zero"
                },
                {
                    expression: "Aliquota COFINS == 0",
                    errorCode: "E268",
                    errorMessage: "Para CST COFINS 49, a Alíquota COFINS deve ser zero"
                },
                {
                    expression: "Valor COFINS == 0",
                    errorCode: "E269",
                    errorMessage: "Para CST COFINS 49, o Valor COFINS deve ser zero"
                }
            ],
            exceptions: ["5201", "5202", "5411", "5927", "6201", "6202", "6411"]
        },
        {
            cst: "50",
            type: "PIS",
            conditions: [
                {
                    expression: "Base PIS > 0",
                    errorCode: "E270",
                    errorMessage: "Para CST PIS 50, a Base PIS deve ser maior que zero"
                },
                {
                    expression: "Aliquota PIS > 0",
                    errorCode: "E271",
                    errorMessage: "Para CST PIS 50, a Alíquota PIS deve ser maior que zero"
                },
                {
                    expression: "Valor PIS > 0",
                    errorCode: "E272",
                    errorMessage: "Para CST PIS 50, o Valor PIS deve ser maior que zero"
                },
                {
                    expression: "Valor PIS == Base PIS * (Aliquota PIS / 100)",
                    tolerance: 0.01,
                    errorCode: "E273",
                    errorMessage: "Para CST PIS 50, o Valor PIS deve ser igual a Base PIS × Alíquota PIS"
                }
            ]
        },
        {
            cst: "50",
            type: "COFINS",
            conditions: [
                {
                    expression: "Base COFINS > 0",
                    errorCode: "E274",
                    errorMessage: "Para CST COFINS 50, a Base COFINS deve ser maior que zero"
                },
                {
                    expression: "Aliquota COFINS > 0",
                    errorCode: "E275",
                    errorMessage: "Para CST COFINS 50, a Alíquota COFINS deve ser maior que zero"
                },
                {
                    expression: "Valor COFINS > 0",
                    errorCode: "E276",
                    errorMessage: "Para CST COFINS 50, o Valor COFINS deve ser maior que zero"
                },
                {
                    expression: "Valor COFINS == Base COFINS * (Aliquota COFINS / 100)",
                    tolerance: 0.01,
                    errorCode: "E277",
                    errorMessage: "Para CST COFINS 50, o Valor COFINS deve ser igual a Base COFINS × Alíquota COFINS"
                }
            ]
        },
        {
            cst: "51",
            type: "PIS",
            conditions: [
                {
                    expression: "Base PIS > 0",
                    errorCode: "E278",
                    errorMessage: "Para CST PIS 51, a Base PIS deve ser maior que zero"
                },
                {
                    expression: "Aliquota PIS > 0",
                    errorCode: "E279",
                    errorMessage: "Para CST PIS 51, a Alíquota PIS deve ser maior que zero"
                },
                {
                    expression: "Valor PIS > 0",
                    errorCode: "E280",
                    errorMessage: "Para CST PIS 51, o Valor PIS deve ser maior que zero"
                },
                {
                    expression: "Valor PIS == Base PIS * (Aliquota PIS / 100)",
                    tolerance: 0.01,
                    errorCode: "E281",
                    errorMessage: "Para CST PIS 51, o Valor PIS deve ser igual a Base PIS × Alíquota PIS"
                }
            ]
        },
        {
            cst: "51",
            type: "COFINS",
            conditions: [
                {
                    expression: "Base COFINS > 0",
                    errorCode: "E282",
                    errorMessage: "Para CST COFINS 51, a Base COFINS deve ser maior que zero"
                },
                {
                    expression: "Aliquota COFINS > 0",
                    errorCode: "E283",
                    errorMessage: "Para CST COFINS 51, a Alíquota COFINS deve ser maior que zero"
                },
                {
                    expression: "Valor COFINS > 0",
                    errorCode: "E284",
                    errorMessage: "Para CST COFINS 51, o Valor COFINS deve ser maior que zero"
                },
                {
                    expression: "Valor COFINS == Base COFINS * (Aliquota COFINS / 100)",
                    tolerance: 0.01,
                    errorCode: "E285",
                    errorMessage: "Para CST COFINS 51, o Valor COFINS deve ser igual a Base COFINS × Alíquota COFINS"
                }
            ]
        }
    ]
};

// Exportar a configuração para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
