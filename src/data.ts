export type Product = {
  id: string;
  name: string;
  model: string;
  price: number;
  description: string;
  image: number;
  colors?: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: 'bulb-a',
    name: 'Lâmpada Inteligente',
    model: 'Modelo A',
    price: 150,
    description: 'Controle de cores, intensidade e sincronização rítmica com música. Compatível com Alexa/Google Home e Apple HomeKit.',
    image: require('../assets/laria/bulb-a.png'),
    colors: ['#FFFFFF', '#FFECA8', '#FFF4DE', '#FF4D45', '#338DFF'],
  },
  {
    id: 'assistant',
    name: 'Assistente Inteligente',
    model: 'Echo Dot',
    price: 500,
    description: 'Assistente de voz compacto para controlar sua casa e suas rotinas.',
    image: require('../assets/laria/assistant.png'),
  },
  {
    id: 'curtain',
    name: 'Cortina Motorizada',
    model: 'Trilho Smart',
    price: 800,
    description: 'Automação silenciosa com abertura programável e controle por voz.',
    image: require('../assets/laria/curtain.png'),
  },
  {
    id: 'bulb-b',
    name: 'Lâmpada Inteligente',
    model: 'Modelo B',
    price: 135,
    description: 'Controle de cor e intensidade. Compatível com Alexa/Google Home.',
    image: require('../assets/laria/bulb-b.png'),
    colors: ['#FFFFFF', '#FFECA8', '#FFF4DE', '#FF4D45', '#338DFF'],
  },
];

export const formatMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

