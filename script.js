class MuscleSystem3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.maleMuscles = null;
        this.femaleMuscles = null;
        this.currentModel = 'male';
        this.animationId = null;
        this.isAnimating = false;
        this.animationSpeed = 1.0;
        this.clock = new THREE.Clock();
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Criar cena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Criar câmera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);

        // Criar renderer
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Adicionar controles de órbita
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;

        // Adicionar iluminação
        this.setupLighting();

        // Criar modelos musculares
        this.createMuscleModels();

        // Iniciar loop de renderização
        this.animate();
    }

    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Luz direcional principal
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Luz pontual para realçar detalhes
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-10, 10, 10);
        this.scene.add(pointLight);

        // Luz de preenchimento
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
        fillLight.position.set(-10, -10, -5);
        this.scene.add(fillLight);
    }

    createMuscleModels() {
        // Modelo masculino
        this.maleMuscles = this.createMaleMuscleSystem();
        this.scene.add(this.maleMuscles);

        // Modelo feminino
        this.femaleMuscles = this.createFemaleMuscleSystem();
        this.femaleMuscles.visible = false;
        this.scene.add(this.femaleMuscles);
    }

    createMaleMuscleSystem() {
        const maleGroup = new THREE.Group();

        // Torso e peitorais
        const chestGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const chestMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.8
        });
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.position.set(0, 0.5, 0);
        chest.scale.set(1.5, 1, 0.8);
        maleGroup.add(chest);

        // Abdominais
        const absGeometry = new THREE.BoxGeometry(1.8, 0.8, 0.3);
        const absMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff8e8e,
            transparent: true,
            opacity: 0.9
        });
        const abs = new THREE.Mesh(absGeometry, absMaterial);
        abs.position.set(0, -0.2, 0.6);
        maleGroup.add(abs);

        // Bíceps
        const bicepGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 16);
        const bicepMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff4757,
            transparent: true,
            opacity: 0.8
        });
        
        const leftBicep = new THREE.Mesh(bicepGeometry, bicepMaterial);
        leftBicep.position.set(-1.8, 0.2, 0);
        leftBicep.rotation.z = Math.PI / 6;
        maleGroup.add(leftBicep);

        const rightBicep = new THREE.Mesh(bicepGeometry, bicepMaterial);
        rightBicep.position.set(1.8, 0.2, 0);
        rightBicep.rotation.z = -Math.PI / 6;
        maleGroup.add(rightBicep);

        // Tríceps
        const tricepGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1, 16);
        const tricepMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.8
        });
        
        const leftTricep = new THREE.Mesh(tricepGeometry, tricepMaterial);
        leftTricep.position.set(-1.8, 0.2, -0.3);
        leftTricep.rotation.z = Math.PI / 6;
        maleGroup.add(leftTricep);

        const rightTricep = new THREE.Mesh(tricepGeometry, tricepMaterial);
        rightTricep.position.set(1.8, 0.2, -0.3);
        rightTricep.rotation.z = -Math.PI / 6;
        maleGroup.add(rightTricep);

        // Quadríceps
        const quadGeometry = new THREE.CylinderGeometry(0.4, 0.5, 1.5, 16);
        const quadMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff4757,
            transparent: true,
            opacity: 0.8
        });
        
        const leftQuad = new THREE.Mesh(quadGeometry, quadMaterial);
        leftQuad.position.set(-0.6, -1.5, 0);
        maleGroup.add(leftQuad);

        const rightQuad = new THREE.Mesh(quadGeometry, quadMaterial);
        rightQuad.position.set(0.6, -1.5, 0);
        maleGroup.add(rightQuad);

        // Glúteos
        const gluteGeometry = new THREE.SphereGeometry(0.6, 32, 32);
        const gluteMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.8
        });
        
        const leftGlute = new THREE.Mesh(gluteGeometry, gluteMaterial);
        leftGlute.position.set(-0.4, -0.8, -0.8);
        leftGlute.scale.set(1, 1, 0.6);
        maleGroup.add(leftGlute);

        const rightGlute = new THREE.Mesh(gluteGeometry, gluteMaterial);
        rightGlute.position.set(0.4, -0.8, -0.8);
        rightGlute.scale.set(1, 1, 0.6);
        maleGroup.add(rightGlute);

        // Deltoides
        const deltoidGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const deltoidMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff8e8e,
            transparent: true,
            opacity: 0.8
        });
        
        const leftDeltoid = new THREE.Mesh(deltoidGeometry, deltoidMaterial);
        leftDeltoid.position.set(-1.2, 0.8, 0);
        leftDeltoid.scale.set(1, 1.2, 0.8);
        maleGroup.add(leftDeltoid);

        const rightDeltoid = new THREE.Mesh(deltoidGeometry, deltoidMaterial);
        rightDeltoid.position.set(1.2, 0.8, 0);
        rightDeltoid.scale.set(1, 1.2, 0.8);
        maleGroup.add(rightDeltoid);

        return maleGroup;
    }

    createFemaleMuscleSystem() {
        const femaleGroup = new THREE.Group();

        // Torso e peitorais (menores)
        const chestGeometry = new THREE.SphereGeometry(1, 32, 32);
        const chestMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff9ff3,
            transparent: true,
            opacity: 0.8
        });
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.position.set(0, 0.3, 0);
        chest.scale.set(1.3, 0.9, 0.7);
        femaleGroup.add(chest);

        // Abdominais (mais suaves)
        const absGeometry = new THREE.BoxGeometry(1.5, 0.6, 0.2);
        const absMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffb3e6,
            transparent: true,
            opacity: 0.9
        });
        const abs = new THREE.Mesh(absGeometry, absMaterial);
        abs.position.set(0, -0.1, 0.5);
        femaleGroup.add(abs);

        // Bíceps (mais finos)
        const bicepGeometry = new THREE.CylinderGeometry(0.25, 0.3, 1, 16);
        const bicepMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff9ff3,
            transparent: true,
            opacity: 0.8
        });
        
        const leftBicep = new THREE.Mesh(bicepGeometry, bicepMaterial);
        leftBicep.position.set(-1.5, 0.1, 0);
        leftBicep.rotation.z = Math.PI / 6;
        femaleGroup.add(leftBicep);

        const rightBicep = new THREE.Mesh(bicepGeometry, bicepMaterial);
        rightBicep.position.set(1.5, 0.1, 0);
        rightBicep.rotation.z = -Math.PI / 6;
        femaleGroup.add(rightBicep);

        // Tríceps
        const tricepGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 16);
        const tricepMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff9ff3,
            transparent: true,
            opacity: 0.8
        });
        
        const leftTricep = new THREE.Mesh(tricepGeometry, tricepMaterial);
        leftTricep.position.set(-1.5, 0.1, -0.2);
        leftTricep.rotation.z = Math.PI / 6;
        femaleGroup.add(leftTricep);

        const rightTricep = new THREE.Mesh(tricepGeometry, tricepMaterial);
        rightTricep.position.set(1.5, 0.1, -0.2);
        rightTricep.rotation.z = -Math.PI / 6;
        femaleGroup.add(rightTricep);

        // Quadríceps (mais finos)
        const quadGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.3, 16);
        const quadMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff9ff3,
            transparent: true,
            opacity: 0.8
        });
        
        const leftQuad = new THREE.Mesh(quadGeometry, quadMaterial);
        leftQuad.position.set(-0.5, -1.3, 0);
        femaleGroup.add(leftQuad);

        const rightQuad = new THREE.Mesh(quadGeometry, quadMaterial);
        rightQuad.position.set(0.5, -1.3, 0);
        femaleGroup.add(rightQuad);

        // Glúteos (mais proeminentes)
        const gluteGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const gluteMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff9ff3,
            transparent: true,
            opacity: 0.8
        });
        
        const leftGlute = new THREE.Mesh(gluteGeometry, gluteMaterial);
        leftGlute.position.set(-0.3, -0.7, -0.7);
        leftGlute.scale.set(1, 1.1, 0.7);
        femaleGroup.add(leftGlute);

        const rightGlute = new THREE.Mesh(gluteGeometry, gluteMaterial);
        rightGlute.position.set(0.3, -0.7, -0.7);
        rightGlute.scale.set(1, 1.1, 0.7);
        femaleGroup.add(rightGlute);

        // Deltoides (menores)
        const deltoidGeometry = new THREE.SphereGeometry(0.4, 32, 32);
        const deltoidMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffb3e6,
            transparent: true,
            opacity: 0.8
        });
        
        const leftDeltoid = new THREE.Mesh(deltoidGeometry, deltoidMaterial);
        leftDeltoid.position.set(-1, 0.6, 0);
        leftDeltoid.scale.set(1, 1, 0.8);
        femaleGroup.add(leftDeltoid);

        const rightDeltoid = new THREE.Mesh(deltoidGeometry, deltoidMaterial);
        rightDeltoid.position.set(1, 0.6, 0);
        rightDeltoid.scale.set(1, 1, 0.8);
        femaleGroup.add(rightDeltoid);

        return femaleGroup;
    }

    setupEventListeners() {
        // Botões de modelo
        document.getElementById('maleBtn').addEventListener('click', () => {
            this.switchModel('male');
        });

        document.getElementById('femaleBtn').addEventListener('click', () => {
            this.switchModel('female');
        });

        // Botões de animação
        document.getElementById('playBtn').addEventListener('click', () => {
            this.startAnimation();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseAnimation();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetAnimation();
        });

        // Controle de velocidade
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            speedValue.textContent = this.animationSpeed.toFixed(1) + 'x';
        });

        // Redimensionamento da janela
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    switchModel(model) {
        this.currentModel = model;
        
        // Atualizar botões
        document.getElementById('maleBtn').classList.toggle('active', model === 'male');
        document.getElementById('femaleBtn').classList.toggle('active', model === 'female');
        
        // Alternar visibilidade dos modelos
        this.maleMuscles.visible = model === 'male';
        this.femaleMuscles.visible = model === 'female';
    }

    startAnimation() {
        this.isAnimating = true;
    }

    pauseAnimation() {
        this.isAnimating = false;
    }

    resetAnimation() {
        this.isAnimating = false;
        if (this.currentModel === 'male') {
            this.maleMuscles.rotation.set(0, 0, 0);
        } else {
            this.femaleMuscles.rotation.set(0, 0, 0);
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();

        if (this.isAnimating) {
            const currentModel = this.currentModel === 'male' ? this.maleMuscles : this.femaleMuscles;
            
            // Rotação suave
            currentModel.rotation.y += 0.01 * this.animationSpeed;
            
            // Animação de "respiração" - escala sutil
            const time = this.clock.getElapsedTime();
            const breathScale = 1 + Math.sin(time * 2 * this.animationSpeed) * 0.02;
            currentModel.scale.setScalar(breathScale);
            
            // Animação de flexão muscular
            currentModel.children.forEach((muscle, index) => {
                if (muscle.geometry.type === 'CylinderGeometry') {
                    const flexScale = 1 + Math.sin(time * 3 * this.animationSpeed + index) * 0.05;
                    muscle.scale.y = flexScale;
                }
            });
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const canvas = document.getElementById('canvas');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

// Inicializar quando a página carregar
window.addEventListener('load', () => {
    new MuscleSystem3D();
});