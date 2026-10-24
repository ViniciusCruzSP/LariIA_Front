# LarIA Front

Aplicativo mobile de planejamento de casas inteligentes, implementado em React Native, Expo e TypeScript a partir do protótipo visual do projeto LarIA.

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
