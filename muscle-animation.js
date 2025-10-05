// Muscle Animation System
class MuscleAnimationSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentModel = null;
        this.maleModel = null;
        this.femaleModel = null;
        this.muscles = {};
        this.animationId = null;
        this.autoRotate = true;
        this.rotationSpeed = 1;
        this.selectedMuscle = null;
        this.labels = [];
        this.showLabels = true;
        this.wireframeMode = false;
        
        this.init();
        this.setupControls();
        this.hideLoading();
    }

    init() {
        // Setup Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / 600,
            0.1,
            1000
        );
        this.camera.position.z = 8;
        this.camera.position.y = 2;
        
        // Setup Renderer
        const canvas = document.getElementById('muscleCanvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        
        // Add Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        const pointLight1 = new THREE.PointLight(0x667eea, 0.5);
        pointLight1.position.set(-5, 5, 5);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x764ba2, 0.5);
        pointLight2.position.set(5, 5, -5);
        this.scene.add(pointLight2);
        
        // Create Models
        this.createMaleModel();
        this.createFemaleModel();
        
        // Show male model by default
        this.switchToMale();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation loop
        this.animate();
    }

    createMaleModel() {
        this.maleModel = new THREE.Group();
        
        // Muscle definitions for male model
        const muscleDefinitions = {
            // Head
            head: { 
                geometry: new THREE.SphereGeometry(0.6, 32, 32),
                color: 0xffdbac,
                position: [0, 7, 0],
                scale: [1, 1.2, 1]
            },
            
            // Neck
            neck: {
                geometry: new THREE.CylinderGeometry(0.35, 0.4, 0.6, 16),
                color: 0xd4a574,
                position: [0, 6.3, 0]
            },
            
            // Chest (Pectorals)
            chest: {
                geometry: new THREE.BoxGeometry(1.8, 1, 0.8),
                color: 0xc94848,
                position: [0, 5.2, 0.2],
                scale: [1, 1, 1]
            },
            
            // Shoulders (Deltoids) - Left
            shoulderLeft: {
                geometry: new THREE.SphereGeometry(0.45, 32, 32),
                color: 0xd45a5a,
                position: [-1.15, 5.2, 0],
                muscle: 'shoulders'
            },
            
            // Shoulders (Deltoids) - Right
            shoulderRight: {
                geometry: new THREE.SphereGeometry(0.45, 32, 32),
                color: 0xd45a5a,
                position: [1.15, 5.2, 0],
                muscle: 'shoulders'
            },
            
            // Biceps - Left
            bicepsLeft: {
                geometry: new THREE.CylinderGeometry(0.25, 0.28, 1.2, 16),
                color: 0xe66b6b,
                position: [-1.15, 4, 0],
                muscle: 'biceps'
            },
            
            // Biceps - Right
            bicepsRight: {
                geometry: new THREE.CylinderGeometry(0.25, 0.28, 1.2, 16),
                color: 0xe66b6b,
                position: [1.15, 4, 0],
                muscle: 'biceps'
            },
            
            // Forearms - Left
            forearmLeft: {
                geometry: new THREE.CylinderGeometry(0.2, 0.22, 1, 16),
                color: 0xf07878,
                position: [-1.15, 2.8, 0],
                muscle: 'biceps'
            },
            
            // Forearms - Right
            forearmRight: {
                geometry: new THREE.CylinderGeometry(0.2, 0.22, 1, 16),
                color: 0xf07878,
                position: [1.15, 2.8, 0],
                muscle: 'biceps'
            },
            
            // Triceps - Left (back of arm)
            tricepsLeft: {
                geometry: new THREE.CylinderGeometry(0.22, 0.25, 1.2, 16),
                color: 0xcc5555,
                position: [-1.15, 4, -0.3],
                muscle: 'triceps'
            },
            
            // Triceps - Right
            tricepsRight: {
                geometry: new THREE.CylinderGeometry(0.22, 0.25, 1.2, 16),
                color: 0xcc5555,
                position: [1.15, 4, -0.3],
                muscle: 'triceps'
            },
            
            // Abs
            abs: {
                geometry: new THREE.BoxGeometry(1.2, 1.8, 0.5),
                color: 0xbb4545,
                position: [0, 3.8, 0.2],
                muscle: 'abs'
            },
            
            // Obliques - Left
            obliqueLeft: {
                geometry: new THREE.BoxGeometry(0.4, 1.2, 0.4),
                color: 0xa83e3e,
                position: [-0.8, 3.8, 0.1],
                muscle: 'abs'
            },
            
            // Obliques - Right
            obliqueRight: {
                geometry: new THREE.BoxGeometry(0.4, 1.2, 0.4),
                color: 0xa83e3e,
                position: [0.8, 3.8, 0.1],
                muscle: 'abs'
            },
            
            // Back (Lats)
            backUpper: {
                geometry: new THREE.BoxGeometry(2, 1.5, 0.6),
                color: 0x994444,
                position: [0, 4.8, -0.4],
                muscle: 'back'
            },
            
            backLower: {
                geometry: new THREE.BoxGeometry(1.4, 1.2, 0.5),
                color: 0x883838,
                position: [0, 3.2, -0.3],
                muscle: 'back'
            },
            
            // Glutes
            glutes: {
                geometry: new THREE.SphereGeometry(0.8, 32, 32),
                color: 0xaa4040,
                position: [0, 2.2, -0.2],
                scale: [1.4, 0.8, 1],
                muscle: 'glutes'
            },
            
            // Quadriceps - Left
            quadLeft: {
                geometry: new THREE.CylinderGeometry(0.35, 0.3, 2, 16),
                color: 0xc44848,
                position: [-0.35, 1.2, 0],
                muscle: 'quadriceps'
            },
            
            // Quadriceps - Right
            quadRight: {
                geometry: new THREE.CylinderGeometry(0.35, 0.3, 2, 16),
                color: 0xc44848,
                position: [0.35, 1.2, 0],
                muscle: 'quadriceps'
            },
            
            // Hamstrings - Left
            hamstringLeft: {
                geometry: new THREE.CylinderGeometry(0.32, 0.28, 2, 16),
                color: 0xb34040,
                position: [-0.35, 1.2, -0.2],
                muscle: 'hamstrings'
            },
            
            // Hamstrings - Right
            hamstringRight: {
                geometry: new THREE.CylinderGeometry(0.32, 0.28, 2, 16),
                color: 0xb34040,
                position: [0.35, 1.2, -0.2],
                muscle: 'hamstrings'
            },
            
            // Calves - Left
            calfLeft: {
                geometry: new THREE.CylinderGeometry(0.25, 0.2, 1.2, 16),
                color: 0xd45555,
                position: [-0.35, -0.4, 0],
                muscle: 'calves'
            },
            
            // Calves - Right
            calfRight: {
                geometry: new THREE.CylinderGeometry(0.25, 0.2, 1.2, 16),
                color: 0xd45555,
                position: [0.35, -0.4, 0],
                muscle: 'calves'
            }
        };
        
        // Create meshes
        for (const [name, def] of Object.entries(muscleDefinitions)) {
            const material = new THREE.MeshPhongMaterial({ 
                color: def.color,
                shininess: 30,
                flatShading: false
            });
            
            const mesh = new THREE.Mesh(def.geometry, material);
            mesh.position.set(...def.position);
            
            if (def.scale) {
                mesh.scale.set(...def.scale);
            }
            
            mesh.userData.muscleName = name;
            mesh.userData.muscleGroup = def.muscle || name;
            mesh.userData.originalColor = def.color;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.maleModel.add(mesh);
        }
        
        this.scene.add(this.maleModel);
        this.maleModel.visible = false;
    }

    createFemaleModel() {
        this.femaleModel = new THREE.Group();
        
        // Muscle definitions for female model (slightly different proportions)
        const muscleDefinitions = {
            // Head
            head: { 
                geometry: new THREE.SphereGeometry(0.55, 32, 32),
                color: 0xffdbac,
                position: [0, 7, 0],
                scale: [1, 1.15, 1]
            },
            
            // Neck (slightly thinner)
            neck: {
                geometry: new THREE.CylinderGeometry(0.3, 0.35, 0.6, 16),
                color: 0xd4a574,
                position: [0, 6.3, 0]
            },
            
            // Chest (less pronounced)
            chest: {
                geometry: new THREE.BoxGeometry(1.6, 0.9, 0.7),
                color: 0xc94848,
                position: [0, 5.2, 0.3],
                scale: [1, 1, 1]
            },
            
            // Shoulders (smaller deltoids)
            shoulderLeft: {
                geometry: new THREE.SphereGeometry(0.38, 32, 32),
                color: 0xd45a5a,
                position: [-1.0, 5.2, 0],
                muscle: 'shoulders'
            },
            
            shoulderRight: {
                geometry: new THREE.SphereGeometry(0.38, 32, 32),
                color: 0xd45a5a,
                position: [1.0, 5.2, 0],
                muscle: 'shoulders'
            },
            
            // Biceps (smaller)
            bicepsLeft: {
                geometry: new THREE.CylinderGeometry(0.22, 0.24, 1.2, 16),
                color: 0xe66b6b,
                position: [-1.0, 4, 0],
                muscle: 'biceps'
            },
            
            bicepsRight: {
                geometry: new THREE.CylinderGeometry(0.22, 0.24, 1.2, 16),
                color: 0xe66b6b,
                position: [1.0, 4, 0],
                muscle: 'biceps'
            },
            
            // Forearms
            forearmLeft: {
                geometry: new THREE.CylinderGeometry(0.18, 0.2, 1, 16),
                color: 0xf07878,
                position: [-1.0, 2.8, 0],
                muscle: 'biceps'
            },
            
            forearmRight: {
                geometry: new THREE.CylinderGeometry(0.18, 0.2, 1, 16),
                color: 0xf07878,
                position: [1.0, 2.8, 0],
                muscle: 'biceps'
            },
            
            // Triceps
            tricepsLeft: {
                geometry: new THREE.CylinderGeometry(0.2, 0.22, 1.2, 16),
                color: 0xcc5555,
                position: [-1.0, 4, -0.3],
                muscle: 'triceps'
            },
            
            tricepsRight: {
                geometry: new THREE.CylinderGeometry(0.2, 0.22, 1.2, 16),
                color: 0xcc5555,
                position: [1.0, 4, -0.3],
                muscle: 'triceps'
            },
            
            // Abs (less defined but present)
            abs: {
                geometry: new THREE.BoxGeometry(1.1, 1.6, 0.5),
                color: 0xbb4545,
                position: [0, 3.8, 0.2],
                muscle: 'abs'
            },
            
            // Narrower waist
            obliqueLeft: {
                geometry: new THREE.BoxGeometry(0.35, 1.0, 0.4),
                color: 0xa83e3e,
                position: [-0.7, 3.8, 0.1],
                muscle: 'abs'
            },
            
            obliqueRight: {
                geometry: new THREE.BoxGeometry(0.35, 1.0, 0.4),
                color: 0xa83e3e,
                position: [0.7, 3.8, 0.1],
                muscle: 'abs'
            },
            
            // Back
            backUpper: {
                geometry: new THREE.BoxGeometry(1.8, 1.4, 0.5),
                color: 0x994444,
                position: [0, 4.8, -0.4],
                muscle: 'back'
            },
            
            backLower: {
                geometry: new THREE.BoxGeometry(1.2, 1.0, 0.5),
                color: 0x883838,
                position: [0, 3.2, -0.3],
                muscle: 'back'
            },
            
            // Glutes (more pronounced)
            glutes: {
                geometry: new THREE.SphereGeometry(0.85, 32, 32),
                color: 0xaa4040,
                position: [0, 2.2, -0.2],
                scale: [1.5, 0.9, 1.1],
                muscle: 'glutes'
            },
            
            // Quadriceps
            quadLeft: {
                geometry: new THREE.CylinderGeometry(0.32, 0.28, 2, 16),
                color: 0xc44848,
                position: [-0.35, 1.2, 0],
                muscle: 'quadriceps'
            },
            
            quadRight: {
                geometry: new THREE.CylinderGeometry(0.32, 0.28, 2, 16),
                color: 0xc44848,
                position: [0.35, 1.2, 0],
                muscle: 'quadriceps'
            },
            
            // Hamstrings
            hamstringLeft: {
                geometry: new THREE.CylinderGeometry(0.3, 0.26, 2, 16),
                color: 0xb34040,
                position: [-0.35, 1.2, -0.2],
                muscle: 'hamstrings'
            },
            
            hamstringRight: {
                geometry: new THREE.CylinderGeometry(0.3, 0.26, 2, 16),
                color: 0xb34040,
                position: [0.35, 1.2, -0.2],
                muscle: 'hamstrings'
            },
            
            // Calves (typically more defined in females)
            calfLeft: {
                geometry: new THREE.CylinderGeometry(0.24, 0.19, 1.2, 16),
                color: 0xd45555,
                position: [-0.35, -0.4, 0],
                muscle: 'calves'
            },
            
            calfRight: {
                geometry: new THREE.CylinderGeometry(0.24, 0.19, 1.2, 16),
                color: 0xd45555,
                position: [0.35, -0.4, 0],
                muscle: 'calves'
            }
        };
        
        // Create meshes
        for (const [name, def] of Object.entries(muscleDefinitions)) {
            const material = new THREE.MeshPhongMaterial({ 
                color: def.color,
                shininess: 30,
                flatShading: false
            });
            
            const mesh = new THREE.Mesh(def.geometry, material);
            mesh.position.set(...def.position);
            
            if (def.scale) {
                mesh.scale.set(...def.scale);
            }
            
            mesh.userData.muscleName = name;
            mesh.userData.muscleGroup = def.muscle || name;
            mesh.userData.originalColor = def.color;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.femaleModel.add(mesh);
        }
        
        this.scene.add(this.femaleModel);
        this.femaleModel.visible = false;
    }

    switchToMale() {
        if (this.maleModel) this.maleModel.visible = true;
        if (this.femaleModel) this.femaleModel.visible = false;
        this.currentModel = this.maleModel;
        this.resetHighlight();
    }

    switchToFemale() {
        if (this.maleModel) this.maleModel.visible = false;
        if (this.femaleModel) this.femaleModel.visible = true;
        this.currentModel = this.femaleModel;
        this.resetHighlight();
    }

    highlightMuscle(muscleGroup) {
        if (!this.currentModel) return;
        
        this.resetHighlight();
        this.selectedMuscle = muscleGroup;
        
        this.currentModel.children.forEach(mesh => {
            if (mesh.userData.muscleGroup === muscleGroup) {
                mesh.material.color.setHex(0xffff00);
                mesh.material.emissive = new THREE.Color(0x888800);
                
                // Pulse animation
                const originalScale = mesh.scale.clone();
                const pulseScale = originalScale.clone().multiplyScalar(1.1);
                
                let growing = true;
                const pulseInterval = setInterval(() => {
                    if (this.selectedMuscle !== muscleGroup) {
                        clearInterval(pulseInterval);
                        mesh.scale.copy(originalScale);
                        return;
                    }
                    
                    if (growing) {
                        mesh.scale.lerp(pulseScale, 0.1);
                        if (mesh.scale.length() >= pulseScale.length() * 0.98) {
                            growing = false;
                        }
                    } else {
                        mesh.scale.lerp(originalScale, 0.1);
                        if (mesh.scale.length() <= originalScale.length() * 1.02) {
                            growing = true;
                        }
                    }
                }, 50);
            }
        });
        
        this.showMuscleInfo(muscleGroup);
    }

    resetHighlight() {
        if (!this.currentModel) return;
        
        this.selectedMuscle = null;
        this.currentModel.children.forEach(mesh => {
            if (mesh.userData.originalColor) {
                mesh.material.color.setHex(mesh.userData.originalColor);
                mesh.material.emissive = new THREE.Color(0x000000);
                mesh.scale.set(
                    mesh.geometry.parameters.radiusTop ? 1 : (mesh.userData.originalScale?.x || 1),
                    mesh.geometry.parameters.radiusTop ? 1 : (mesh.userData.originalScale?.y || 1),
                    mesh.geometry.parameters.radiusTop ? 1 : (mesh.userData.originalScale?.z || 1)
                );
            }
        });
        
        this.hideInfo();
    }

    showMuscleInfo(muscleGroup) {
        const muscleInfo = {
            chest: {
                title: 'Peitoral (Pectoralis)',
                description: 'Grupo muscular principal do tórax, responsável pela força de empurrar e movimentos de adução do braço.',
                functions: [
                    'Flexão do ombro',
                    'Adução horizontal do braço',
                    'Rotação interna do úmero',
                    'Estabilização do tronco'
                ]
            },
            shoulders: {
                title: 'Deltoides',
                description: 'Músculo que forma o contorno arredondado do ombro, dividido em três partes: anterior, medial e posterior.',
                functions: [
                    'Abdução do braço',
                    'Flexão e extensão do ombro',
                    'Rotação do braço',
                    'Estabilização da articulação do ombro'
                ]
            },
            biceps: {
                title: 'Bíceps Braquial',
                description: 'Músculo de dois ventres na parte anterior do braço, essencial para flexão e supinação.',
                functions: [
                    'Flexão do cotovelo',
                    'Supinação do antebraço',
                    'Flexão do ombro',
                    'Estabilização do cotovelo'
                ]
            },
            triceps: {
                title: 'Tríceps Braquial',
                description: 'Músculo de três ventres na parte posterior do braço, principal extensor do cotovelo.',
                functions: [
                    'Extensão do cotovelo',
                    'Extensão do ombro',
                    'Estabilização da articulação',
                    'Apoio em movimentos de empurrar'
                ]
            },
            abs: {
                title: 'Abdominais',
                description: 'Grupo muscular da parede abdominal anterior, incluindo reto abdominal e oblíquos.',
                functions: [
                    'Flexão do tronco',
                    'Rotação do tronco',
                    'Estabilização da coluna',
                    'Proteção dos órgãos internos'
                ]
            },
            back: {
                title: 'Dorsais (Latissimus Dorsi)',
                description: 'Grande músculo das costas, responsável por movimentos de puxar e extensão do braço.',
                functions: [
                    'Adução do braço',
                    'Extensão do ombro',
                    'Rotação interna do úmero',
                    'Assistência na respiração forçada'
                ]
            },
            quadriceps: {
                title: 'Quadríceps Femoral',
                description: 'Grupo de quatro músculos na parte anterior da coxa, o mais volumoso do corpo.',
                functions: [
                    'Extensão do joelho',
                    'Flexão do quadril',
                    'Estabilização da patela',
                    'Suporte ao caminhar e correr'
                ]
            },
            hamstrings: {
                title: 'Isquiotibiais',
                description: 'Grupo de três músculos na parte posterior da coxa, antagonistas dos quadríceps.',
                functions: [
                    'Flexão do joelho',
                    'Extensão do quadril',
                    'Rotação da perna',
                    'Desaceleração durante corrida'
                ]
            },
            calves: {
                title: 'Panturrilhas (Gastrocnêmio e Sóleo)',
                description: 'Músculos da parte posterior da perna, essenciais para locomoção e equilíbrio.',
                functions: [
                    'Flexão plantar do tornozelo',
                    'Flexão do joelho (gastrocnêmio)',
                    'Propulsão ao caminhar',
                    'Manutenção do equilíbrio'
                ]
            },
            glutes: {
                title: 'Glúteos',
                description: 'Grupo de três músculos (máximo, médio e mínimo) que formam as nádegas.',
                functions: [
                    'Extensão do quadril',
                    'Abdução da coxa',
                    'Rotação externa e interna',
                    'Estabilização pélvica'
                ]
            }
        };
        
        const info = muscleInfo[muscleGroup];
        if (!info) return;
        
        document.getElementById('infoTitle').textContent = info.title;
        document.getElementById('infoDescription').textContent = info.description;
        
        const functionsList = document.getElementById('infoFunctions');
        functionsList.innerHTML = '';
        info.functions.forEach(func => {
            const li = document.createElement('li');
            li.textContent = func;
            functionsList.appendChild(li);
        });
        
        document.getElementById('infoPanel').classList.remove('hidden');
    }

    hideInfo() {
        document.getElementById('infoPanel').classList.add('hidden');
    }

    setCameraView(view) {
        const distance = 8;
        let targetPosition;
        
        switch(view) {
            case 'front':
                targetPosition = { x: 0, y: 2, z: distance };
                break;
            case 'back':
                targetPosition = { x: 0, y: 2, z: -distance };
                break;
            case 'side':
                targetPosition = { x: distance, y: 2, z: 0 };
                break;
            default:
                targetPosition = { x: 0, y: 2, z: distance };
        }
        
        // Smooth camera transition
        const animateCamera = () => {
            this.camera.position.x += (targetPosition.x - this.camera.position.x) * 0.1;
            this.camera.position.y += (targetPosition.y - this.camera.position.y) * 0.1;
            this.camera.position.z += (targetPosition.z - this.camera.position.z) * 0.1;
            
            this.camera.lookAt(0, 3, 0);
            
            if (Math.abs(this.camera.position.x - targetPosition.x) > 0.01 ||
                Math.abs(this.camera.position.y - targetPosition.y) > 0.01 ||
                Math.abs(this.camera.position.z - targetPosition.z) > 0.01) {
                requestAnimationFrame(animateCamera);
            }
        };
        
        animateCamera();
    }

    toggleWireframe(enabled) {
        this.wireframeMode = enabled;
        if (!this.currentModel) return;
        
        this.currentModel.children.forEach(mesh => {
            if (mesh.material) {
                mesh.material.wireframe = enabled;
            }
        });
    }

    resetView() {
        this.camera.position.set(0, 2, 8);
        this.camera.lookAt(0, 3, 0);
        if (this.currentModel) {
            this.currentModel.rotation.set(0, 0, 0);
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Auto-rotate model
        if (this.autoRotate && this.currentModel) {
            this.currentModel.rotation.y += 0.005 * this.rotationSpeed;
        }
        
        // Look at center of model
        this.camera.lookAt(0, 3, 0);
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const canvas = document.getElementById('muscleCanvas');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 500);
    }

    setupControls() {
        // Gender buttons
        document.getElementById('maleBtn').addEventListener('click', () => {
            this.switchToMale();
            document.getElementById('maleBtn').classList.add('active');
            document.getElementById('femaleBtn').classList.remove('active');
        });
        
        document.getElementById('femaleBtn').addEventListener('click', () => {
            this.switchToFemale();
            document.getElementById('femaleBtn').classList.add('active');
            document.getElementById('maleBtn').classList.remove('active');
        });
        
        // View buttons
        document.getElementById('frontBtn').addEventListener('click', () => {
            this.setCameraView('front');
        });
        
        document.getElementById('backBtn').addEventListener('click', () => {
            this.setCameraView('back');
        });
        
        document.getElementById('sideBtn').addEventListener('click', () => {
            this.setCameraView('side');
        });
        
        // Muscle buttons
        document.querySelectorAll('.muscle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const muscle = e.target.dataset.muscle;
                
                // Toggle active state
                if (e.target.classList.contains('active')) {
                    e.target.classList.remove('active');
                    this.resetHighlight();
                } else {
                    document.querySelectorAll('.muscle-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.highlightMuscle(muscle);
                }
            });
        });
        
        // Auto-rotate checkbox
        document.getElementById('autoRotate').addEventListener('change', (e) => {
            this.autoRotate = e.target.checked;
        });
        
        // Speed slider
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.rotationSpeed = parseFloat(e.target.value);
        });
        
        // Show labels checkbox
        document.getElementById('showLabels').addEventListener('change', (e) => {
            this.showLabels = e.target.checked;
        });
        
        // Wireframe checkbox
        document.getElementById('wireframe').addEventListener('change', (e) => {
            this.toggleWireframe(e.target.checked);
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetView();
            this.resetHighlight();
            document.querySelectorAll('.muscle-btn').forEach(b => b.classList.remove('active'));
        });
        
        // Close info panel
        document.getElementById('closeInfo').addEventListener('click', () => {
            this.hideInfo();
        });
        
        // Mouse controls for rotation
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        const canvas = document.getElementById('muscleCanvas');
        
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (isDragging && this.currentModel) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;
                
                this.currentModel.rotation.y += deltaX * 0.01;
                this.currentModel.rotation.x += deltaY * 0.01;
                
                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });
        
        // Mouse wheel for zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY * 0.01;
            this.camera.position.z += delta;
            this.camera.position.z = Math.max(4, Math.min(15, this.camera.position.z));
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MuscleAnimationSystem();
});
