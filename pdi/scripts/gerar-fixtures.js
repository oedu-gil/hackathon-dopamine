import PDFDocument from 'pdfkit'
import { createWriteStream, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DESTINO = path.join(__dirname, '..', 'test', 'fixtures')

const PDI_PEQUENO = `PDI - Exemplo pequeno (uso interno, ficticio)

Aluno: L., 7 anos. Diagnostico: TEA (nivel 1 de suporte).

Avaliacao multiprofissional: L. demonstra dificuldade em identificar
expressoes faciais dos colegas e nomear o que sente diante de situacoes
do dia a dia. Em momentos de conflito no recreio, nao associa a propria
atitude a reacao do colega (eu empurrei, por isso ele chorou),
respondendo de forma impulsiva.

Objetivos a trabalhar:
1. Reconhecer e nomear emocoes basicas (alegria, tristeza, raiva, medo)
em si e nos colegas.
2. Praticar respostas sociais adequadas em situacoes de conflito ou
convite para brincar (pedir para entrar na brincadeira, esperar a vez).
3. Compreender a relacao entre uma atitude propria e a reacao do outro
(causa e efeito social).
4. Desenvolver empatia ao perceber como o colega se sente diante de uma
situacao.

Estrategias: apoio visual com cartoes de emocoes, historias sociais,
mediacao do professor em situacoes de conflito.`

const PDI_REALISTA = `Ano Letivo: 2026

Periodo de Referencia: 1o Semestre

1. Identificacao do Aluno
Nome do Aluno: Lucas Silva Santos

Data de Nascimento: 14/05/2018 (Idade: 7 anos)

Ano/Turma: 2o Ano do Ensino Fundamental I - Turma B

Professora Regente: Maria Clara Oliveira

Profissional de Apoio / Mediador: Renata Souza

Especialista AEE (Atendimento Educacional Especializado): Juliana Costa

Responsaveis Legais: Ana Paula Silva e Roberto Santos

2. Diagnostico e Contexto Clinico
Hipotese Diagnostica / CID: TEA (CID-11: 6A02.0) - Nivel de Suporte 1 (Leve/Moderado em comunicacao social).

Acompanhamentos Externos: Terapia Ocupacional (1x/semana), Fonoaudiologia (1x/semana).

Uso de Medicacao: Nao faz uso em horario escolar.

Alergias / Restricoes: Intolerancia a lactose e hipersensibilidade a ruidos agudos.

3. Perfil do Aluno e Habilidades Iniciais (Linha de Base)
Comunicacao e Linguagem:

Comunicacao verbal funcional; constroi frases de 3 a 5 palavras. Apresenta ecolalia esporadica sob ansiedade. Compreende comandos diretos e simples com suporte visual.

Interacao Social e Convivencia:

Brinca predominantemente em paralelo. Demonstra interesse em interagir, mas precisa de mediacao para iniciar conversas ou compartilhar brinquedos.

Aspectos Sensoriais e Comportamentais:

Busca estimulos proprioceptivos (pular, correr). Apresenta sensibilidade auditiva em locais cheios (recreio, eventos). Apresenta hiperfoco em dinossauros e planetas.

Habilidades Academicas:

Identifica o alfabeto e numeros ate 30. Esta em fase de alfabetizacao silabica. Boa coordenacao motora grossa; trabalhando preensao palmar e tracado de letras.

Autonomia e Atividades da Vida Diaria (AVD):

Alimenta-se sozinho, necessita de incentivo visual para ir ao banheiro nos horarios combinados e guardar materiais.

4. Objetivos, Metas e Adaptacoes Pedagogicas
Area 1: Pedagogica / Cognitiva
Objetivo Geral: Desenvolver a leitura e escrita silabica e operacoes simples de adicao.

Metas de Curto/Medio Prazo:

Reconhecer e escrever palavras simples compostas por silabas canonicas (ex.: BOLA, SAPO).

Realizar contagem e associacao termo a termo ate 20 utilizando material dourado.

Adaptacoes Curriculares:

Atividades impressas com fonte ampliada, espacamento maior e reducao de poluicao visual.

Uso do hiperfoco (animais/planetas) em enunciados de problemas matematicos.

Divisao de tarefas longas em etapas menores com "checklists" visuais.

Area 2: Habilidades Sociais e Comunicacao
Objetivo Geral: Estimular o inicio e manutencao de interacoes com pares.

Metas de Curto/Medio Prazo:

Participar de jogos de regras simples em duplas com mediacao.

Solicitar ajuda ou pedir um item ao colega verbalmente ou por cartoes PECS.

Estrategias:

Uso de historias sociais antes de atividades em grupo.

Designacao de um "amigo tutor" durante brincadeiras estruturadas no patio.

Area 3: Regulacao Emocional e Sensorial
Objetivo Geral: Ampliar a autorregulacao em momentos de sobrecarga sensorial ou frustracao.

Metas de Curto/Medio Prazo:

Identificar o inicio de cansaco ou sobrecarga e sinalizar usando o "cartao de pausa".

Permanecer em sala durante atividades sonoras utilizando abafador de ruidos.

Recursos e Adaptacoes:

Disponibilizacao de abafadores de ruido auriculares.

Cantinho de autorregulacao na sala (almofadas, livros favoritos e brinquedos de textura/fidget).

Rotina visual fixada na carteira com imagens passo a passo do dia.

5. Adequacoes nas Avaliacoes
Tempo estendido (20 a 30 minutos a mais) para resolucao de avaliacoes.

Leitura mediada das questoes pelo professor ou profissional de apoio.

Realizacao de provas em ambiente silencioso ou em sala de recursos quando necessario.

Priorizacao de avaliacoes formativas e continuas (portfolio, projetos e registros diarios) em vez de notas unicas de testes.

6. Parceria Escola-Familia e Terapias
Canal de Comunicacao: Agenda diaria de recados (fisica ou digital) com registro simplificado de humor, alimentacao e avancos do dia.

Reunioes de Alinhamento: Trimestrais com a familia e equipe pedagogica.

Alinhamento com Terapeutas: Envio de relatorios semestrais da escola para fonoaudiologa e terapeuta ocupacional do aluno.

7. Parecer Descritivo e Evolutivo (Fechamento)
"Durante o periodo avaliado, Lucas demonstrou excelente avanco na compreensao da rotina escolar, reduzindo episodios de desorganizacao no inicio das aulas. Com o suporte da rotina visual, ja executa a transicao entre atividades de forma independente. Seguiremos priorizando a alfabetizacao por meio de temas de interesse do aluno e reforcando as interacoes espontaneas no recreio."

8. Assinaturas e Ciencia

Professora Regente

Coordenacao Pedagogica / AEE

Responsaveis Legais

Data de Validacao: ____ / ____ / 2026`

const PDI_ANA = `PDI - Plano de Desenvolvimento Individual (exemplo ficticio para demonstracao)

Ano Letivo: 2026 - Periodo de Referencia: 2o Semestre

1. Identificacao do Aluno
Nome do Aluno: Ana
Idade: 6 anos
Ano/Turma: 1o Ano do Ensino Fundamental I - Turma A
Professora Regente: Helena Prado
Especialista AEE: Carolina Matos
Responsaveis Legais: Familia da Ana

2. Diagnostico e Contexto Clinico
Hipotese Diagnostica: TEA - Nivel de Suporte 1.
Acompanhamentos Externos: Psicologia (1x/semana) e Fonoaudiologia (1x/semana).
Observacao: sensibilidade a ruidos altos; nao faz uso de medicacao em horario escolar.

3. Perfil do Aluno (Linha de Base)
Emocoes: Ana tem dificuldade em reconhecer expressoes faciais de alegria, tristeza, raiva e medo nos colegas e em nomear o que ela propria sente. Em momentos de frustracao chora ou se afasta sem conseguir dizer o motivo.

Interacao social: Ana quer brincar com os colegas, mas nao sabe como pedir para entrar na brincadeira, esperar a vez ou responder quando um colega a convida. Costuma ficar em silencio ou se afastar.

Empatia: Ana nao costuma perceber quando um colega esta triste ou machucado e nao oferece ajuda ou conforto. Precisa de mediacao para entender como o outro se sente em uma situacao.

Causa e efeito social: Ana nao associa a propria atitude a reacao do colega (por exemplo, pegar o brinquedo sem pedir e o colega chorar). Responde de forma impulsiva e depois nao entende por que o colega ficou chateado.

Raciocinio visual e organizacao: Ana tem dificuldade em perceber que as partes formam um todo. Em quebra-cabecas simples e em atividades de montar figuras, nao encaixa as pecas no lugar correto sem ajuda e se frustra quando a imagem completa nao aparece.

Habilidades academicas: reconhece letras e numeros ate 20; esta em fase de alfabetizacao silabica. Boa coordenacao motora grossa.

4. Objetivos e Metas
Area 1: Emocional
Objetivo: Reconhecer e nomear emocoes basicas (alegria, tristeza, raiva, medo) em si e nos colegas.
Meta de curto prazo: identificar a emocao em figuras e rostos com apoio de cartoes visuais.

Area 2: Resposta social
Objetivo: Praticar respostas sociais adequadas em situacoes de convite para brincar e de conflito (pedir para entrar na brincadeira, esperar a vez, responder ao colega).
Meta de curto prazo: responder a um convite do colega com palavra ou gesto em pelo menos 3 de 5 situacoes.

Area 3: Empatia
Objetivo: Desenvolver empatia, percebendo como o colega se sente e oferecendo ajuda ou conforto.
Meta de curto prazo: apontar o que ajuda um amigo triste em historias e situacoes do dia a dia.

Area 4: Causa e efeito social
Objetivo: Compreender a relacao entre uma atitude propria e a reacao do outro.
Meta de curto prazo: explicar, com apoio visual, por que o colega ficou triste ou feliz depois de uma acao.

Area 5: Relacao entre parte e todo
Objetivo: Compreender que partes formam um todo, montando figuras e quebra-cabecas de poucas pecas.
Meta de curto prazo: montar sozinha um quebra-cabeca de 4 a 6 pecas.

5. Estrategias e Adaptacoes
Apoio visual com cartoes de emocoes, historias sociais antes de atividades em grupo, mediacao da professora em conflitos, rotina visual na carteira e atividades de montar figuras com poucas pecas.

6. Parecer Descritivo
Ana e uma crianca afetuosa e demonstra interesse em estar com os colegas. Com apoio visual, ja se acalma mais rapido. Seguiremos trabalhando emocoes, interacao, empatia, causa e efeito nas relacoes e a percepcao de partes e todo.

7. Assinaturas e Ciencia
Professora Regente / Coordenacao Pedagogica / AEE / Responsaveis Legais
Data de Validacao: ____ / ____ / 2026`

function gerarPdf(nomeArquivo, texto) {
  const doc = new PDFDocument({ margin: 50 })
  doc.pipe(createWriteStream(path.join(DESTINO, nomeArquivo)))
  doc.fontSize(11).text(texto)
  doc.end()
}

function gerarPdfEmBranco(nomeArquivo) {
  const doc = new PDFDocument({ margin: 50 })
  doc.pipe(createWriteStream(path.join(DESTINO, nomeArquivo)))
  doc.end()
}

mkdirSync(DESTINO, { recursive: true })
gerarPdf('pdi-pequeno.pdf', PDI_PEQUENO)
gerarPdf('pdi-realista.pdf', PDI_REALISTA)
gerarPdf('pdi-ana.pdf', PDI_ANA)
gerarPdfEmBranco('pdi-em-branco.pdf')
