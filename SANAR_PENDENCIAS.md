# Sanar Pendencias

Atualizado em 2026-04-15.

Este projeto ja esta preparado localmente para:

- usar `database.rules.json` como origem das regras do Firebase Realtime Database
- usar `vendor/emailjs.min.js` e `vendor/jszip.min.js` em vez de CDNs externos
- aplicar endurecimento local no EmailJS (`blockHeadless` e `limitRate`)

## 1. Aplicar as regras do Firebase remoto

Arquivos prontos:

- [firebase.json](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/firebase.json:1)
- [.firebaserc](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/.firebaserc:1)
- [database.rules.json](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/database.rules.json:1)
- [firebase_login.cmd](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/firebase_login.cmd:1)
- [firebase_deploy_database.cmd](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/firebase_deploy_database.cmd:1)

Passos:

1. Instale a Firebase CLI.
   Documentacao oficial: https://firebase.google.com/docs/cli

2. Faça login na CLI:

```powershell
firebase login
```

3. Na raiz deste projeto, publique somente as regras do Realtime Database:

```powershell
firebase deploy --only database
```

Atalhos locais equivalentes:

```powershell
.\firebase_login.cmd
.\firebase_deploy_database.cmd
```

4. Valide no Console do Firebase:
   Realtime Database > Rules

Resultado esperado:

- leitura publica apenas em `portfolio/services`
- escrita restrita ao e-mail `helymail@gmail.com`
- restante do banco bloqueado

## 2. Restringir e, se necessario, rotacionar as chaves

### Google Places API

Recomendacao oficial:
https://developers.google.com/maps/api-security-best-practices

Configuracao recomendada para a chave usada em `index.html`:

1. Google Cloud Console > APIs & Services > Credentials
2. Abra a chave usada para Places
3. Em `Application restrictions`, escolha `Websites`
4. Cadastre somente os domínios reais do site, por exemplo:
   - `https://seudominio.com/*`
   - `https://www.seudominio.com/*`
5. Em `API restrictions`, escolha `Restrict key`
6. Permita apenas `Places API` ou `Places API (New)`, conforme seu uso
7. Salve e teste

Se houver suspeita de abuso:

1. Crie uma nova chave separada so para Places
2. Aplique as restricoes antes de trocar
3. Substitua em [index.html](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/index.html:365)
4. Monitore uso da chave antiga
5. Exclua a antiga quando nao houver mais trafego legitimo

### Firebase API key

Recomendacao oficial:
https://firebase.google.com/docs/projects/api-keys

Observacao importante:

- a `apiKey` do Firebase web **nao** protege dados sozinha
- a protecao real e feita por **Security Rules**

Mesmo assim:

1. Google Cloud Console > APIs & Services > Credentials
2. Abra a chave associada ao app web do Firebase
3. Revise `API restrictions`
4. Mantenha apenas as APIs Firebase realmente usadas
5. Nao misture Places API nessa mesma chave

### EmailJS

Referencia oficial do SDK:
https://www.emailjs.com/docs/sdk/options/

O codigo ja foi endurecido em [index.html](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/index.html:562) com:

- `blockHeadless: true`
- `limitRate.throttle: 10000`
- honeypot local no formulario

No painel do EmailJS, faça:

1. Account / Security
2. Se sua conta/plano permitir, habilite whitelist de dominios
3. Permita apenas seus domínios de producao
4. Revise services e templates nao usados
5. Gere nova public key se houver suspeita de exposicao e atualize:
   [index.html](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/index.html:359)

Observacao:

- a whitelist de dominio e um recurso de plano no EmailJS
  Referencia: https://www.emailjs.com/pricing/

## 3. Pendencia de SRI / terceiros

O ponto de CDN ja foi eliminado para:

- EmailJS
- JSZip

Arquivos locais:

- [vendor/emailjs.min.js](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/vendor/emailjs.min.js:1)
- [vendor/jszip.min.js](/c:/Users/helym/projetos_skill_creator/ladingpage_rsolucoes/vendor/jszip.min.js:1)

Restam externos por natureza do produto:

- Google Tag Manager / gtag
- Google Fonts
- Firebase SDK via `gstatic`

Para esses casos:

- mantenha versoes fixas quando possivel
- reduza uso ao estritamente necessario
- confie mais em CSP e restricoes de chave do que em SRI, porque nem todos esses endpoints sao bons candidatos a SRI estavel

## 4. Checklist final

- publicar `database.rules.json`
- restringir chave do Places por dominio e API
- revisar allowlist da chave do Firebase
- restringir/rotacionar public key do EmailJS
- testar:
  - landing page
  - envio do formulario
  - galerias publicas
  - login admin
  - upload no painel
