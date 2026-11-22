# dzinhoOS 98: portfólio do Davi (dzinhoavi)

Site estático (HTML + CSS + JS puro), sem build. Estilo Windows 95/98 em vermelho, branco e preto.

## Antes de publicar
1. **LinkedIn:** em `index.html`, troque `SEU-USUARIO` pelo seu usuário do LinkedIn (2 ocorrências).
2. **Currículo:** coloque seu PDF na raiz com o nome `curriculo.pdf`.

## Deploy no Vercel
**Pelo GitHub (recomendado):**
1. Crie um repositório (ex.: `portfolio`) e envie estes arquivos.
2. Em vercel.com → *Add New → Project* → importe o repositório.
3. Framework Preset: **Other**. Não precisa de build command. Clique em *Deploy*.
4. O site fica em `https://<nome-do-projeto>.vercel.app`. Dá pra renomear em *Settings → Domains*.

**Pela CLI:**
```bash
npm i -g vercel
vercel        # primeiro deploy (preview)
vercel --prod # produção
```

## Estrutura
- `index.html`: conteúdo (textos em PT)
- `script.js`: janelas, menu Iniciar, boot e traduções EN (objeto `I18N.en`)
- `style.css`: tema
- Para ver a tela de boot de novo: `seusite.vercel.app/#boot`

## Adicionar um projeto
Copie um bloco `<article class="project">` em `index.html`, dê novas chaves `data-i18n`
e adicione o texto em inglês no `I18N.en` do `script.js`.
