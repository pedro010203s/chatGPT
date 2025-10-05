# Sistema Muscular 3D - Animação Interativa

Uma animação 3D interativa do sistema muscular humano, mostrando as diferenças entre os modelos masculino e feminino.

## Características

- **Modelos 3D Realistas**: Representações visuais dos principais grupos musculares
- **Comparação Masculino vs Feminino**: Diferentes proporções e características anatômicas
- **Animações Fluidas**: Rotação, respiração e flexão muscular
- **Controles Interativos**: Interface intuitiva para navegação
- **Responsivo**: Funciona em desktop e dispositivos móveis

## Grupos Musculares Incluídos

### Modelo Masculino
- **Peitorais**: Maiores e mais definidos
- **Abdominais**: Mais proeminentes
- **Bíceps e Tríceps**: Maior volume muscular
- **Quadríceps**: Mais desenvolvidos
- **Deltoides**: Maior definição
- **Glúteos**: Proporções padrão

### Modelo Feminino
- **Peitorais**: Proporções menores e mais suaves
- **Abdominais**: Mais suaves e menos definidos
- **Bíceps e Tríceps**: Volume reduzido
- **Quadríceps**: Mais finos e alongados
- **Deltoides**: Menores e mais delicados
- **Glúteos**: Mais proeminentes

## Como Usar

1. **Abra o arquivo `index.html`** em um navegador web moderno
2. **Navegue**: Use o mouse para rotacionar, scroll para zoom
3. **Alterne Modelos**: Use os botões "Modelo Masculino" e "Modelo Feminino"
4. **Controle Animação**:
   - ▶️ **Reproduzir**: Inicia a animação
   - ⏸️ **Pausar**: Para a animação
   - 🔄 **Resetar**: Volta à posição inicial
5. **Ajuste Velocidade**: Use o slider para controlar a velocidade da animação

## Funcionalidades da Animação

- **Rotação Contínua**: O modelo gira suavemente
- **Respiração**: Movimento sutil de expansão/contração
- **Flexão Muscular**: Animação individual dos músculos
- **Iluminação Dinâmica**: Múltiplas fontes de luz para realçar detalhes

## Tecnologias Utilizadas

- **Three.js**: Biblioteca 3D para JavaScript
- **HTML5 Canvas**: Renderização 3D
- **CSS3**: Interface moderna e responsiva
- **JavaScript ES6**: Lógica de animação e interação

## Requisitos

- Navegador web moderno com suporte a WebGL
- Conexão com internet (para carregar Three.js via CDN)

## Estrutura do Projeto

```
/
├── index.html          # Estrutura principal
├── styles.css          # Estilos e interface
├── script.js           # Lógica 3D e animações
└── README.md           # Documentação
```

## Personalização

Você pode modificar:
- **Cores dos músculos**: Altere as cores nos materiais Three.js
- **Velocidade padrão**: Modifique o valor inicial do slider
- **Tamanhos dos músculos**: Ajuste as geometrias nos métodos de criação
- **Animações**: Adicione novos tipos de movimento no loop de animação

## Uso Educacional

Esta animação é ideal para:
- Aulas de anatomia
- Estudos de educação física
- Demonstrações médicas
- Aprendizado sobre diferenças corporais

## Licença

Este projeto é de código aberto e pode ser usado para fins educacionais e comerciais.