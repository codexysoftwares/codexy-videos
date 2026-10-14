# Prompts prontos — Codexy

Abra a pasta `codexy-promo` no Claude Code, copie um dos prompts abaixo, troque o que está entre `[colchetes]` e cole.
O Claude já lê o `CLAUDE.md` sozinho (marca, regras, comandos), então você não precisa explicar o projeto.

**Regra de ouro:** sempre peça para ele **pensar e te mostrar antes de executar** (gancho, roteiro, conceito visual).
Só depois de você aprovar ele gera narração/música (gasta créditos) e renderiza.

---

## 1 · Criar um Reel do zero (o fluxo completo)

```
Quero criar um Reel novo para o Instagram da Codexy.
Público: [ex.: donos de oficina mecânica em BH / qualquer dono de empresa].
Objetivo: [anúncio pago com CTA de diagnóstico gratuito / orgânico para alcance].
Tema ou dor: [ex.: orçamento que fica parado / ainda não sei, me sugira].

Siga o pipeline do CLAUDE.md e vá por etapas, esperando minha aprovação em cada uma:
1. Me sugira 8 a 12 ganchos e ranqueie (para o dedo? filtra o público? funciona no mudo?).
2. Para o gancho escolhido, descreva o gancho visual segundo a segundo.
3. Escreva o roteiro em tabela (tempo, imagem, texto na tela, narração), 25–35 s, com uma virada que não seja "sem × com o sistema".
4. Só depois que eu aprovar: gere a narração (voz Paulo), busque imagens reais grátis, monte o vídeo a 60 fps,
   confira os quadros-chave olhando as imagens, corrija o que estiver desalinhado e me mande a prévia.
5. Render final em Full HD só quando eu aprovar a prévia.
```

## 2 · Carrossel de alta qualidade

```
Quero um carrossel novo (1080×1350) para o Instagram da Codexy, com qualidade máxima.
Tema: [ex.: Raio-X #3 de uma oficina mecânica fictícia / quanto custa uma planilha mal feita].

Antes de executar, me apresente: o conceito visual, a capa (o que aparece e por que faz sentido com o texto)
e o conteúdo slide a slide. Use como referência de nível a série Raio-X (src/estaticos/raiox/).
Estrutura: capa com tensão → um ponto por slide → síntese → slide para salvar (checklist) → CTA que pede comentário.
Tudo fictício deve estar sinalizado. Depois de aprovado, renderize com `npm run estatico`,
olhe cada slide, corrija espaçamentos/textos cortados e só então me entregue.
```

## 3 · Próximo episódio da série Raio-X

```
Crie o Raio-X #[número] da série, desmontando o processo de [tipo de negócio] (fictício, com nome inventado).
Reaproveite o sistema visual de src/estaticos/raiox/Xray.tsx e a estrutura do RaioXSalao.tsx
(capa com o "documento" do negócio radiografado e as fraturas em cima de onde o problema acontece,
4 achados com "por que acontece", laudo, prescrição para salvar, CTA "comenta RAIO-X").
Me mostre os 4 achados e a capa antes de produzir.
```

## 4 · Post único (para anúncio ou feed)

```
Crie um post único 1080×1350 para [anúncio pago / feed] sobre [tema].
Uma ideia só, legível em 1 segundo no celular. Me proponha 3 conceitos (texto + o que aparece),
recomende um, e só produza depois que eu escolher.
```

## 5 · Ajustar algo que já existe

```
No [nome do vídeo/carrossel], [descreva o problema, ex.: "a capa ficou estranha", "o celular sai e entra duas vezes",
"o ritmo está lento entre 8 e 12 s"]. Antes de mudar, me explique o que causa isso e o que você propõe.
```

## 6 · Organizar a semana

```
Monte o cronograma da semana de [data] seguindo os pilares do ESTRATEGIA.md, sem repetir premissa de posts recentes.
Me mostre a tabela (dia, tipo, tema, pilar) para aprovar. Depois produza os posts, coloque no calendario.json
com as legendas e rode `npm run organizar`.
```

## 7 · Legendas

```
Escreva a legenda do post [nome] para o Instagram (gancho na 1ª linha, 3–5 linhas, CTA de diagnóstico gratuito
no WhatsApp/link na bio, hashtags do nicho + #bh #codexy) e o texto do anúncio (título, texto principal, botão).
```

---

### Primeira vez nesta máquina
```
npm install
npm run broll -- restaurar     # baixa os vídeos de banco usados nos projetos (não ficam no Git)
npm run dev                    # abre o Studio para ver/revisar
```
Coloque o arquivo `.env` (chave do ElevenLabs, recebida em privado) na raiz da pasta antes de gerar narração, música ou efeitos.
