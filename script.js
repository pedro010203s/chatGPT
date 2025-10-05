// 3D Muscle System Animation
class MuscleSystem3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationId = null;
        this.clock = new THREE.Clock();
        
        // Animation properties
        this.isAnimating = false;
        this.animationSpeed = 1.0;
        this.currentGender = 'male';
        this.activeGroup = 'all';
        
        // Muscle groups and models
        this.muscleGroups = {
            male: {},
            female: {}
        };
        
        // Muscle data
        this.muscleData = {
            chest: {
                name: 'Músculos Peitorais',
                description: 'Os músculos peitorais são responsáveis pela adução e flexão do braço.',
                muscles: ['Peitoral Maior', 'Peitoral Menor'],
                color: 0xff6b6b
            },
            back: {
                name: 'Músculos Dorsais',
                description: 'Os músculos das costas proporcionam estabilidade e movimento da coluna.',
                muscles: ['Latíssimo do Dorso', 'Trapézio', 'Romboides'],
                color: 0x4ecdc4
            },
            arms: {
                name: 'Músculos dos Braços',
                description: 'Músculos responsáveis pela flexão e extensão dos braços.',
                muscles: ['Bíceps', 'Tríceps', 'Deltoides'],
                color: 0xffe66d
            },
            legs: {
                name: 'Músculos das Pernas',
                description: 'Músculos que proporcionam locomoção e estabilidade.',
                muscles: ['Quadríceps', 'Isquiotibiais', 'Gastrocnêmio'],
                color: 0xa8e6cf
            },
            core: {
                name: 'Músculos do Core',
                description: 'Músculos centrais que proporcionam estabilidade ao tronco.',
                muscles: ['Reto Abdominal', 'Oblíquos', 'Transverso do Abdome'],
                color: 0xffa8a8
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupLighting();
        this.setupControls();
        this.createMuscleModels();
        this.setupEventListeners();
        this.animate();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 1000);
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Camera
        const container = document.getElementById('scene-container');
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);
        
        // Renderer
        const canvas = document.getElementById('canvas3d');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);
        
        // Fill lights
        const fillLight1 = new THREE.DirectionalLight(0x4ecdc4, 0.3);
        fillLight1.position.set(-3, 2, -2);
        this.scene.add(fillLight1);
        
        const fillLight2 = new THREE.DirectionalLight(0xff6b6b, 0.2);
        fillLight2.position.set(2, -2, 3);
        this.scene.add(fillLight2);
        
        // Rim light
        const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
        rimLight.position.set(-5, 0, -5);
        this.scene.add(rimLight);
    }
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI * 0.8;
    }
    
    createMuscleModels() {
        // Create male and female body models with muscle groups
        this.createBodyModel('male');
        this.createBodyModel('female');
        
        // Show male model by default
        this.switchGender('male');
    }
    
    createBodyModel(gender) {
        const bodyGroup = new THREE.Group();
        bodyGroup.name = `${gender}Body`;
        
        // Create different muscle groups with distinct geometries
        const muscleGroups = ['chest', 'back', 'arms', 'legs', 'core'];
        
        muscleGroups.forEach((group, index) => {
            const muscleGroup = this.createMuscleGroup(group, gender, index);
            bodyGroup.add(muscleGroup);
        });
        
        this.muscleGroups[gender] = bodyGroup;
        this.scene.add(bodyGroup);
    }
    
    createMuscleGroup(groupName, gender, index) {
        const group = new THREE.Group();
        group.name = groupName;
        
        const data = this.muscleData[groupName];
        const baseColor = new THREE.Color(data.color);
        
        // Create multiple muscle geometries for each group
        const muscleCount = data.muscles.length;
        
        for (let i = 0; i < muscleCount; i++) {
            const muscle = this.createIndividualMuscle(groupName, i, gender, baseColor);
            group.add(muscle);
        }
        
        return group;
    }
    
    createIndividualMuscle(groupName, muscleIndex, gender, baseColor) {
        let geometry, position, scale;
        
        // Define muscle positions and shapes based on group and gender
        switch (groupName) {
            case 'chest':
                geometry = new THREE.BoxGeometry(0.8, 0.3, 0.2);
                position = new THREE.Vector3(
                    (muscleIndex - 0.5) * 0.4,
                    0.5 + muscleIndex * 0.1,
                    0.3
                );
                scale = gender === 'female' ? 0.8 : 1.0;
                break;
                
            case 'back':
                geometry = new THREE.CylinderGeometry(0.15, 0.2, 0.6, 8);
                position = new THREE.Vector3(
                    (muscleIndex - 1) * 0.3,
                    0.2 - muscleIndex * 0.2,
                    -0.3
                );
                scale = 1.0;
                break;
                
            case 'arms':
                geometry = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
                position = new THREE.Vector3(
                    (muscleIndex === 0 ? -1.2 : muscleIndex === 1 ? 1.2 : 0),
                    0.3,
                    muscleIndex === 2 ? 0.2 : 0
                );
                scale = gender === 'female' ? 0.85 : 1.0;
                break;
                
            case 'legs':
                geometry = new THREE.CylinderGeometry(0.12, 0.15, 0.8, 8);
                position = new THREE.Vector3(
                    (muscleIndex - 1) * 0.4,
                    -0.8,
                    0
                );
                scale = gender === 'female' ? 0.9 : 1.0;
                break;
                
            case 'core':
                geometry = new THREE.BoxGeometry(0.6, 0.2, 0.15);
                position = new THREE.Vector3(
                    0,
                    0.1 - muscleIndex * 0.15,
                    0.1
                );
                scale = gender === 'female' ? 0.85 : 1.0;
                break;
                
            default:
                geometry = new THREE.SphereGeometry(0.1);
                position = new THREE.Vector3(0, 0, 0);
                scale = 1.0;
        }
        
        // Create material with muscle-like properties
        const material = new THREE.MeshPhongMaterial({
            color: baseColor,
            shininess: 30,
            transparent: true,
            opacity: 0.9
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.scale.setScalar(scale);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Add muscle data for interaction
        mesh.userData = {
            groupName: groupName,
            muscleName: this.muscleData[groupName].muscles[muscleIndex],
            originalColor: baseColor.clone(),
            originalScale: scale
        };
        
        return mesh;
    }
    
    setupEventListeners() {
        // Gender buttons
        document.getElementById('maleBtn').addEventListener('click', () => {
            this.switchGender('male');
        });
        
        document.getElementById('femaleBtn').addEventListener('click', () => {
            this.switchGender('female');
        });
        
        // Muscle group buttons
        document.querySelectorAll('.muscle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.highlightMuscleGroup(e.target.dataset.group);
            });
        });
        
        // Animation controls
        document.getElementById('playBtn').addEventListener('click', () => {
            this.startAnimation();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseAnimation();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetAnimation();
        });
        
        // Speed control
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = `${this.animationSpeed.toFixed(1)}x`;
        });
        
        // Mouse interaction for muscle selection
        this.setupMouseInteraction();
    }
    
    setupMouseInteraction() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.camera);
            
            const currentBody = this.muscleGroups[this.currentGender];
            const intersects = raycaster.intersectObjects(currentBody.children, true);
            
            if (intersects.length > 0) {
                const selectedMuscle = intersects[0].object;
                this.selectMuscle(selectedMuscle);
            }
        });
    }
    
    switchGender(gender) {
        this.currentGender = gender;
        
        // Hide all bodies
        Object.values(this.muscleGroups).forEach(body => {
            body.visible = false;
        });
        
        // Show selected gender
        if (this.muscleGroups[gender]) {
            this.muscleGroups[gender].visible = true;
        }
        
        // Update UI
        document.querySelectorAll('#maleBtn, #femaleBtn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${gender}Btn`).classList.add('active');
        
        // Reset muscle group highlighting
        this.highlightMuscleGroup('all');
    }
    
    highlightMuscleGroup(groupName) {
        this.activeGroup = groupName;
        
        const currentBody = this.muscleGroups[this.currentGender];
        if (!currentBody) return;
        
        // Reset all muscles
        currentBody.children.forEach(group => {
            group.children.forEach(muscle => {
                muscle.material.opacity = groupName === 'all' || group.name === groupName ? 0.9 : 0.3;
                muscle.material.emissive.setHex(0x000000);
            });
        });
        
        // Highlight selected group
        if (groupName !== 'all') {
            const targetGroup = currentBody.children.find(group => group.name === groupName);
            if (targetGroup) {
                targetGroup.children.forEach(muscle => {
                    muscle.material.emissive.setHex(0x222222);
                });
            }
        }
        
        // Update UI
        document.querySelectorAll('.muscle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-group="${groupName}"]`).classList.add('active');
        
        // Update info panel
        this.updateInfoPanel(groupName);
    }
    
    selectMuscle(muscle) {
        const userData = muscle.userData;
        const groupData = this.muscleData[userData.groupName];
        
        // Highlight selected muscle
        this.resetMuscleHighlights();
        muscle.material.emissive.setHex(0x444444);
        muscle.scale.setScalar(userData.originalScale * 1.1);
        
        // Update info panel with specific muscle info
        document.getElementById('muscle-name').textContent = userData.muscleName;
        document.getElementById('muscle-description').textContent = groupData.description;
        
        const detailsDiv = document.getElementById('muscle-details');
        detailsDiv.innerHTML = `
            <div class="muscle-detail">
                <strong>Grupo:</strong> ${groupData.name}
            </div>
            <div class="muscle-detail">
                <strong>Função:</strong> ${groupData.description}
            </div>
            <div class="muscle-detail">
                <strong>Músculos do Grupo:</strong> ${groupData.muscles.join(', ')}
            </div>
        `;
    }
    
    resetMuscleHighlights() {
        const currentBody = this.muscleGroups[this.currentGender];
        if (!currentBody) return;
        
        currentBody.children.forEach(group => {
            group.children.forEach(muscle => {
                muscle.material.emissive.setHex(0x000000);
                muscle.scale.setScalar(muscle.userData.originalScale);
            });
        });
    }
    
    updateInfoPanel(groupName) {
        if (groupName === 'all') {
            document.getElementById('muscle-name').textContent = 'Sistema Muscular';
            document.getElementById('muscle-description').textContent = 
                'Explore o sistema muscular humano. Clique em um músculo para ver informações detalhadas.';
            document.getElementById('muscle-details').innerHTML = '';
        } else {
            const data = this.muscleData[groupName];
            document.getElementById('muscle-name').textContent = data.name;
            document.getElementById('muscle-description').textContent = data.description;
            
            const detailsDiv = document.getElementById('muscle-details');
            detailsDiv.innerHTML = `
                <div class="muscle-detail">
                    <strong>Músculos:</strong> ${data.muscles.join(', ')}
                </div>
            `;
        }
    }
    
    startAnimation() {
        this.isAnimating = true;
        document.getElementById('playBtn').classList.add('active');
        document.getElementById('pauseBtn').classList.remove('active');
    }
    
    pauseAnimation() {
        this.isAnimating = false;
        document.getElementById('playBtn').classList.remove('active');
        document.getElementById('pauseBtn').classList.add('active');
    }
    
    resetAnimation() {
        this.isAnimating = false;
        this.clock.elapsedTime = 0;
        document.getElementById('playBtn').classList.remove('active');
        document.getElementById('pauseBtn').classList.remove('active');
        
        // Reset all muscle positions and scales
        Object.values(this.muscleGroups).forEach(body => {
            body.children.forEach(group => {
                group.children.forEach(muscle => {
                    muscle.scale.setScalar(muscle.userData.originalScale);
                    muscle.rotation.set(0, 0, 0);
                });
            });
        });
    }
    
    animateMuscles() {
        if (!this.isAnimating) return;
        
        const time = this.clock.getElapsedTime() * this.animationSpeed;
        const currentBody = this.muscleGroups[this.currentGender];
        
        if (!currentBody) return;
        
        currentBody.children.forEach((group, groupIndex) => {
            if (this.activeGroup === 'all' || group.name === this.activeGroup) {
                group.children.forEach((muscle, muscleIndex) => {
                    // Breathing/pulsing animation
                    const pulseFreq = 1.5 + groupIndex * 0.3;
                    const pulseAmp = 0.1;
                    const pulse = Math.sin(time * pulseFreq + muscleIndex) * pulseAmp;
                    
                    // Muscle contraction simulation
                    const contractionFreq = 0.8;
                    const contractionAmp = 0.15;
                    const contraction = Math.sin(time * contractionFreq + groupIndex) * contractionAmp;
                    
                    const scale = muscle.userData.originalScale * (1 + pulse + contraction);
                    muscle.scale.setScalar(Math.max(0.1, scale));
                    
                    // Subtle rotation for dynamic effect
                    muscle.rotation.y = Math.sin(time * 0.5 + muscleIndex) * 0.1;
                });
            }
        });
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.animateMuscles();
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const container = document.getElementById('scene-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.renderer.dispose();
        this.controls.dispose();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const muscleSystem = new MuscleSystem3D();
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
        muscleSystem.dispose();
    });
});