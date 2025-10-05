# Sistema Muscular 3D - Masculino e Feminino

Uma aplicação web interativa que apresenta uma animação 3D detalhada do sistema muscular humano, com modelos separados para anatomia masculina e feminina.

## 🚀 Características

### Visualização 3D Interativa
- **Modelos Anatômicos**: Representações 3D precisas dos sistemas musculares masculino e feminino
- **Controles Intuitivos**: Rotação, zoom e panorâmica com mouse/touch
- **Iluminação Realista**: Sistema de iluminação avançado para melhor visualização

### Grupos Musculares
- **Peitorais**: Músculos do peito e região anterior do tórax
- **Dorsais**: Músculos das costas e região posterior do tronco
- **Braços**: Bíceps, tríceps e deltoides
- **Pernas**: Quadríceps, isquiotibiais e gastrocnêmio
- **Core**: Músculos abdominais e do tronco

### Animações Dinâmicas
- **Contração Muscular**: Simulação realista de contração e relaxamento
- **Respiração**: Movimento sutil que simula a respiração natural
- **Controle de Velocidade**: Ajuste da velocidade das animações (0.1x a 2.0x)
- **Controles de Reprodução**: Play, pause e reset das animações

### Interface Moderna
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Painel de Informações**: Detalhes sobre cada grupo muscular
- **Seleção Interativa**: Clique nos músculos para informações específicas
- **Filtros Visuais**: Destaque de grupos musculares específicos

## 🛠️ Tecnologias Utilizadas

- **Three.js**: Biblioteca 3D para renderização WebGL
- **HTML5 Canvas**: Para renderização gráfica de alta performance
- **CSS3**: Animações e design moderno com gradientes e efeitos
- **JavaScript ES6+**: Lógica da aplicação e interatividade

## 📦 Instalação e Uso

### Método 1: Servidor Local Simples
```bash
# Clone ou baixe os arquivos do projeto
# Navegue até o diretório do projeto

# Instale um servidor HTTP simples (se não tiver)
npm install -g http-server

# Execute o servidor
npm start
# ou
http-server . -p 8080 -o
```

### Método 2: Live Server (Desenvolvimento)
```bash
# Instale o live-server para desenvolvimento
npm install -g live-server

# Execute com reload automático
npm run dev
# ou
live-server --port=8080 --open=/index.html
```

### Método 3: Servidor Web Existente
Simplesmente coloque todos os arquivos em um servidor web e acesse `index.html`.

## 🎮 Como Usar

### Controles Básicos
- **Mouse/Touch**: Rotacionar, fazer zoom e mover a câmera
- **Botões de Gênero**: Alternar entre modelos masculino e feminino
- **Grupos Musculares**: Filtrar e destacar grupos específicos

### Animações
1. **Play**: Inicia as animações de contração muscular
2. **Pause**: Pausa as animações no estado atual
3. **Reset**: Retorna todos os músculos ao estado inicial
4. **Velocidade**: Use o slider para ajustar a velocidade (0.1x - 2.0x)

### Exploração Interativa
- **Clique nos Músculos**: Obtenha informações detalhadas sobre músculos específicos
- **Grupos Musculares**: Use os botões para focar em grupos específicos
- **Painel de Informações**: Veja descrições e funções dos músculos selecionados

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Dispositivos
- 💻 **Desktop**: Experiência completa com todos os recursos
- 📱 **Mobile**: Interface adaptada para touch com controles otimizados
- 📟 **Tablet**: Layout responsivo que aproveita o espaço da tela

## 🎯 Casos de Uso

### Educação
- **Aulas de Anatomia**: Ferramenta visual para ensino de anatomia
- **Medicina**: Referência para estudantes de medicina
- **Biologia**: Complemento para aulas de biologia humana

### Fitness e Saúde
- **Personal Trainers**: Demonstração de grupos musculares
- **Fisioterapia**: Visualização para explicação de exercícios
- **Educação Física**: Recurso didático para professores

## 🔧 Personalização

### Cores dos Músculos
Edite o objeto `muscleData` em `script.js` para alterar as cores:
```javascript
muscleData: {
    chest: { color: 0xff6b6b },  // Vermelho
    back: { color: 0x4ecdc4 },   // Turquesa
    // ...
}
```

### Geometrias dos Músculos
Modifique a função `createIndividualMuscle()` para alterar as formas:
```javascript
case 'chest':
    geometry = new THREE.BoxGeometry(0.8, 0.3, 0.2);
    // Altere as dimensões conforme necessário
```

### Animações
Ajuste os parâmetros de animação na função `animateMuscles()`:
```javascript
const pulseFreq = 1.5;      // Frequência da pulsação
const contractionAmp = 0.15; // Amplitude da contração
```

## 📄 Estrutura do Projeto

```
sistema-muscular-3d/
├── index.html          # Página principal
├── styles.css          # Estilos e layout
├── script.js           # Lógica 3D e interatividade
├── package.json        # Configuração do projeto
└── README.md          # Documentação
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **Three.js Community**: Pela excelente biblioteca 3D
- **Anatomia Médica**: Referências anatômicas para precisão dos modelos
- **Web Standards**: Por possibilitar experiências 3D no navegador

---

**Desenvolvido com ❤️ para educação e ciência**