class MuscularSystem3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.maleMuscles = null;
        this.femaleMuscles = null;
        this.currentModel = 'male';
        this.isAnimating = false;
        this.rotationSpeed = 1;
        this.muscleLabels = [];
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Configurar cena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Configurar câmera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 5);
        
        // Configurar renderer
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth - 300, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Configurar controles de órbita
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        
        // Adicionar iluminação
        this.setupLighting();
        
        // Criar modelos musculares
        this.createMuscleModels();
        
        // Mostrar modelo masculino por padrão
        this.showMaleModel();
    }

    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Luz direcional principal
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Luz pontual para realçar
        const pointLight = new THREE.PointLight(0x4a90e2, 0.8, 100);
        pointLight.position.set(-10, 10, 10);
        this.scene.add(pointLight);
        
        // Luz de preenchimento
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
        fillLight.position.set(-10, -10, -5);
        this.scene.add(fillLight);
    }

    createMuscleModels() {
        // Criar grupo para músculos masculinos
        this.maleMuscles = new THREE.Group();
        this.createMaleMuscles();
        
        // Criar grupo para músculos femininos
        this.femaleMuscles = new THREE.Group();
        this.createFemaleMuscles();
        
        this.scene.add(this.maleMuscles);
        this.scene.add(this.femaleMuscles);
    }

    createMaleMuscles() {
        // Peitorais
        const pectorals = this.createMuscle(
            'Peitorais',
            new THREE.BoxGeometry(1.5, 0.8, 0.3),
            new THREE.Vector3(0, 0.5, 0.8),
            new THREE.Color(0xff6b6b)
        );
        this.maleMuscles.add(pectorals);
        
        // Deltoides
        const deltoids = this.createMuscle(
            'Deltoides',
            new THREE.SphereGeometry(0.4, 16, 16),
            new THREE.Vector3(0, 0.2, 1.2),
            new THREE.Color(0x4ecdc4)
        );
        this.maleMuscles.add(deltoids);
        
        // Bíceps
        const biceps = this.createMuscle(
            'Bíceps',
            new THREE.CylinderGeometry(0.2, 0.2, 1.2, 8),
            new THREE.Vector3(0, 0, 1.5),
            new THREE.Color(0x45b7d1)
        );
        this.maleMuscles.add(biceps);
        
        // Tríceps
        const triceps = this.createMuscle(
            'Tríceps',
            new THREE.CylinderGeometry(0.25, 0.25, 1.0, 8),
            new THREE.Vector3(0, 0, 1.8),
            new THREE.Color(0x96ceb4)
        );
        this.maleMuscles.add(triceps);
        
        // Abdominais
        const abs = this.createMuscle(
            'Abdominais',
            new THREE.BoxGeometry(1.2, 0.4, 0.2),
            new THREE.Vector3(0, -0.3, 0.5),
            new THREE.Color(0xfeca57)
        );
        this.maleMuscles.add(abs);
        
        // Oblíquos
        const obliques = this.createMuscle(
            'Oblíquos',
            new THREE.BoxGeometry(0.6, 0.8, 0.2),
            new THREE.Vector3(0, -0.2, 0.3),
            new THREE.Color(0xff9ff3)
        );
        this.maleMuscles.add(obliques);
        
        // Quadríceps
        const quadriceps = this.createMuscle(
            'Quadríceps',
            new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8),
            new THREE.Vector3(0, -1.2, 0),
            new THREE.Color(0x54a0ff)
        );
        this.maleMuscles.add(quadriceps);
        
        // Glúteos
        const glutes = this.createMuscle(
            'Glúteos',
            new THREE.SphereGeometry(0.6, 16, 16),
            new THREE.Vector3(0, -0.8, -0.5),
            new THREE.Color(0x5f27cd)
        );
        this.maleMuscles.add(glutes);
        
        // Isquiotibiais
        const hamstrings = this.createMuscle(
            'Isquiotibiais',
            new THREE.CylinderGeometry(0.25, 0.25, 1.2, 8),
            new THREE.Vector3(0, -1.5, -0.3),
            new THREE.Color(0x00d2d3)
        );
        this.maleMuscles.add(hamstrings);
        
        // Panturrilhas
        const calves = this.createMuscle(
            'Panturrilhas',
            new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8),
            new THREE.Vector3(0, -2.2, 0),
            new THREE.Color(0xff6348)
        );
        this.maleMuscles.add(calves);
    }

    createFemaleMuscles() {
        // Peitorais (menores)
        const pectorals = this.createMuscle(
            'Peitorais',
            new THREE.BoxGeometry(1.2, 0.6, 0.25),
            new THREE.Vector3(0, 0.5, 0.8),
            new THREE.Color(0xff6b6b)
        );
        this.femaleMuscles.add(pectorals);
        
        // Deltoides
        const deltoids = this.createMuscle(
            'Deltoides',
            new THREE.SphereGeometry(0.35, 16, 16),
            new THREE.Vector3(0, 0.2, 1.2),
            new THREE.Color(0x4ecdc4)
        );
        this.femaleMuscles.add(deltoids);
        
        // Bíceps (mais finos)
        const biceps = this.createMuscle(
            'Bíceps',
            new THREE.CylinderGeometry(0.15, 0.15, 1.0, 8),
            new THREE.Vector3(0, 0, 1.5),
            new THREE.Color(0x45b7d1)
        );
        this.femaleMuscles.add(biceps);
        
        // Tríceps
        const triceps = this.createMuscle(
            'Tríceps',
            new THREE.CylinderGeometry(0.2, 0.2, 0.9, 8),
            new THREE.Vector3(0, 0, 1.8),
            new THREE.Color(0x96ceb4)
        );
        this.femaleMuscles.add(triceps);
        
        // Abdominais
        const abs = this.createMuscle(
            'Abdominais',
            new THREE.BoxGeometry(1.0, 0.3, 0.15),
            new THREE.Vector3(0, -0.3, 0.5),
            new THREE.Color(0xfeca57)
        );
        this.femaleMuscles.add(abs);
        
        // Oblíquos
        const obliques = this.createMuscle(
            'Oblíquos',
            new THREE.BoxGeometry(0.5, 0.6, 0.15),
            new THREE.Vector3(0, -0.2, 0.3),
            new THREE.Color(0xff9ff3)
        );
        this.femaleMuscles.add(obliques);
        
        // Quadríceps (mais finos)
        const quadriceps = this.createMuscle(
            'Quadríceps',
            new THREE.CylinderGeometry(0.25, 0.25, 1.3, 8),
            new THREE.Vector3(0, -1.2, 0),
            new THREE.Color(0x54a0ff)
        );
        this.femaleMuscles.add(quadriceps);
        
        // Glúteos (mais proeminentes)
        const glutes = this.createMuscle(
            'Glúteos',
            new THREE.SphereGeometry(0.7, 16, 16),
            new THREE.Vector3(0, -0.8, -0.5),
            new THREE.Color(0x5f27cd)
        );
        this.femaleMuscles.add(glutes);
        
        // Isquiotibiais
        const hamstrings = this.createMuscle(
            'Isquiotibiais',
            new THREE.CylinderGeometry(0.2, 0.2, 1.0, 8),
            new THREE.Vector3(0, -1.5, -0.3),
            new THREE.Color(0x00d2d3)
        );
        this.femaleMuscles.add(hamstrings);
        
        // Panturrilhas
        const calves = this.createMuscle(
            'Panturrilhas',
            new THREE.CylinderGeometry(0.18, 0.18, 0.7, 8),
            new THREE.Vector3(0, -2.2, 0),
            new THREE.Color(0xff6348)
        );
        this.femaleMuscles.add(calves);
    }

    createMuscle(name, geometry, position, color) {
        const material = new THREE.MeshLambertMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        const muscle = new THREE.Mesh(geometry, material);
        muscle.position.copy(position);
        muscle.castShadow = true;
        muscle.receiveShadow = true;
        muscle.userData = { name: name };
        
        // Adicionar interatividade
        muscle.userData.isMuscle = true;
        
        return muscle;
    }

    showMaleModel() {
        this.femaleMuscles.visible = false;
        this.maleMuscles.visible = true;
        this.currentModel = 'male';
        this.updateMuscleList();
    }

    showFemaleModel() {
        this.maleMuscles.visible = false;
        this.femaleMuscles.visible = true;
        this.currentModel = 'female';
        this.updateMuscleList();
    }

    updateMuscleList() {
        const muscleList = document.getElementById('muscleList');
        muscleList.innerHTML = '';
        
        const currentGroup = this.currentModel === 'male' ? this.maleMuscles : this.femaleMuscles;
        
        currentGroup.children.forEach((muscle, index) => {
            if (muscle.userData.isMuscle) {
                const li = document.createElement('li');
                li.textContent = muscle.userData.name;
                li.addEventListener('click', () => {
                    this.highlightMuscle(muscle);
                });
                muscleList.appendChild(li);
            }
        });
    }

    highlightMuscle(muscle) {
        // Resetar todas as opacidades
        const currentGroup = this.currentModel === 'male' ? this.maleMuscles : this.femaleMuscles;
        currentGroup.children.forEach(m => {
            if (m.userData.isMuscle) {
                m.material.opacity = 0.8;
            }
        });
        
        // Destacar músculo selecionado
        muscle.material.opacity = 1.0;
        muscle.material.emissive = new THREE.Color(0x444444);
        
        // Adicionar animação de pulso
        muscle.scale.set(1.1, 1.1, 1.1);
        setTimeout(() => {
            muscle.scale.set(1, 1, 1);
        }, 500);
    }

    setupEventListeners() {
        // Botões de modelo
        document.getElementById('maleBtn').addEventListener('click', () => {
            this.showMaleModel();
            this.updateActiveButton('maleBtn');
        });
        
        document.getElementById('femaleBtn').addEventListener('click', () => {
            this.showFemaleModel();
            this.updateActiveButton('femaleBtn');
        });
        
        // Botões de animação
        document.getElementById('playBtn').addEventListener('click', () => {
            this.isAnimating = true;
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.isAnimating = false;
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetView();
        });
        
        // Controle de velocidade
        document.getElementById('rotationSpeed').addEventListener('input', (e) => {
            this.rotationSpeed = parseFloat(e.target.value);
        });
        
        // Redimensionamento da janela
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    updateActiveButton(activeId) {
        document.querySelectorAll('.control-group button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(activeId).classList.add('active');
    }

    resetView() {
        this.camera.position.set(0, 0, 5);
        this.controls.reset();
        this.isAnimating = false;
    }

    onWindowResize() {
        const width = window.innerWidth - 300;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.isAnimating) {
            const currentGroup = this.currentModel === 'male' ? this.maleMuscles : this.femaleMuscles;
            currentGroup.rotation.y += 0.01 * this.rotationSpeed;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new MuscularSystem3D();
});