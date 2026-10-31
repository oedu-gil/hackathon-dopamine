# Seleção, tempos e comprovação

## Escolher desenhos e tempos separadamente

1. Identificar ação útil e pausas. Para ciclo, marcar fase e emenda; para ação única, marcar início, evento e retorno.
2. Anotar principais e passagens; seguir mão/cotovelo/ombro, cabeça/quadril e apoios. Reservar desenhos para recuperação, não somente para o evento.
3. Escolher orçamento de desenhos e tempo de gameplay em conjunto. Preservar movimento de uma fonte longa com poucos desenhos pode exigir mais quadros ou outra duração; explicar o compromisso.
4. Guardar origem real e tempo de reprodução separado. O espaço entre timestamps de desenhos escolhidos não é automaticamente um hold aceitável. Se o corpo continua movendo na fonte, congelá-lo cria uma variante temporal que precisa ser avaliada.
5. Inspecionar contato numerado, mas julgar também reprodução contínua. Rever a variante no tamanho de jogo e sem pausas extras para leitura de rótulos. Preservar timing desigual quando justificado; duração uniforme não é correção universal.

Não definir limite universal de hold ou FPS: idle, corrida, ações estilizadas e efeitos pedem ritmos diferentes. Registrar maior hold e justificá-lo em relação à atuação. Desenhos quase iguais podem desperdiçar um orçamento curto, mas removê-los sem retiming também pode prejudicar a ação.

## Distinguir causas

| Evidência | Primeiro ajuste |
|---|---|
| Fonte boa, variante travada | rever trecho, distribuição de desenhos e tempos; comparar no mesmo material |
| Transição com salto grande | buscar passagem na fonte; redistribuir orçamento; se não couber, discutir mais desenhos |
| Ação lenta ou demora a responder | separar espera/idle do estado ativo e avaliar retiming; ajustar evento e regras |
| Parece andar sobre gelo | conferir contato, fase, escala e velocidade do código; não recentralizar todos os pés |
| Ciclo dá tranco | revisar fase, direção/velocidade na emenda e duplicação de extremos |
| Deriva introduzida pelo processamento | corrigir pivô comum/recorte; não gerar de novo |
| Anatomia/identidade quebram na fonte | rever geração/referência; alinhamento não corrige |
| Quadros bons e playback irregular | investigar reprodução/carregamento no runtime; não atribuir tudo à seleção |

## Evidência antes de concluir

Separar quatro verificações: arquivo correto; ordem/eventos corretos no runtime; movimento contínuo observado; revisão do usuário. Screenshot e testes unitários não substituem a terceira. Se não puder observar reprodução, entregar prévia e teste acessível e marcar fluidez pendente.

Prévia GIF pode arredondar tempos e reduzir cores. Dados exatos pertencem aos metadados; o runtime do jogo é a verificação final. Loop de uma prévia de ação única é conveniência de revisão, não comando para repetir a ação no jogo.

## Seleção JSON do exportador

```json
{
  "loop": false,
  "events": [{"name": "release", "frame_index": 1}],
  "frames": [
    {"file": "frame-0048.png", "source_timestamp_ms": 2000, "duration_ms": 60, "role": "preparacao"},
    {"file": "frame-0054.png", "source_timestamp_ms": 2250, "duration_ms": 80, "role": "soltura"}
  ]
}
```

Exemplo de formato, não uma animação recomendada. Paths são relativos a `--frames`; timestamps devem vir da fonte. O exportador mantém o modo RGB/RGBA das imagens, células comuns e tamanho original. Fundo deve ser tratado previamente e avaliado. Comando: `python scripts/exportar.py --frames <pasta> --selection <json> --out <nova-pasta> --columns 4`.
