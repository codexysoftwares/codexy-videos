# Codexy · fábrica de conteúdo (Remotion)

Este projeto produz os vídeos (Reels) e posts estáticos (carrossel / post único) do Instagram da **Codexy**,
software house de Belo Horizonte: sistemas sob medida, sites e chatbots/atendimento no WhatsApp.
Tudo é código (Remotion + React). Vídeo e imagem saem renderizados localmente, sem custo.

Leia também: `ESTRATEGIA.md` (pilares, regras, banco de ideias, cronograma) e `GUIA.md` (instalação e comandos).

## Marca

- Cores: azul-marinho `#00143D`, azul elétrico `#0055FF`, brilho `#3377FF`, gelo `#E8EEFF`, menta (sucesso) `#14C79A`, vermelho (problema) `#FF3B5C`.
- Fontes: Hanken Grotesk (texto) + JetBrains Mono (rótulos, números, "cara de sistema"). Ver `src/shared/theme.ts`.
- Logos: `public/brand/codexy-logo-light.png` (fundo escuro) e `codexy-logo.png` (fundo claro).
- CTA padrão: **"Diagnóstico gratuito no WhatsApp"** + `@codexy.ai` (link na bio). Botão verde `#25D366`.

## Regras da casa (não negociáveis)

1. **Nada de número inventado.** Valor ilustrativo sempre marcado: "exemplo", "simulação", "dados de exemplo".
2. **Nada de cliente real** (nomes, logos, fotos) sem autorização por escrito. Negócio fictício é permitido, mas sempre sinalizado ("fictício", "projeto conceito").
3. **Anúncio:** sem nome/logo de outras marcas (escreva "app de delivery", não "iFood"); não afirmar característica pessoal de quem assiste ("você está endividado?").
4. **Som sóbrio.** Nunca "ding", "plim" ou som de notificação/verificado. Use whoosh, impacto suave, vibração, cliques de UI.
5. **Nunca repetir a mesma premissa** em posts seguidos. Fórmulas já usadas e que NÃO devem voltar: "sem × com o sistema / rebobina e mostra de novo", relógio grande no topo como fio condutor, "mensagem sem resposta" (já saiu no reel de clínica).
6. **Sem rosto/voz do Kaike** por enquanto. Narração: voz **Paulo** (ElevenLabs, pt-BR).
7. **Economia:** roteiro aprovado em texto ANTES de gerar narração/música. Gerar uma vez. Revisar no Studio, renderizar em alta só no final.

## Como produzir (pipeline)

### Reel (vídeo vertical 1080×1920, 60 fps)
1. Ideia → **gancho** (ranquear 8–12 opções: para o dedo? filtra dono de empresa? funciona no mudo?) → **gancho visual** (o 1º quadro já mostra o conflito, movimento antes de 0,3 s).
2. Roteiro em tabela (tempo · imagem · texto na tela · narração), ~25–35 s, corte a cada 1–2 s. Aprovar.
3. `public/narracao/<video>/roteiro.json` (copie de `ferias-47`) → `npm run tts -- <video>` → `npm run narracao -- <video>`.
   `palavras.json` tem o tempo de cada palavra: **todo texto e animação deve ser amarrado a esses tempos**.
   Frase saiu mal falada? Ajuste o texto e `npm run tts:fala -- <video> <arquivo>.wav` (refaz só ela).
4. Imagens reais grátis: `npm run broll -- busca "<termo em inglês>"` → olhar a prévia → `npm run broll -- baixar <video> <id> <nome>`.
5. Sons sob medida: `npm run sfx:ia -- <nome> "<descrição em inglês>" [segundos]` (~100 créditos cada). Já existem vários em `public/sfx/ia-*.mp3`.
6. Música: reaproveite `public/music/*.mp3` (recortando trechos) ou componha com `public/music/<nome>.plan.json` + `npm run musica -- <nome>` (seções ≥ 3 s).
7. Código em `src/videos/<video>/` e registro em `src/Root.tsx`. Referência de padrão atual: `src/videos/ferias-47/Ferias47.tsx` e `src/videos/olhos-do-paciente/`.
8. Conferir quadros-chave com stills (`npx remotion still <id> out.png --frame=N --scale=0.4`) **olhando a imagem**, corrigir, e só então
   `npx remotion render <id> out/<video>/<video>.mp4 --gl=angle --concurrency=3 --crf=16`.

### Post estático / carrossel (1080×1350, 4:5)
- Componentes em `src/estaticos/` (1 frame da composição = 1 slide, `fps={1}`), registrados no `Root.tsx` na pasta "estaticos".
- Renderizar: `npm run estatico -- <id> [<id>...]` → PNGs em `out/estaticos/<id>/`.
- Base visual: `src/estaticos/Slide.tsx` (padrão) e **`src/estaticos/raiox/Xray.tsx` (série Raio-X: chapa de raio-x, achados, laudo, prescrição)** — é o nível de qualidade esperado.
- Carrossel bom: capa com tensão/mistério → um achado por slide (problema + por que acontece + conta de bolso marcada como exemplo) → síntese → **slide para salvar** (checklist/ferramenta, incluindo o que dá pra fazer sem sistema) → CTA que pede comentário.
- Cada elemento visual precisa fazer sentido com o texto (ex.: a fratura fica em cima do horário que quebrou, não em um objeto aleatório).

### Kit reutilizável (`src/shared/kit/`)
- `Phone` (iPhone realista em CSS), `Chat` (WhatsApp fiel: digitação, ✓✓ azul, "digitando…", rótulo "Atendimento automático"),
  `Kinetic` (texto palavra por palavra no tempo da fala), `BRoll` (vídeo real com push-in e enquadramento `focusX`),
  `motion.ts` (`at`, `lin`, `spr` mola, `life`, `bump` — tudo em segundos).
- Desfoque de movimento: `CameraMotionBlur` só no render final (`getRemotionEnvironment().isRendering`), senão o Studio trava.

### Cronograma e entrega
- Agenda em `calendario.json` (data, tipo, arquivos, legenda, texto do anúncio).
- `npm run organizar` monta `../postagens/<data>_<dia>/<tipo>_<nome>/` com arquivos numerados + `legenda.txt`.

## Armadilhas conhecidas
- **Disco cheio (ENOSPC):** cada render copia `public/` para `%TEMP%\remotion-*`. Se falhar, apague essas pastas.
- **Edição de arquivo via shell:** `node -e` com `\n` e crases dentro de aspas quebra o código. Prefira editar o arquivo direto.
- `@remotion/media` `Video`: `objectFit` é prop, não CSS. `Audio` aceita `trimBefore` (em frames) e `volume` como função.
- Clipes de vídeo (`public/broll/**/*.mp4`) não vão pro Git: depois de clonar rode `npm run broll -- restaurar`.
- Créditos do ElevenLabs são compartilhados: narração ~1 crédito/caractere, música e efeitos também gastam.
