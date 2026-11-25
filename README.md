## Ficha de Vistoria - Itazi Engenharia - Versão 1.0 atualizada

Atualização pontual sobre a estrutura original, sem reorganização da aplicação.

### Acréscimos consolidados
- Campo Número separado em todos os blocos de endereço existentes: Dados do Imóvel e Dados dos Interessados/Proprietário.
- Ao marcar “Endereço igual ao do imóvel”, o Número também é copiado.
- A busca por CEP direciona o preenchimento complementar para o campo Número quando o logradouro é localizado.
- Três campos de telefone, além do campo Celular.
- Campo E-mail imediatamente após Celular, disponível nas fichas Urbana e Rural.
- Ao acionar N/A no campo Nome do cônjuge, RG, CPF, Nacionalidade e Profissão do cônjuge também recebem N/A e são impressos como traço.
- PDF, Word e CSV reconhecem os campos adicionados pela estrutura existente.

Cache offline atualizado para ficha-12.


#### Correção de exportação e compartilhamento
- PDF e PDF compartilhado agora usam quebra automática de linha com altura dinâmica em todos os campos.
- Textos longos, inclusive sequências sem espaços, são divididos sem truncamento.
- A paginação é automática quando o conteúdo ultrapassa a área útil.
- As fotografias passam a ocupar páginas individuais, permitindo que identificação e legenda sejam exibidas integralmente.
- Word continua usando células e parágrafos com quebra automática, sem limitar o comprimento dos valores.

Cache offline atualizado para ficha-13.
