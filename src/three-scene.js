/**
 * Three.js scene management for the portfolio
 * Enhanced with 3D Neural Navigation
 */
export class ThreeScene {
    constructor(containerId, app) {
        this.app = app;
        this.container = document.getElementById(containerId);
        this.isMobile = window.innerWidth <= 768;
        
        // Check early before using THREE
        if (!this.container || this.isMobile || typeof THREE === 'undefined') {
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.points = null;
            this.lines = null;
            this.nodes = [];
            this.raycaster = null;
            this.mouse = null;
            return;
        }
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.init();
    }

    init() {
        try {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.container.appendChild(this.renderer.domElement);

            this.camera.position.z = 8;

            this.createNeuralNetwork();
            this.setupInteractions();

            const animate = () => {
                requestAnimationFrame(animate);
                this.updateNetwork();
                this.renderer.render(this.scene, this.camera);
            };

            animate();
            
            window.addEventListener('resize', () => this.handleResize());

        } catch (error) {
            console.error('Three.js Init Error:', error);
        }
    }

    createNeuralNetwork() {
        // Reduced complexity for low-perf devices
        const isLowPerf = document.body.classList.contains('low-perf');
        const particlesCount = isLowPerf ? 60 : 150;
        const positions = new Float32Array(particlesCount * 3);
        this.velocities = [];
        
        for(let i = 0; i < particlesCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
            
            this.velocities.push({
                x: (Math.random() - 0.5) * (isLowPerf ? 0.003 : 0.005),
                y: (Math.random() - 0.5) * (isLowPerf ? 0.003 : 0.005),
                z: (Math.random() - 0.5) * (isLowPerf ? 0.003 : 0.005)
            });
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: isLowPerf ? 0.08 : 0.06,
            color: 0x00b4d8,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(this.geometry, material);
        this.scene.add(this.points);

        // Section Nodes (Interactive targets)
        const sections = [
            { id: 'about', label: 'ABOUT', color: 0x00b4d8 },
            { id: 'experience', label: 'EXP', color: 0x0077b6 },
            { id: 'skills', label: 'SKILLS', color: 0x48cae4 },
            { id: 'projects', label: 'WORK', color: 0x90e0ef },
            { id: 'publications', label: 'PAPER', color: 0x00b4d8 },
            { id: 'contact', label: 'CMD', color: 0x03045e }
        ];

        const nodeGeo = new THREE.SphereGeometry(0.15, isLowPerf ? 8 : 16, isLowPerf ? 8 : 16);
        
        sections.forEach((s, i) => {
            const nodeMat = new THREE.MeshBasicMaterial({ 
                color: s.color,
                transparent: true,
                opacity: 0.8
            });
            const mesh = new THREE.Mesh(nodeGeo, nodeMat);
            
            // Position them in a circular/neural spread
            const angle = (i / sections.length) * Math.PI * 2;
            const radius = 4;
            mesh.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                (Math.random() - 0.5) * 2
            );
            
            mesh.userData = { sectionId: s.id, label: s.label };
            this.nodes.push(mesh);
            this.scene.add(mesh);
        });

        // Connection Lines
        this.linesGeometry = new THREE.BufferGeometry();
        this.linesMaterial = new THREE.LineBasicMaterial({
            color: 0x0077b6,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending
        });
        this.lines = new THREE.LineSegments(this.linesGeometry, this.linesMaterial);
        this.scene.add(this.lines);
    }

    setupInteractions() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('click', () => {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.nodes);
            
            if (intersects.length > 0) {
                const sectionId = intersects[0].object.userData.sectionId;
                if (this.app.lenis) {
                    this.app.lenis.scrollTo('#' + sectionId, { duration: 1.5 });
                }
            }
        });
    }

    updateNetwork() {
        const isLowPerf = document.body.classList.contains('low-perf');
        const posAttr = this.geometry.attributes.position;
        const linePositions = [];
        const particlesCount = posAttr.count;

        // Move base particles
        for(let i = 0; i < particlesCount; i++) {
            posAttr.array[i * 3] += this.velocities[i].x;
            posAttr.array[i * 3 + 1] += this.velocities[i].y;
            posAttr.array[i * 3 + 2] += this.velocities[i].z;

            if(Math.abs(posAttr.array[i * 3]) > 8) this.velocities[i].x *= -1;
            if(Math.abs(posAttr.array[i * 3 + 1]) > 8) this.velocities[i].y *= -1;
            if(Math.abs(posAttr.array[i * 3 + 2]) > 8) this.velocities[i].z *= -1;
        }
        posAttr.needsUpdate = true;

        // Animate nodes slightly
        const time = Date.now() * 0.001;
        this.nodes.forEach((node, i) => {
            node.position.y += Math.sin(time + i) * 0.002;
            node.position.x += Math.cos(time + i) * 0.002;
            
            // Glow effect
            node.material.opacity = 0.5 + Math.sin(time * 2 + i) * 0.3;
        });

        // Draw connections between nodes and close particles
        for(let i = 0; i < this.nodes.length; i++) {
            const nodePos = this.nodes[i].position;
            // Limit connections on low-perf
            const step = isLowPerf ? 3 : 1;
            for(let j = 0; j < particlesCount; j += step) {
                const px = posAttr.array[j * 3];
                const py = posAttr.array[j * 3 + 1];
                const pz = posAttr.array[j * 3 + 2];
                
                const dx = nodePos.x - px;
                const dy = nodePos.y - py;
                const dz = nodePos.z - pz;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

                if(dist < (isLowPerf ? 2.5 : 3)) {
                    linePositions.push(nodePos.x, nodePos.y, nodePos.z, px, py, pz);
                }
            }
        }

        this.linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        
        // Dynamic camera sway
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.03;
        this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.03;
        this.camera.lookAt(0, 0, 0);
    }

    handleResize() {
        if (this.renderer && this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}

