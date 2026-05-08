## 🐾 SmartBite — Frontend React

Interface web inteligente para controle e monitoramento de alimentação automática de pets.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![React](https://img.shields.io/badge/frontend-react%2019-blue)
![TypeScript](https://img.shields.io/badge/language-typescript-blue)
![Vite](https://img.shields.io/badge/bundler-vite-purple)
![Tailwind](https://img.shields.io/badge/css-tailwind-teal)

---

## 🚀 Tecnologias

- **React 19** com TypeScript
- **Vite** para build rápido
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Sonner** para notificações
- **Lucide Icons** para ícones
- **Bun** como package manager

---

## ✨ Funcionalidades

### 🐶 Gestão de Pets
- ✅ Cadastro de pets (cães e gatos)
- ✅ Raça, idade, peso, nível de atividade
- ✅ Condição corporal e castração
- ✅ Edição de informações
- ✅ Cálculo automático de porção (RER/MER)

### 🍽️ Alimentação
- ✅ Liberação manual de ração
- ✅ Agendamento automático
- ✅ Histórico de alimentações
- ✅ Consumo diário vs. recomendado
- ✅ Plano alimentar customizável

### 📊 Dashboard
- ✅ Consumo semanal
- ✅ Progresso da meta diária
- ✅ Histórico detalhado
- ✅ Alertas de consumo baixo

### 🔔 Notificações
- ✅ Ração baixa
- ✅ Pet não comeu
- ⏳ Dispositivo offline (em desenvolvimento)

### ⚙️ Configurações
- ⏳ Tema claro/escuro
- ⏳ Idioma (pt-BR / en)
- ⏳ Unidade de peso (kg / g)
- ⏳ Política de privacidade / Termos

---

## 🛠️ Instalação & Desenvolvimento

### Pré-requisitos
- **Node.js** 18+ ou **Bun** 1.0+
- **Backend** rodando em `http://localhost:8000`

### Setup Local

```bash
# Clone e entre no diretório
git clone <url-do-repo>
cd smartbite-prototipo

# Instale dependências
bun install
# ou: npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com:
# VITE_API_URL=http://localhost:8000/api/v1

# Inicie o servidor de desenvolvimento
bun dev
# ou: npm run dev
```

Acesse em: **http://localhost:5173**

---

## 📋 Variáveis de Ambiente

### Desenvolvimento (`.env.local`)
```
VITE_API_URL=http://localhost:8000/api/v1
```

### Produção (Vercel)
No painel da Vercel, adicione:
```
VITE_API_URL=https://seu-backend.onrender.com/api/v1
```

---

## 🚀 Deploy na Vercel

### 1. Preparar Aplicação

```bash
# Build
bun run build

# Teste local
bun run preview
```

### 2. Conectar ao Vercel

```bash
# Se não tem a CLI instalada
bun add -g vercel

# Login
vercel login

# Deploy
vercel
```

### 3. Configurar Variáveis

No painel da Vercel:
- Settings → Environment Variables
- Adicione: `VITE_API_URL=https://seu-backend.onrender.com/api/v1`

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Auth.tsx        # Login/Registro
│   ├── PetForm.tsx     # Criar pet
│   ├── PetProfile.tsx  # Perfil do pet (com edição)
│   ├── FeederControl.tsx # Controle do comedouro
│   ├── FeedingHistory.tsx # Histórico
│   ├── ConsumptionChart.tsx # Gráfico semanal
│   ├── ScheduleForm.tsx # Agendamentos
│   ├── AlertsPanel.tsx # Alertas
│   ├── NotificationsCenter.tsx # Centro de notificações
│   ├── NotificationSettings.tsx # Configurar notificações
│   ├── AccountSettings.tsx # Conta do usuário
│   └── ui/             # Componentes base (shadcn)
├── lib/
│   ├── api.ts          # Cliente HTTP
│   ├── types.ts        # Tipos TypeScript
│   ├── utils.ts        # Utilitários
│   └── mock-data.ts    # Dados de exemplo
├── pages/
│   ├── Index.tsx       # Dashboard principal
│   └── NotFound.tsx    # Página 404
├── App.tsx             # Componente raiz
├── main.tsx            # Entry point
└── index.css           # Estilos globais
```

---

## 🔑 Fluxo de Autenticação

1. **Registro** → POST `/auth/register/` → Retorna token
2. **Login** → POST `/auth/login/` → Retorna token
3. **Armazenar token** → localStorage
4. **Requisições** → Header: `Authorization: Token {token}`
5. **Logout** → POST `/auth/logout/` → Limpa token

---

## 📱 Componentes Principais

### PetForm (Novo)
```typescript
- Nome, espécie, raça
- Peso (kg), idade (meses)
- Nível de atividade (baixo, moderado, alto)
- Objetivo alimentar (perda, manutenção, ganho)
- Castração (sim/não)
- Condição corporal (abaixo, ideal, sobrepeso, obeso)
```

### PetProfile (Edição)
- Mesmos campos do PetForm
- Tabs: Visão Geral, Dieta, Histórico
- Editar informações incluindo raça

### FeederControl
- Liberação manual com validação
- Sugestão de quantidade automática
- Agendamentos automáticos
- **Alinhamento corrigido** do botão com campo de quantidade

### ConsumptionChart
- Gráfico de consumo semanal
- Comparação com meta diária
- Data e dia da semana (via API)

---

## 🧪 Testes

```bash
# Executar testes
bun run test

# Coverage
bun run test:coverage
```

---

## 📚 API Integration

### Cliente HTTP (`lib/api.ts`)

```typescript
export const api = {
  // Auth
  register(data) → POST /auth/register/
  login(email, password) → POST /auth/login/
  logout() → POST /auth/logout/
  changePassword(old_password, new_password) → POST /auth/change-password/
  
  // Pets
  getPets() → GET /pets/
  addPet(data) → POST /pets/
  updatePet(id, data) → PATCH /pets/{id}/
  deletePet(id) → DELETE /pets/{id}/
  
  // Nutrition
  calculateNutrition(data) → POST /nutrition/calculate/
  
  // Feeders
  getFeeders() → GET /feeders/
  triggerManualFeed(petId, amount) → POST /feeders/{id}/dispense/
  
  // Schedules
  getSchedules(petId) → GET /pets/{id}/schedules/
  addSchedule(data) → POST /pets/{id}/schedules/
  updateSchedule(id, data) → PATCH /schedules/{id}/
  deleteSchedule(id) → DELETE /schedules/{id}/
  
  // Consumption
  getDailyConsumption(petId, days) → GET /pets/{id}/consumption/
  
  // Utilities
  getCurrentDateTime() → GET /utils/datetime/
};
```

---

## 🎨 Temas & Customização

### Tailwind Config
- Variáveis CSS para tema claro/escuro
- Cores primárias, secundárias, alertas
- Responsivo mobile-first

### Componentes shadcn
- Button, Input, Card, Tabs
- Dialog, AlertDialog, Select
- Fully customizable com Tailwind

---

## 🐛 Troubleshooting

### Erro 401 Unauthorized
- Verifique se o token está em `localStorage`
- Faça login novamente

### CORS Error
- Confirme `VITE_API_URL` está correto
- Backend deve ter `CORS_ALLOWED_ORIGINS` configurado

### Falha ao chamar API
- Verifique se backend está rodando
- Teste com `curl` ou Postman

---

## 📖 Documentação Relacionada

- [Backend README](../backend-smartbite/README.md)
- [Cálculo de Nutrição](../backend-smartbite/NUTRITION_CALCULATION.md)
- [ESP32 Integration Guide](./docs/ESP32_INTEGRATION.md)

---

## 👥 Contribuidores

- Amanda Mayumi Sato de Miranda RA: 248382
- Ana Carolina Hellmeister Dias RA: 248659
- Luiz Fernando Finger Vieira RA: 248341
- Vinicius Maximus Bou de Araújo RA: 247958
- Lucca Falzoni Tomeleri RA: 248329
- Enzo Almeida Barbosa RA: 248348

---

## 📄 Licença

MIT