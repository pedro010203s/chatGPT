// Sistema Muscular 3D - Masculino e Feminino
class MuscleSystem3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.maleModel = null;
        this.femaleModel = null;
        this.currentGender = 'male';
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedMuscle = null;

        this.init();
        this.createModels();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Cena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);

        // Câmera
        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.set(0, 0, 5);

        // Renderizador
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const container = document.getElementById('muscleViewer');
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);

        // Controles
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;

        // Luzes
        this.setupLighting();

        // Loading oculto inicialmente
        document.getElementById('loading').style.display = 'none';

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Luz principal
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Luz de preenchimento
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
        fillLight.position.set(-5, 0, 5);
        this.scene.add(fillLight);

        // Luz de destaque
        const spotLight = new THREE.SpotLight(0xffa500, 0.5);
        spotLight.position.set(0, 10, 0);
        spotLight.target.position.set(0, 0, 0);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.1;
        this.scene.add(spotLight);
        this.scene.add(spotLight.target);
    }

    createModels() {
        // Criar modelo masculino
        this.maleModel = this.createHumanModel('male');

        // Criar modelo feminino
        this.femaleModel = this.createHumanModel('female');

        // Mostrar modelo masculino inicialmente
        this.scene.add(this.maleModel);
    }

    createHumanModel(gender) {
        const modelGroup = new THREE.Group();

        // Proporções diferentes para masculino/feminino
        const proportions = gender === 'male' ?
            { height: 1.8, shoulderWidth: 0.6, hipWidth: 0.4 } :
            { height: 1.65, shoulderWidth: 0.5, hipWidth: 0.45 };

        // Corpo principal (tórax)
        const torsoGeometry = new THREE.CylinderGeometry(
            gender === 'male' ? 0.3 : 0.25,
            gender === 'male' ? 0.35 : 0.3,
            proportions.height * 0.4,
            8
        );
        const torsoMaterial = new THREE.MeshPhongMaterial({
            color: gender === 'male' ? 0xff6b6b : 0xff69b4,
            transparent: true,
            opacity: 0.8
        });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.y = proportions.height * 0.2;
        torso.castShadow = true;
        torso.receiveShadow = true;
        modelGroup.add(torso);

        // Cabeça
        const headGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = proportions.height * 0.6;
        head.castShadow = true;
        modelGroup.add(head);

        // Braços
        this.createArm(modelGroup, 'left', gender, proportions);
        this.createArm(modelGroup, 'right', gender, proportions);

        // Pernas
        this.createLeg(modelGroup, 'left', gender, proportions);
        this.createLeg(modelGroup, 'right', gender, proportions);

        // Músculos específicos
        this.addMuscleGroups(modelGroup, gender, proportions);

        return modelGroup;
    }

    createArm(parent, side, gender, proportions) {
        const sign = side === 'left' ? -1 : 1;

        // Braço superior
        const upperArmGeometry = new THREE.CylinderGeometry(0.08, 0.06, proportions.height * 0.2, 8);
        const upperArmMaterial = new THREE.MeshPhongMaterial({
            color: gender === 'male' ? 0xff4757 : 0xff6b9d
        });
        const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
        upperArm.position.set(sign * proportions.shoulderWidth * 0.7, proportions.height * 0.3, 0);
        upperArm.castShadow = true;
        parent.add(upperArm);

        // Bíceps (visual)
        const bicepGeometry = new THREE.SphereGeometry(0.09, 8, 8);
        const bicepMaterial = new THREE.MeshPhongMaterial({
            color: 0xff3742,
            transparent: true,
            opacity: 0.7
        });
        const bicep = new THREE.Mesh(bicepGeometry, bicepMaterial);
        bicep.position.set(sign * proportions.shoulderWidth * 0.7, proportions.height * 0.35, 0);
        parent.add(bicep);

        // Antebraço
        const forearmGeometry = new THREE.CylinderGeometry(0.06, 0.05, proportions.height * 0.18, 8);
        const forearmMaterial = new THREE.MeshPhongMaterial({
            color: gender === 'male' ? 0xff4757 : 0xff6b9d
        });
        const forearm = new THREE.Mesh(forearmGeometry, forearmMaterial);
        forearm.position.set(sign * proportions.shoulderWidth * 0.7, proportions.height * 0.1, 0);
        forearm.castShadow = true;
        parent.add(forearm);
    }

    createLeg(parent, side, gender, proportions) {
        const sign = side === 'left' ? -1 : 1;

        // Coxa
        const thighGeometry = new THREE.CylinderGeometry(
            gender === 'male' ? 0.12 : 0.1,
            0.1,
            proportions.height * 0.25,
            8
        );
        const thighMaterial = new THREE.MeshPhongMaterial({
            color: gender === 'male' ? 0xff3742 : 0xff6b9d
        });
        const thigh = new THREE.Mesh(thighGeometry, thighMaterial);
        thigh.position.set(sign * proportions.hipWidth * 0.6, -proportions.height * 0.15, 0);
        thigh.castShadow = true;
        parent.add(thigh);

        // Panturrilha
        const calfGeometry = new THREE.CylinderGeometry(0.08, 0.06, proportions.height * 0.2, 8);
        const calfMaterial = new THREE.MeshPhongMaterial({
            color: 0xff3742,
            transparent: true,
            opacity: 0.8
        });
        const calf = new THREE.Mesh(calfGeometry, calfMaterial);
        calf.position.set(sign * proportions.hipWidth * 0.6, -proportions.height * 0.4, 0);
        parent.add(calf);
    }

    addMuscleGroups(parent, gender, proportions) {
        // Peitoral
        const chestGeometry = new THREE.BoxGeometry(
            proportions.shoulderWidth * 0.8,
            proportions.height * 0.15,
            0.15
        );
        const chestMaterial = new THREE.MeshPhongMaterial({
            color: 0xff3742,
            transparent: true,
            opacity: 0.7
        });
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.position.y = proportions.height * 0.25;
        parent.add(chest);

        // Abdômen (six-pack visual)
        for (let i = 0; i < 6; i++) {
            const abGeometry = new THREE.BoxGeometry(0.12, 0.08, 0.05);
            const abMaterial = new THREE.MeshPhongMaterial({
                color: 0xff6b35,
                transparent: true,
                opacity: 0.6
            });
            const ab = new THREE.Mesh(abGeometry, abMaterial);
            ab.position.set(
                (i % 2 - 0.5) * 0.15,
                proportions.height * 0.15 - (Math.floor(i / 2) * 0.1),
                0.1
            );
            parent.add(ab);
        }

        // Glúteo
        const gluteGeometry = new THREE.SphereGeometry(
            gender === 'male' ? 0.18 : 0.16,
            8,
            8
        );
        const gluteMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.7
        });
        const glute = new THREE.Mesh(gluteGeometry, gluteMaterial);
        glute.position.y = -proportions.height * 0.05;
        parent.add(glute);
    }

    setupEventListeners() {
        // Toggle gender
        document.getElementById('toggleGender').addEventListener('click', () => {
            this.toggleGender();
        });

        // Reset view
        document.getElementById('resetView').addEventListener('click', () => {
            this.resetView();
        });

        // Mouse interaction
        document.getElementById('muscleViewer').addEventListener('click', (event) => {
            this.onMuscleClick(event);
        });

        // Info panel toggle
        document.getElementById('infoBtn').addEventListener('click', () => {
            this.toggleInfoPanel();
        });
    }

    toggleGender() {
        // Remover modelo atual
        this.scene.remove(this.scene.getObjectByName('currentModel'));

        // Alternar gênero
        this.currentGender = this.currentGender === 'male' ? 'female' : 'male';

        // Adicionar novo modelo
        const newModel = this.currentGender === 'male' ? this.maleModel : this.femaleModel;
        newModel.name = 'currentModel';
        this.scene.add(newModel);

        // Atualizar botão
        const toggleBtn = document.getElementById('toggleGender');
        toggleBtn.textContent = `Alternar: ${this.currentGender === 'male' ? 'Feminino' : 'Masculino'}`;

        // Animação suave
        this.animateModelTransition(newModel);
    }

    animateModelTransition(newModel) {
        newModel.scale.set(0.1, 0.1, 0.1);
        const animate = () => {
            if (newModel.scale.x < 1) {
                newModel.scale.multiplyScalar(1.1);
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    resetView() {
        this.camera.position.set(0, 0, 5);
        this.controls.reset();
    }

    onMuscleClick(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const currentModel = this.scene.getObjectByName('currentModel');

        if (currentModel) {
            const intersects = this.raycaster.intersectObjects(currentModel.children, true);
            if (intersects.length > 0) {
                this.highlightMuscle(intersects[0].object);
                this.showMuscleInfo(intersects[0].object);
            }
        }
    }

    highlightMuscle(muscle) {
        // Reset previous selection
        if (this.selectedMuscle) {
            this.selectedMuscle.material.emissive.setHex(0x000000);
        }

        // Highlight new selection
        this.selectedMuscle = muscle;
        muscle.material.emissive.setHex(0x444444);
    }

    showMuscleInfo(muscle) {
        const infoPanel = document.getElementById('infoPanel');
        const muscleNames = {
            'torso': 'Torso - Músculos do tronco',
            'head': 'Cabeça - Músculos faciais e cranianos',
            'bicep': 'Bíceps - Flexor do braço',
            'chest': 'Peitoral - Músculos do peito',
            'ab': 'Abdômen - Músculos abdominais',
            'thigh': 'Coxa - Quadríceps e isquiotibiais',
            'calf': 'Panturrilha - Gastrocnêmio e sóleo'
        };

        const muscleType = Object.keys(muscleNames).find(key =>
            muscle.geometry.type.toLowerCase().includes(key) ||
            muscle.position.y > 1 // head
        );

        if (muscleType) {
            infoPanel.innerHTML = `
                <h3>${muscleNames[muscleType]}</h3>
                <p>Informações detalhadas sobre este grupo muscular aparecerão aqui.</p>
                <p><strong>Função:</strong> ${this.getMuscleFunction(muscleType)}</p>
                <p><strong>Exercícios recomendados:</strong> ${this.getRecommendedExercises(muscleType)}</p>
            `;
        }
    }

    getMuscleFunction(muscleType) {
        const functions = {
            'torso': 'Suporte postural e movimentos do tronco',
            'head': 'Expressões faciais e movimentos da cabeça',
            'bicep': 'Flexão do cotovelo e rotação do antebraço',
            'chest': 'Movimentos de empurrão e respiração',
            'ab': 'Estabilização do tronco e flexão vertebral',
            'thigh': 'Locomoção, equilíbrio e movimentos das pernas',
            'calf': 'Flexão plantar e impulsão'
        };
        return functions[muscleType] || 'Função específica do músculo';
    }

    getRecommendedExercises(muscleType) {
        const exercises = {
            'torso': 'Agachamentos, pranchas, remadas',
            'head': 'Alongamentos cervicais, exercícios faciais',
            'bicep': 'Rosca direta, martelo, concentrada',
            'chest': 'Supino, flexões, cruzamentos',
            'ab': 'Abdominais, prancha, leg raise',
            'thigh': 'Agachamentos, lunges, leg press',
            'calf': 'Elevação de calcanhar, saltos'
        };
        return exercises[muscleType] || 'Exercícios variados';
    }

    toggleInfoPanel() {
        const panel = document.getElementById('infoPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.controls.update();

        // Animação sutil dos modelos
        const currentModel = this.scene.getObjectByName('currentModel');
        if (currentModel) {
            currentModel.rotation.y += 0.005;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new MuscleSystem3D();
});