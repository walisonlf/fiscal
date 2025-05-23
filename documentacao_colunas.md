# Documentação das Colunas do Sistema

Esta documentação contém a lista de colunas disponíveis para validação e filtragem no Sistema de Validação Automática de Planilhas Fiscais.

## Colunas Disponíveis

| DESCRIÇÃO DA COLUNA | NUMERO DA COLUNA |
|---------------------|------------------|
| Empresa | 1 |
| Local de negócios | 2 |
| Nº de documento | 3 |
| Nº da Nota Fiscal | 6 |
| Val.Total NF | 18 |
| Material | 20 |
| Descrição | 21 |
| CFOP | 23 |
| CST ICMS | 27 |
| Base ICMS | 29 |
| Valor ICMS | 31 |
| CST COFINS | 60 |
| Base COFINS | 62 |
| Aliquota COFINS | 63 |
| Valor COFINS | 64 |
| CST PIS | 68 |
| Base PIS | 70 |
| Aliquota PIS | 71 |
| Valor PIS | 72 |
| Base ICMS_ST | 87 |
| Aliquota ICMS_ST | 88 |
| Valor ICMS_ST | 89 |

## Uso no Sistema

Estas colunas são utilizadas para:

1. **Validação de dados**: O sistema verifica a conformidade dos dados nestas colunas de acordo com as regras fiscais configuradas.
2. **Filtragem de resultados**: Usuários podem filtrar os resultados da validação com base nestas colunas.
3. **Configuração de regras**: As regras de validação podem ser configuradas para verificar condições específicas nestas colunas.

## Grupos de Colunas

As colunas podem ser agrupadas nas seguintes categorias:

- **Identificação**: Empresa, Local de negócios, Nº de documento, Nº da Nota Fiscal
- **Valores**: Val.Total NF, Base ICMS, Valor ICMS, Base COFINS, Valor COFINS, Base PIS, Valor PIS, Base ICMS_ST, Valor ICMS_ST
- **Alíquotas**: Aliquota COFINS, Aliquota PIS, Aliquota ICMS_ST
- **Classificação Fiscal**: CFOP, CST ICMS, CST COFINS, CST PIS
- **Produto**: Material, Descrição
