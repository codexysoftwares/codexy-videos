# Vídeos Codexy

Vídeos de marketing da Codexy feitos com [Remotion](https://www.remotion.dev). Formato vertical 1080×1920, 30fps.

## Estrutura

```
public/
  brand/                     logos
  sfx/                       efeitos sonoros (npm run sfx gera os "soft-*")
  music/                     trilhas (trilha-01.mp3, ...)
  narracao/<video>/
    roteiro.json             estilo da voz + texto de cada fala + nome do arquivo
    original/completo.wav    narração inteira, numa leitura só
    01-....wav, 02-....wav   cortes gerados pelo script (o vídeo usa estes)
    _versoes/                takes antigos (backup)
src/
  shared/                    tema (cores, fontes, sfx), fundo, transição, CTA
  videos/<video>/            cenas de cada vídeo
  Root.tsx                   registra os vídeos (um Folder por vídeo no Studio)
scripts/                     roteiro, corte de narração, render, sfx
out/<video>/<id>.mp4         vídeos finais
```

O nome `<video>` é o mesmo em todas as pastas e no id da composição (ex.: `como-trabalhamos`).
Variações usam sufixo no id: `como-trabalhamos-narrado`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Abre o Remotion Studio (prévia em tempo real) |
| `npm run roteiro -- <video>` | Mostra o estilo e o texto para colar no gerador de voz |
| `npm run tts -- <video>` | Gera a narração inteira no ElevenLabs a partir do `roteiro.json` (precisa de `ELEVENLABS_API_KEY` no `.env`) |
| `npm run narracao -- <video>` | Corta `original/completo.wav` nas pausas, gerando um arquivo por fala |
| `npm run musica -- <nome>` | Compõe uma trilha no Eleven Music a partir de `public/music/<nome>.plan.json` |
| `npm run render -- <id>` | Renderiza em `out/<video>/<id>.mp4` |

## Fluxo de um vídeo com narração

1. Escrever o `public/narracao/<video>/roteiro.json`.
2. `npm run roteiro -- <video>` → colar estilo + texto no Google AI Studio (TTS) e gerar **um áudio só**.
3. Salvar como `public/narracao/<video>/original/completo.wav` (o anterior vai para `_versoes/`).
4. `npm run narracao -- <video>` → gera `01-...wav`, `02-...wav`...
5. Ajustar os tempos das cenas à duração de cada fala e conferir no Studio.
6. `npm run render -- <video>-narrado`.

## Padrões da marca

- Cores: azul-marinho `#00143D`, azul elétrico `#0055FF` (ver `src/shared/theme.ts`).
- Fontes: Hanken Grotesk + JetBrains Mono.
- Som: efeitos discretos (`soft-*`). Nada de "ding" ou som de notificação.
- Sem números inventados (prazos, garantias): usar textos genéricos.
- Contato no CTA: codexy.com.br · @codexy.ai
