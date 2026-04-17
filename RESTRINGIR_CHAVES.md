# Guia — Restringir Chaves de API

Domínio de produção: `rsolucoes.online`
Atualizado em: 2026-04-16

---

## 1. Google Places API Key

Console: https://console.cloud.google.com/apis/credentials

### Passos:

1. Abra o link acima e selecione o projeto `my-ladingpage`
2. Clique na chave usada em `index.html` (`AIzaSyD_4F2TyECIrT_rvKaKkgn5MDNfaEgmvrk`)
3. Em **Application restrictions**, escolha **Websites**
4. Em **Website restrictions**, adicione:
   - `https://rsolucoes.online/*`
   - `https://www.rsolucoes.online/*`
   - `http://localhost/*` (para testes locais, opcional)
5. Em **API restrictions**, escolha **Restrict key**
6. Marque apenas:
   - `Places API` ou `Places API (New)`
7. Clique **Save**

> ⚠️ Se a mesma chave é usada para Firebase Auth e Places, considere
> criar uma chave separada só para Places e outra só para Firebase.

---

## 2. Firebase API Key

Console: https://console.cloud.google.com/apis/credentials

### O que verificar:

A `apiKey` do Firebase é usada no `admin_dashboard.html` e `gallery_page.js`.
Ela **não** protege dados sozinha — a proteção real vem das **Security Rules**
(que já foram deployadas).

### Passos:

1. Vá ao console de credenciais (link acima)
2. Localize a chave associada ao app web do Firebase
3. Em **API restrictions**, garanta que apenas as APIs Firebase estejam ativas:
   - Firebase Installations API
   - Identity Toolkit API
   - Token Service API
   - Firebase Realtime Database
4. **Não** inclua Places API nesta chave (use uma chave separada)
5. **Application restrictions**: adicionar domínios se possível:
   - `https://rsolucoes.online/*`
   - `https://www.rsolucoes.online/*`

---

## 3. EmailJS

Painel: https://dashboard.emailjs.com/admin

### No painel do EmailJS:

1. Acesse **Account > Security**
2. Se o plano permitir, habilite **Domain Whitelist**
3. Adicione apenas:
   - `rsolucoes.online`
   - `www.rsolucoes.online`
4. Revise se há templates ou services não utilizados e remova
5. Se suspeitar que a public key foi exposta:
   - Gere uma nova public key
   - Atualize em `index.html` na variável `EMAILJS_PUBLIC_KEY`

### Já implementado no código:

- `blockHeadless: true` — bloqueia envios de bots headless
- `limitRate.throttle: 10000` — limita a 1 envio a cada 10 segundos
- Honeypot field no formulário

---

## 4. Checklist Final

Após fazer as restrições acima:

- [ ] Testar a landing page em `https://rsolucoes.online`
- [ ] Testar envio do formulário de contato
- [ ] Testar login no `admin_dashboard.html`
- [ ] Testar upload de imagem no painel admin
- [ ] Verificar que as galerias públicas carregam imagens
- [ ] Submeter site para revisão no Google Ads
