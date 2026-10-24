# LarIA Front

Aplicativo mobile de planejamento de casas inteligentes, implementado em React Native, Expo e TypeScript a partir do protótipo visual do projeto LarIA.

## Guia rápido para testar

### Opção 1 - Navegador (mais simples)

No Windows, abra o PowerShell dentro da pasta do projeto e execute:

```powershell
npm.cmd install
npm.cmd run web
```

O navegador abrirá a LarIA. Essa opção não exige conta no Expo.

> Por que `npm.cmd`? Em alguns computadores, a política de segurança do PowerShell bloqueia o arquivo `npm.ps1`. O executável `npm.cmd` realiza a mesma operação sem alterar a política de segurança do Windows. Em Prompt de Comando, macOS ou Linux, `npm install` e `npm run web` normalmente funcionam sem o sufixo `.cmd`.

### Opção 2 - Celular com Expo Go

1. Instale o aplicativo **Expo Go** no celular.
2. Entre ou crie uma conta gratuita no Expo Go.
3. No PowerShell, dentro da pasta do projeto, autentique o terminal com a mesma conta:

```powershell
npx.cmd expo login --no-browser
npx.cmd expo whoami
```

4. Inicie o projeto:

```powershell
npx.cmd expo start --clear --tunnel
```

5. Escaneie o QR Code exibido. No Android, use o leitor do Expo Go; no iPhone, use a câmera.

### Roteiro de demonstração

1. Aguarde a tela de abertura.
2. No login, informe qualquer nome/e-mail e qualquer senha não vazios.
3. Clique em **Acessar**.
4. Clique no botão `+` e escolha uma das opções de planta.
5. Selecione **Quarto Principal**.
6. Abra um produto, escolha quantidade/cor e adicione ao orçamento.
7. Confira o resumo, o histórico, o perfil e o logout.

## Estado atual dos dados

O aplicativo está em modo de demonstração e ainda não possui banco de dados conectado.

- O cadastro valida os campos, mas não cria um usuário permanente.
- O login aceita qualquer nome/e-mail e senha não vazios.
- Ao fechar ou recarregar o aplicativo, os dados simulados voltam ao estado inicial.
- O envio da planta e a análise dos cômodos são simulados.
- Produtos, histórico e orçamento usam dados locais de exemplo.

Quando o backend FastAPI estiver disponível, o front poderá usar autenticação real, banco de dados, upload de plantas, recomendações e orçamentos persistentes. A camada inicial para essa integração está em `src/services/api.ts`.
## O que já funciona

- Splash screen e identidade visual LarIA.
- Login e cadastro com validações locais.
- Fluxo de conversa com envio simulado de planta em PDF, galeria ou câmera.
- Análise simulada da planta e escolha de cômodo.
- Recomendações de dispositivos.
- Modal de produto, quantidade, cor e cálculo de preço.
- Carrinho e resumo de orçamento.
- Histórico de projetos, perfil e logout.
- Camada de API preparada para o backend FastAPI.

Os dados estão em `src/data.ts`. Quando o backend estiver disponível, substitua os mocks pelas chamadas de `src/services/api.ts`.

## Executar

Requisitos: Node.js 20+ e Expo Go no celular (ou emulador Android/iOS).

```bash
npm install
npm start
```

Para informar a URL do FastAPI:

```bash
EXPO_PUBLIC_API_URL=http://SEU_IP:8000 npm start
```

No Android Emulator, normalmente use `http://10.0.2.2:8000`. Em um celular físico, use o IP local do computador.

## Integração esperada com FastAPI

- `POST /auth/login`
- `POST /auth/register`
- `POST /plans/analyze`
- `GET /rooms/{room_id}/recommendations`
- `POST /budgets`

Os contratos iniciais estão centralizados em `src/services/api.ts` e podem ser ajustados quando o OpenAPI do backend estiver pronto.

## Estrutura

- `App.tsx`: telas, navegação local e fluxos do protótipo.
- `src/data.ts`: catálogo e dados simulados.
- `src/services/api.ts`: cliente HTTP para o FastAPI.
- `assets/laria`: elementos visuais extraídos do protótipo fornecido.

## Próxima fase

1. Confirmar o OpenAPI do FastAPI.
2. Persistir autenticação com token seguro.
3. Trocar análise simulada por upload real de imagem/PDF.
4. Consumir recomendações e orçamentos reais.
5. Adicionar testes de componentes e E2E.


