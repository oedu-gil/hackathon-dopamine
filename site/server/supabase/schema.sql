-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em Run.
-- Ele recria as tabelas do site e carrega os dados de demonstração.
-- Atenção: as senhas ficam em texto puro. Isto é só para a demo do hackathon.

drop table if exists resultados, aprovacoes, pdis, usuarios, jogos, alunos cascade;

create table alunos (
  id text primary key,
  nome text not null,
  hiperfoco text            -- id do tema (trem, aranha, aviao, dinossauro; os mesmos do hub); null = ainda não escolheu
);

create table usuarios (
  id text primary key,
  email text unique not null,
  senha text not null,
  nome text not null,
  perfil text not null check (perfil in ('escola', 'responsavel', 'crianca')),
  aluno_id text references alunos(id)
);

-- Catálogo de jogos. game_id segue GAME_IDS de src/core/contracts.js.
-- As habilidades de cada jogo são provisórias: combinar com quem faz os jogos.
create table jogos (
  id text primary key,
  nome text not null,
  descricao text not null,
  habilidades text[] not null
);

create table pdis (
  id bigint generated always as identity primary key,
  aluno_id text not null references alunos(id),
  arquivo text not null,
  itens jsonb not null,       -- [{ habilidade, nivel }]
  resumo_pais jsonb,          -- { topicos, porHabilidade, aviso } de pdi/src/processarPdi.js
  erro text,
  criado_em timestamptz not null default now()
);

create table aprovacoes (
  aluno_id text not null references alunos(id),
  jogo_id text not null references jogos(id),
  status text not null check (status in ('sugerido', 'aprovado', 'recusado')),
  atualizado_em timestamptz not null default now(),
  primary key (aluno_id, jogo_id)
);

-- Mesmo formato de createResult() em src/core/contracts.js.
create table resultados (
  id bigint generated always as identity primary key,
  aluno_id text not null references alunos(id),
  jogo_id text not null references jogos(id),
  status text not null check (status in ('completed', 'abandoned')),
  attempts int not null check (attempts >= 0),
  correct int not null check (correct >= 0 and correct <= attempts),
  hints int not null default 0 check (hints >= 0),
  criado_em timestamptz not null default now()
);

-- O site acessa o banco só pelo servidor, com a service role key.
-- RLS ligado sem políticas bloqueia o acesso direto com a chave pública.
alter table alunos enable row level security;
alter table usuarios enable row level security;
alter table jogos enable row level security;
alter table pdis enable row level security;
alter table aprovacoes enable row level security;
alter table resultados enable row level security;

insert into alunos (id, nome, hiperfoco) values ('ana', 'Ana', null);

insert into usuarios (id, email, senha, nome, perfil, aluno_id) values
  ('escola-1', 'escola@demo.com', 'demo', 'Escola Sol Nascente', 'escola', null),
  ('resp-1', 'familia@demo.com', 'demo', 'Família da Ana', 'responsavel', 'ana'),
  ('crianca-1', 'ana@demo.com', 'demo', 'Ana', 'crianca', 'ana');

-- Catálogo de jogos: fonte são os manifestos em hub/src/jogos/*/manifesto.js.
-- Depois de mudar um manifesto, rode `npm run sincronizar-jogos` em site/server.
insert into jogos (id, nome, descricao, habilidades) values
  ('memoria', 'Jogo da memória', 'Vire as cartas e encontre os pares de figuras.', array['reconhecer-emocoes']),
  ('sequencia', 'Complete a sequência', 'Olhe a fila de figuras e descubra qual vem depois.', array['resposta-social', 'empatia']),
  ('chuva-emocoes', 'Chuva de emoções', 'Rostos caem do céu. Pegue só a emoção pedida!', array['reconhecer-emocoes']),
  ('cuidar-amigo', 'Cuidar do amigo', 'Um amigo está com um sentimento. Arraste o que ajuda!', array['empatia', 'causa-efeito-social']),
  ('plataforma-amigo', 'Plataforma do amigo', 'Corra, pule e ajude os amigos que encontrar pelo caminho.', array['resposta-social', 'empatia']),
  ('quebra-cabeca', 'Quebra-cabeça', 'Toque numa peça e depois na casa dela para montar a imagem inteira.', array['relacao-parte-todo']);
