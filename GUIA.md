# Guia de uso — Vídeos Codexy

Este repositório é a nossa "fábrica" de vídeos para redes sociais (Reels, Shorts, TikTok).
Os vídeos são feitos **com código** usando o [Remotion](https://www.remotion.dev), e quem escreve
esse código é o **Claude Code**: a gente descreve o vídeo em português e ele monta as cenas,
as animações e a sincronia com a narração.

Você não precisa saber programar para usar. Precisa saber **descrever bem o que quer**.

> **Começando agora?** Depois de instalar (seção 2), rode `npm run broll -- restaurar` e abra o
> **[PROMPTS.md](PROMPTS.md)**: lá estão prompts prontos para criar Reel, carrossel, post único,
> o próximo Raio-X, ajustes, cronograma e legendas. O `CLAUDE.md` já ensina ao Claude a marca e as regras,
> e o `ESTRATEGIA.md` explica a linha de conteúdo.

---

## 1. O que já existe

| Vídeo | Ideia | Duração |
|---|---|---|
| `dor-solucao` | Caos da empresa → solução Codexy (sistemas, sites, chatbots) | ~26s |
| `chatbot-24h` | Um relógio rodando 24h e o chatbot atendendo de madrugada | ~27s |
| `como-trabalhamos` | Objeções → nosso processo em 4 etapas → garantias | ~27s |
| `como-trabalhamos-narrado` | Mesmo vídeo acima, com narração | ~38s |
| `manifesto` | Vídeo de marca com emblema 3D, narração e trilha do ElevenLabs | ~30s |
| `custo-planilha` | O custo escondido da planilha, em formato de nota fiscal | ~30s |
| `vida-de-um-pedido` | Um pedido atravessando o sistema, em 3D isométrico | ~30s |
| `ultima-luz` | Cidade 3D em miniatura: a última luz acesa é a de quem não tem sistema | ~40s |
| `antes-depois` | Mesma empresa, antes e depois do sistema, com troca de telas | ~30s |
| `mesma-sexta` | **Reels de anúncio** para restaurantes: a mesma sexta-feira duas vezes (caos → rebobina → organizada) e CTA de diagnóstico gratuito | ~31s |

> O `manifesto` usa fotos de um cliente que ficam só na máquina do Kaike (`public/projetos/`,
> fora do Git). Na sua máquina essa cena abre sem as fotos — é esperado.

Todos são verticais (1080×1920), com a identidade da Codexy: azul-marinho, azul elétrico,
fontes Hanken Grotesk + JetBrains Mono, transição com o chevron do "X" e CTA para
codexy.com.br e @codexy.ai.

---

## 2. Preparar o computador (uma vez só)

Instale:

1. **Node.js** (versão 20 ou mais nova): https://nodejs.org
2. **Git**: https://git-scm.com
3. **Claude Code** (precisa de plano pago da Anthropic): https://claude.com/claude-code
   — pode usar no terminal ou pela extensão do VS Code.

Depois, no terminal:

```bash
git clone https://github.com/codexysoftwares/codexy-videos.git
cd codexy-videos
npm install
npx skills add remotion-dev/skills
```

O último comando instala o "manual do Remotion" para o Claude Code. É ele que faz o Claude
seguir as boas práticas de animação, transições, áudio e renderização.

Para testar, rode:

```bash
npm run dev
```

Vai abrir o **Remotion Studio** no navegador (http://localhost:3000). Na lateral esquerda
aparecem os vídeos, cada um em uma pasta. Clique em um e dê play.

---

## 3. Como as pastas estão organizadas

Cada vídeo tem **um nome** (ex.: `como-trabalhamos`) e esse nome se repete em todo lugar:

```
src/videos/como-trabalhamos/        ← as cenas do vídeo (código)
public/narracao/como-trabalhamos/   ← roteiro da narração + áudios
out/como-trabalhamos/               ← os MP4 finais (não vão para o Git)
```

O que é comum a todos os vídeos fica em:

```
src/shared/      ← cores, fontes, fundo animado, transição chevron, tela final (CTA)
public/brand/    ← logos
public/music/    ← trilhas
public/sfx/      ← efeitos sonoros
```

---

## 4. Criar um vídeo novo com o Claude Code

Abra o Claude Code dentro da pasta do projeto e siga estes passos.

### Passo 1 — Roteiro em linguagem normal

Descreva o vídeo como contaria para alguém. Exemplo:

> Quero um vídeo novo chamado `antes-depois`, vertical, uns 25 segundos, sem narração.
> Mostra em tela dividida uma empresa usando planilha e WhatsApp de um lado, e o mesmo
> processo num sistema limpo do outro. No final, CTA padrão da Codexy.

Peça para ele **te mostrar o roteiro cena por cena antes de programar**. Ajuste o que quiser.

### Passo 2 — Deixe ele construir e veja no Studio

Com o `npm run dev` aberto, as mudanças aparecem no navegador na hora.
Assista **uma cena por vez** e peça ajustes específicos:

> Na cena 2, o texto entra rápido demais. Deixa 1 segundo a mais na tela.

> Troca a cor do destaque da cena 3 para o azul elétrico da marca.

> A transição entre a cena 4 e a 5 ficou brusca, usa o fade.

Quanto mais específico, melhor o resultado.

### Passo 3 — Gerar o MP4

```bash
npm run render -- antes-depois
```

O arquivo sai em `out/antes-depois/antes-depois.mp4`. Demora alguns minutos
(o progresso aparece no terminal).

---

## 5. Vídeos com narração

A narração é gerada por IA no **Google AI Studio** (gratuito):
https://aistudio.google.com/generate-speech

**Importante:** gere a narração **inteira de uma vez**, em um único áudio. Quando gera uma
frase por vez, a entonação muda de um trecho para outro e fica estranho.

1. Peça para o Claude Code criar o arquivo `public/narracao/<video>/roteiro.json`
   com o texto de cada fala.
2. Rode:
   ```bash
   npm run roteiro -- <video>
   ```
   Ele mostra o **estilo** e o **texto** prontos para colar no AI Studio.
3. No AI Studio: modo *Single-speaker*, escolha a voz (usamos as mesmas em todos os vídeos),
   cole o estilo e o texto e gere.
4. Salve o áudio como `public/narracao/<video>/original/completo.wav`.
   Se já existia um, mova o antigo para `public/narracao/<video>/_versoes/`.
5. Rode:
   ```bash
   npm run narracao -- <video>
   ```
   Ele corta o áudio nas pausas e cria um arquivo por fala (`01-....wav`, `02-....wav`...).
6. Peça para o Claude Code **sincronizar as cenas com a narração**. Ele mede cada fala e
   ajusta os tempos (ex.: um texto aparecer exatamente quando a palavra é dita).
7. `npm run render -- <video>-narrado`

> Se a pronúncia de "Codexy" sair estranha, escreva "Códexi" só no texto do AI Studio.

---

### Narração e música com ElevenLabs (melhor qualidade)

Temos plano pago no ElevenLabs (vozes brasileiras + licença comercial). Peça a chave de API
para o Kaike e coloque num arquivo `.env` na raiz do projeto (ele nunca vai para o Git):

```
ELEVENLABS_API_KEY=...
```

- **Narração:** no `roteiro.json` do vídeo, o bloco `elevenlabs` define a voz. Para público
  brasileiro use o **Paulo** (`Qrdut83w0Cr152Yb4Xn3`, pt-BR) — a Elena Vinter soa com sotaque
  de Portugal. Copie o `roteiro.json` do `mesma-sexta` como modelo. Rode `npm run tts -- <video>`
  (gera a narração inteira num pedido só, com o tempo de cada palavra) e depois
  `npm run narracao -- <video>` (corta um arquivo por fala).
- **Refazer só uma fala:** se uma frase saiu mal falada, mude o texto dela no `roteiro.json`
  (dá para pôr `voice_settings` só nela, ex.: `stability` mais alto para uma fala mais limpa) e rode
  `npm run tts:fala -- <video> 06-cta.wav`. Só aquela fala é regenerada, usando as vizinhas
  como referência de entonação.
- **Economia de créditos:** os créditos são da conta da Codexy e compartilhados. Aprove o roteiro
  antes, gere uma vez só e evite "testes" — nomes de marca (ex.: "Codexy") costumam sair mal
  pronunciados, então prefira deixar a marca na tela e fora da fala.
- **Música sob medida:** descreva as seções da trilha (intro, build-up, drop, final) com a
  duração de cada uma em `public/music/<nome>.plan.json` e rode `npm run musica -- <nome>`.
  A música nem sempre respeita os tempos exatos — o Claude Code analisa as batidas e encaixa
  o vídeo nelas.

---

## 6. Regras da marca (o Claude já segue, mas vale saber)

- **Cores:** azul-marinho `#00143D` e azul elétrico `#0055FF`.
- **Som:** efeitos discretos. **Nada de "ding", "plim" ou som de notificação** — passa
  sensação de amador e tira credibilidade.
- **Números:** não inventar prazos, percentuais ou resultados. Só usar número real que a
  gente consiga provar.
- **Ritmo:** menos elementos por cena, texto grande, tempo para ler.
- **Área segura:** nada importante muito embaixo da tela — no Reels a legenda e os botões
  cobrem essa parte.
- **CTA:** codexy.com.br · @codexy.ai
- **Anúncios:** não usar nome nem logo de outras marcas (ex.: escreva "app de delivery", não
  "iFood"), não afirmar características pessoais de quem assiste ("você está endividado?") e não
  citar cliente sem contrato fechado e autorização para anúncio.

---

## 7. Comandos — resumo

| Comando | O que faz |
|---|---|
| `npm run dev` | Abre o Studio para ver os vídeos ao vivo |
| `npm run render -- <id>` | Gera o MP4 em `out/<video>/` |
| `npm run roteiro -- <video>` | Mostra o texto da narração para colar no AI Studio |
| `npm run narracao -- <video>` | Corta o `completo.wav` em um arquivo por fala |
| `npm run tts -- <video>` | Gera a narração inteira no ElevenLabs (precisa do `.env`) |
| `npm run tts:fala -- <video> <arquivo>` | Refaz só uma fala no ElevenLabs |
| `npm run musica -- <nome>` | Compõe a trilha a partir de `public/music/<nome>.plan.json` |
| `npm run sfx` | Recria os efeitos sonoros "soft" |

---

## 8. Problemas comuns

**O render está demorando.** É normal: 30 segundos de vídeo levam alguns minutos.
Para ajustes, use o Studio (`npm run dev`) e só renderize a versão final.

**A fonte apareceu diferente.** As fontes vêm do Google Fonts; precisa de internet
no primeiro uso.

**O `npm run narracao` disse que encontrou menos trechos.** As pausas entre os parágrafos
ficaram curtas demais. Gere de novo pedindo pausas maiores no estilo, ou peça para o
Claude Code ajustar o corte.

**Quero voltar uma narração antiga.** Os takes anteriores ficam em
`public/narracao/<video>/_versoes/`.

---

## 9. Trabalhando em equipe no Git

- Antes de começar: `git pull`
- Ao terminar um vídeo ou ajuste: peça para o Claude Code fazer o commit e o push,
  ou rode `git add`, `git commit` e `git push`.
- Os MP4 (`out/`) **não** vão para o Git — compartilhe pelo Drive/WhatsApp.
  Qualquer pessoa pode gerar de novo com `npm run render`.
