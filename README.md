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
