# Mapeamento de Colunas da Planilha

Este documento contém o mapeamento entre as colunas da planilha de exemplo e as colunas necessárias para as regras de validação.

## Colunas Identificadas na Planilha

| Nome na Documentação | Número na Doc | Nome na Planilha | Observações |
|----------------------|---------------|------------------|-------------|
| Empresa | 1 | Empresa | Coluna 0 na planilha |
| Local de negócios | 2 | Local de negócios | Coluna 1 na planilha |
| Nº de documento | 3 | Nº documento | Coluna 2 na planilha |
| Nº da Nota Fiscal | 6 | Nº documento | Coluna 2 na planilha (mesmo que anterior) |
| Val.Total NF | 18 | Valor | Coluna 26 na planilha |
| Material | 20 | Material | Coluna 24 na planilha |
| Descrição | 21 | Texto breve material | Coluna 25 na planilha |
| CFOP | 23 | CFOP | Coluna 27 na planilha |
| CST ICMS | 27 | Código IVA | Coluna 30 na planilha |
| Base ICMS | 29 | Base cálculo ICMS | Coluna 32 na planilha |
| Valor ICMS | 31 | Valor ICMS | Coluna 33 na planilha |
| CST COFINS | 60 | Código IVA COFINS | Coluna 47 na planilha |
| Base COFINS | 62 | Base cálculo COFINS | Coluna 49 na planilha |
| Aliquota COFINS | 63 | % COFINS | Coluna 50 na planilha |
| Valor COFINS | 64 | Valor COFINS | Coluna 51 na planilha |
| CST PIS | 68 | Código IVA PIS | Coluna 54 na planilha |
| Base PIS | 70 | Base cálculo PIS | Coluna 56 na planilha |
| Aliquota PIS | 71 | % PIS | Coluna 57 na planilha |
| Valor PIS | 72 | Valor PIS | Coluna 58 na planilha |
| Base ICMS_ST | 87 | Base cálculo ICMS-ST | Coluna 34 na planilha |
| Aliquota ICMS_ST | 88 | % ICMS-ST | Coluna 35 na planilha |
| Valor ICMS_ST | 89 | Valor ICMS-ST | Coluna 36 na planilha |

## Colunas Adicionais Relevantes

| Nome na Planilha | Observações |
|------------------|-------------|
| Texto CFOP | Descrição textual do CFOP |
| Isentas ICMS | Valor de isenção de ICMS |
| Outras ICMS | Outros valores de ICMS |
| Chave de acesso NFe | Chave de acesso da Nota Fiscal Eletrônica |

## Observações sobre o Mapeamento

1. Algumas colunas na planilha têm nomes diferentes dos mencionados na documentação
2. A coluna "Nº documento" parece ser usada tanto para o número do documento quanto para o número da nota fiscal
3. Todas as colunas necessárias para aplicar as regras de validação estão presentes na planilha
4. Os códigos CST estão representados como códigos IVA na planilha
5. As colunas de base de cálculo, alíquota e valor estão presentes para ICMS, ICMS-ST, PIS e COFINS

Este mapeamento será utilizado para implementar as regras de validação no sistema.
