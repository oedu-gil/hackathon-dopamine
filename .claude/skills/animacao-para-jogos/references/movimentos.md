# Contratos por tipo de movimento

Estas orientações adaptam o planejamento; não são promessas de que uma geração seguirá o plano.

| Tipo | Planejar | Avaliar em movimento |
|---|---|---|
| Repouso/idle | respiração ou pequena transferência de peso; apoios e pivô; amplitude adequada à personalidade | rosto e volume constantes, pés sem flutuar; ciclo sem pausa/estalo na emenda; movimentos secundários não competem com o principal |
| Caminhada/corrida | ciclo completo, contatos de cada pé, passagem, compressão e extensão; deslocamento ou corrida no lugar | fases e apoio coerentes; velocidade compatível com deslocamento no jogo; evitar deslizamento durante contato; cauda/capa com atraso coerente |
| Ataque/arremesso/interação | preparação, antecipação, passagem, evento, acompanhamento e recuperação; objetos e mão envolvidos | trajetória contínua, evento sincronizado, recuperação suficientemente representada; começo/fim compatíveis com estados adjacentes |
| Salto/queda/pouso | impulso, saída do chão, subida, ápice, descida, contato e absorção; separar fases dirigidas pela física quando necessário | arco e gravidade coerentes; evento de contato ligado ao jogo; não comprimir toda altura dentro de célula recentralizando o corpo |
| Reação/dano/morte | direção/causa, intensidade e retorno ou pose terminal; possibilidade de interrupção | leitura rápida, direção coerente; pose terminal sustentada intencionalmente; sem retorno involuntário causado pelo loop |
| Objetos/props | pivô mecânico, dobradiça/centro de rotação, peças rígidas e deformáveis | integridade das peças, eixo estável; evento de abrir/fechar ou ativar coerente com colisão |
| Efeitos | origem, expansão, trajetória, dissipação e opacidade; ciclo ou explosão única | leitura no fundo do jogo, sem saltos no pivô; dissipação real e sem corte; margem para expansão |

## Ciclos

Selecionar de um ponto de fase até antes de sua repetição. Não duplicar automaticamente primeiro e último desenhos: pode criar um hold na emenda. Ver também as transições último → primeiro → segundo, em repetição por vários ciclos.

Uma pose inicial/final parecida não garante emenda: verificar direção e velocidade aparentes de cabeça, mãos, pés e elementos secundários. Não usar ping-pong como atalho para respiração, passada ou física sem observar se a reversão faz sentido.

Para locomoção, marcar contatos por pé e esclarecer quem movimenta o personagem: a animação ou o código. Na animação no lugar, o contato pode recuar no canvas enquanto o código avança o personagem. Não fixar esse pé ao mesmo ponto da imagem em todos os desenhos. Separar arranque/parada do ciclo quando necessário.

## Estado e identidade

Comparar ângulo, volume e pivô com animações adjacentes. Não alinhar cada frame por uma característica que muda intencionalmente. Um salto conserva altura; um giro conserva trajetória; um idle conserva apoio sem apagar respiração. Detalhes assimétricos podem impedir espelhamento direto.
