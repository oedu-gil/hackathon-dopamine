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
gerarPdfEmBranco('pdi-em-branco.pdf')
