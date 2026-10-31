# Padrão de design

Diretrizes de design do projeto para crianças autistas de 4 a 10 anos. Valem para **o site e para os jogos**: a escola envia o PDI e aprova os jogos, os pais recebem o resumo e a criança acessa os jogos dela, o avatar, o XP e a coleção. Quem cria uma tela do site ou uma cena de jogo segue estas regras.

Antes de qualquer tela, identifique o **público**:

- **Área da criança** (início, escolha de jogos, **as telas dos próprios jogos**, avatar, XP, coleção, temas): siga **todas** as regras abaixo.
- **Área da escola e dos pais** (envio do PDI, tópicos de lacunas, aprovação, resumo, acompanhamento): pode ser mais densa e informativa, mas precisa ser clara, acessível (WCAG AA) e calma. Siga as regras 1, 2 e 7 e a seção "Escola e pais".

## Regras da área da criança

1. **Sensorial:** cores calmas e pouco saturadas, sem neon e sem fundos muito vibrantes. Contraste WCAG AA. Nada piscando (máximo de 3 flashes por segundo).
2. **Movimento:** só como feedback curto (≤ 300 ms). Nada de parallax, autoplay ou carrossel. Respeitar `prefers-reduced-motion`.
3. **Previsibilidade:** mesma estrutura em todas as telas e temas, com os botões sempre no mesmo lugar e uma tarefa por tela. Avisar antes de qualquer mudança de tela (por exemplo, ao sair do site para o jogo e voltar).
4. **Leitura:** pouco texto, sempre acompanhado de ícone ou imagem. Fonte grande e arredondada. Instruções em passos curtos e, se possível, também em áudio.
5. **Interação:** alvos de toque de pelo menos 48 px (64 px para os menores), espaçados entre si. Sem arrastar com precisão nem limite de tempo por padrão.
6. **Feedback:** sempre positivo e específico. O erro aparece como "tente de novo", sem som alto, tela vermelha ou perda de XP. Ganhos de XP e itens novos são comemorados de forma breve e calma.
7. **Som:** desligado ou baixo por padrão, com controle sempre visível.
8. **Temas de hiperfoco** (dinossauro, navio, avião, trem…): trocam só ilustrações, cores e personagens. Layout, botões, fluxo e sistema de XP continuam iguais em todos os temas. Implementar o tema como uma camada de tokens e assets, não como páginas separadas.
9. **Escopo:** a criança vê só os jogos ligados às lacunas dela, nunca o banco inteiro.

## Escola e pais

- Hierarquia clara: o que precisa de ação (aprovar jogos, revisar tópicos) vem primeiro.
- A IA só sugere. Deixe claro na interface que a decisão é da escola (botões de aprovar ou recusar explícitos).
- O resumo para os pais informa os tópicos e incentiva a pesquisa. **Não sugere ações.**
- Dados de desempenho simplificados, com gráficos simples e legíveis.
