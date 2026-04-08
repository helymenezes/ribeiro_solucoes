# Relatório Semanal Automático via WhatsApp

Enviar automaticamente a cada 7 dias um resumo de visitas do site para um número de WhatsApp, sem custo adicional e sem servidor próprio.

---

## Complexidade: ⭐⭐☆☆☆ — Simples

Não é complexo! A solução usa uma API gratuita chamada **CallMeBot** que permite enviar mensagens para qualquer conta WhatsApp via uma URL simples. A lógica de agendamento fica no próprio Firestore — sem servidor, sem custo extra.

---

## Como vai funcionar

```
Visitante acessa index.html
        ↓
Firestore registra visita + data
        ↓
Admin abre o dashboard (a qualquer momento)
        ↓
Dashboard verifica: "Faz 7 dias desde o último relatório?"
        ↓ SIM
Envia mensagem WhatsApp automática via CallMeBot API
Salva nova data de envio no Firestore
```

---

## Pré-requisito: Ativar o CallMeBot (1 vez só, 2 minutos)

O número que vai RECEBER as mensagens precisa se registrar uma única vez:
1. Adicione o contato **+34 644 65 21 68** no WhatsApp
2. Envie a mensagem: `I allow callmebot to send me messages`
3. Aguarde a resposta com sua **API Key** pessoal (ex: `123456`)

Feito isso, nunca mais precisa fazer nada — as mensagens chegam automaticamente.

---

## O que será modificado

### Firebase Firestore

O documento `stats/visitas` ganha dois campos novos:
- `ultimoRelatorio` — timestamp do último envio

---

### Admin Dashboard (`admin_dashboard.html`)

**1. Configuração do WhatsApp no topo do script:**
```js
const whatsappConfig = {
  numero: "5562982018377",   // ← número que recebe (com código do país)
  apiKey: "SUA_API_KEY_AQUI" // ← chave recebida do CallMeBot
};
const INTERVALO_DIAS = 7;
```

**2. Função `verificarRelatorio()`** — chamada logo após o login:
- Lê `ultimoRelatorio` do Firestore
- Calcula se passaram 7 dias
- Se sim: monta a mensagem e envia via CallMeBot automaticamente
- Atualiza `ultimoRelatorio` no Firestore com a data atual

**3. Mensagem enviada no WhatsApp:**
```
📊 *Relatório Semanal — Ribeiro Soluções*

🗓 Período: 29/03 a 05/04/2026
👁 Total de visitas: 142
📅 Visitas esta semana: 38
🕐 Última visita: 05/04/2026 às 23:14

_Relatório automático do painel Ribeiro Soluções_
```

**4. Card de configuração no painel:**
- Mostra: "Próximo relatório em X dias"
- Botão: "Enviar relatório agora" (para testes manuais)

---

## Perguntas em aberto

1. **Qual número vai receber o relatório?**
   - Candidato: `5562982018377` (ribeirosolucoeseletric@gmail.com)
   - Ou outro número?

2. **Acesso ao WhatsApp desse número?**
   - Precisa enviar uma mensagem para o CallMeBot ativar o recebimento (leva 2 min).

3. **Envio 100% automático?**
   - A solução atual envia quando o admin abre o painel.
   - Para envio automático sem interação: usar Firebase Cloud Functions (plano pago, ~R$0,05/mês).

---

## Plano de verificação

1. Admin faz login no dashboard
2. Sistema detecta que passaram 7 dias → mensagem enviada automaticamente no WhatsApp
3. Verificar no Firestore que `ultimoRelatorio` foi atualizado
4. Botão "Enviar agora" permite testar imediatamente sem esperar 7 dias

---

*Plano gerado em 05/04/2026*
