/**
 * Synapse Flight Path - Scroll-Driven Camera
 * NeoProxy Interactive Intro - ADVANCED VERSION
 * Integrates real kernel data + particle effects + audio reactivity
 */

import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

export class SynapseFlight {
    constructor(canvasId, kernelData = null) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.kernelData = kernelData || this.generateMockKernelData();

        // Sistema de partículas avanzado
        this.particleSystems = [];

        // Audio context para reactividad sonora
        this.audioContext = null;
        this.initAudio();

        // Cámara free para vuelo cinematográfico
        this.camera = new BABYLON.ArcRotateCamera("camera", Math.PI/2, Math.PI/4, 50, BABYLON.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.lowerRadiusLimit = 5;
        this.camera.upperRadiusLimit = 100;

        // Iluminación avanzada
        this.setupLighting();

        // Contenedor de nodos con datos reales
        this.nodes = [];
        this.connections = [];
        this.createNodesFromKernel();

        // Efectos visuales
        this.setupPostProcessing();

        // Bind scroll con throttling
        this.scrollHandler = this.throttle(() => this.onScroll(), 16); // ~60fps
        window.addEventListener("scroll", this.scrollHandler);

        // Motor de render optimizado
        this.engine.runRenderLoop(() => this.render());

        // Ajuste de ventana
        window.addEventListener("resize", () => this.engine.resize());

        // Estado de animación
        this.currentPhase = 0;
        this.phaseProgress = 0;
        this.lastScrollPercent = 0;
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Crear oscilador para efectos sonoros reactivos
            this.oscillator = this.audioContext.createOscillator();
            this.gainNode = this.audioContext.createGain();
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            this.oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        } catch (e) {
            console.warn('Audio not supported');
        }
    }

    setupLighting() {
        // Luz principal (como KERNEL)
        const mainLight = new BABYLON.PointLight("mainLight", new BABYLON.Vector3(0, 0, 0), this.scene);
        mainLight.diffuse = new BABYLON.Color3(1, 0, 0);
        mainLight.intensity = 0.8;

        // Luz ambiental verde neón
        const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        ambientLight.diffuse = new BABYLON.Color3(0, 0.6, 0.4);
        ambientLight.intensity = 0.3;

        // Luz de portal dorada
        const portalLight = new BABYLON.SpotLight("portalLight", new BABYLON.Vector3(0, -10, 0), new BABYLON.Vector3(0, 1, 0), Math.PI/3, 2, this.scene);
        portalLight.diffuse = new BABYLON.Color3(1, 0.8, 0);
        portalLight.intensity = 0.5;
    }

    generateMockKernelData() {
        // Generar datos simulados del kernel para demo
        const nodes = [];
        const nodeTypes = ['agent', 'model', 'data', 'connection', 'portal'];

        for (let i = 0; i < 256; i++) {
            nodes.push({
                id: `node_${i}`,
                type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
                position: {
                    x: (Math.random() - 0.5) * 40,
                    y: (Math.random() - 0.5) * 40,
                    z: (Math.random() - 0.5) * 40
                },
                connections: Math.floor(Math.random() * 5) + 1,
                activity: Math.random(),
                color: this.getNodeColor(nodeTypes[Math.floor(Math.random() * nodeTypes.length)])
            });
        }
        return { nodes };
    }

    getNodeColor(type) {
        const colors = {
            agent: new BABYLON.Color3(0, 1, 0.6),    // Verde neón
            model: new BABYLON.Color3(0.3, 0.6, 1),   // Azul
            data: new BABYLON.Color3(1, 0.4, 0.4),    // Rojo coral
            connection: new BABYLON.Color3(1, 0.8, 0), // Dorado
            portal: new BABYLON.Color3(1, 1, 1)        // Blanco
        };
        return colors[type] || colors.data;
    }

    createNodesFromKernel() {
        this.kernelData.nodes.forEach((nodeData, index) => {
            // Crear esfera para el nodo
            const sphere = BABYLON.MeshBuilder.CreateSphere(`node_${index}`, {
                diameter: 0.3 + nodeData.activity * 0.7
            }, this.scene);

            // Material con glow
            const material = new BABYLON.StandardMaterial(`mat_${index}`, this.scene);
            material.emissiveColor = nodeData.color;
            material.diffuseColor = nodeData.color.clone().scale(0.3);
            material.alpha = 0.8;
            sphere.material = material;

            // Posición inicial
            sphere.position = new BABYLON.Vector3(
                nodeData.position.x,
                nodeData.position.y,
                nodeData.position.z
            );

            // Metadata para animaciones
            sphere.metadata = {
                originalPosition: sphere.position.clone(),
                targetPosition: sphere.position.clone(),
                activity: nodeData.activity,
                type: nodeData.type,
                connections: nodeData.connections
            };

            this.nodes.push(sphere);

            // Crear conexiones si tiene
            if (nodeData.connections > 0) {
                this.createConnectionsForNode(sphere, nodeData.connections);
            }
        });

        // Sistema de partículas para nodos activos
        this.createParticleSystems();
    }

    createConnectionsForNode(node, connectionCount) {
        for (let i = 0; i < connectionCount; i++) {
            const targetNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            if (targetNode !== node) {
                const connection = BABYLON.MeshBuilder.CreateCylinder(`connection_${node.name}_${i}`, {
                    height: BABYLON.Vector3.Distance(node.position, targetNode.position),
                    diameter: 0.05
                }, this.scene);

                // Orientar conexión entre nodos
                connection.position = node.position.clone().add(targetNode.position).scale(0.5);
                connection.lookAt(targetNode.position);

                const material = new BABYLON.StandardMaterial(`conn_mat_${i}`, this.scene);
                material.emissiveColor = new BABYLON.Color3(0, 0.5, 0.3);
                material.alpha = 0.4;
                connection.material = material;

                this.connections.push({
                    mesh: connection,
                    start: node,
                    end: targetNode,
                    originalLength: connection.scaling.y
                });
            }
        }
    }

    createParticleSystems() {
        this.nodes.forEach((node, index) => {
            if (node.metadata.activity > 0.7) { // Solo nodos muy activos
                const particleSystem = new BABYLON.ParticleSystem(`particles_${index}`, 100, this.scene);

                particleSystem.particleTexture = this.createParticleTexture();
                particleSystem.emitter = node;
                particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
                particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);

                particleSystem.color1 = node.metadata.type === 'agent' ?
                    new BABYLON.Color4(0, 1, 0.6, 1) :
                    new BABYLON.Color4(0.3, 0.6, 1, 1);
                particleSystem.color2 = new BABYLON.Color4(1, 1, 1, 0.5);

                particleSystem.minSize = 0.1;
                particleSystem.maxSize = 0.3;
                particleSystem.minLifeTime = 0.5;
                particleSystem.maxLifeTime = 2.0;
                particleSystem.emitRate = 20 * node.metadata.activity;

                particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
                particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
                particleSystem.minEmitPower = 0.5;
                particleSystem.maxEmitPower = 2.0;

                particleSystem.start();
                this.particleSystems.push(particleSystem);
            }
        });
    }

    createParticleTexture() {
        // Crear textura procedural para partículas
        const texture = BABYLON.RawTexture.CreateRGBATexture(
            new Uint8Array([255, 255, 255, 255, 255, 255, 255, 128, 255, 255, 255, 128, 128, 128, 128, 0]),
            2, 2, this.scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE
        );
        return texture;
    }

    setupPostProcessing() {
        // Efectos de post-procesamiento para look más cinematográfico
        const pipeline = new BABYLON.DefaultRenderingPipeline("pipeline", true, this.scene, [this.camera]);

        pipeline.bloomEnabled = true;
        pipeline.bloomThreshold = 0.8;
        pipeline.bloomWeight = 0.3;
        pipeline.bloomKernel = 64;

        pipeline.imageProcessingEnabled = true;
        pipeline.imageProcessing.contrast = 1.2;
        pipeline.imageProcessing.exposure = 1.1;
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    onScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.max(0, Math.min(1, scrollTop / docHeight));

        // Suavizado del porcentaje para transiciones más fluidas
        const smoothedPercent = this.smoothScroll(scrollPercent);

        // Actualizar audio si disponible
        this.updateAudio(smoothedPercent);

        // Fases definidas por porcentaje de scroll
        if (smoothedPercent <= 0.15) {
            // Fase 0-15%: Boot sequence - nodos aparecen gradualmente
            this.phaseBoot(smoothedPercent / 0.15);
        } else if (smoothedPercent <= 0.4) {
            // Fase 15-40%: Exploración inicial - cámara orbital
            this.phaseExploration((smoothedPercent - 0.15) / 0.25);
        } else if (smoothedPercent <= 0.7) {
            // Fase 40-70%: Vuelo sináptico - movimiento dinámico
            this.phaseSynapseFlight((smoothedPercent - 0.4) / 0.3);
        } else {
            // Fase 70-100%: Formación de interfaz - nodos se reorganizan
            this.phaseInterfaceFormation((smoothedPercent - 0.7) / 0.3);
        }

        this.lastScrollPercent = smoothedPercent;
    }

    smoothScroll(current) {
        // Suavizado exponencial para transiciones más naturales
        const smoothing = 0.1;
        return this.lastScrollPercent + (current - this.lastScrollPercent) * smoothing;
    }

    updateAudio(scrollPercent) {
        if (!this.audioContext || !this.oscillator) return;

        // Frecuencia cambia con el scroll
        const frequency = 220 + scrollPercent * 440; // 220Hz a 660Hz
        this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        // Volumen basado en actividad de nodos
        const activeNodes = this.nodes.filter(n => n.metadata.activity > 0.5).length;
        const volume = Math.min(0.1, (activeNodes / this.nodes.length) * 0.05);
        this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }

    phaseBoot(progress) {
        // Nodos aparecen gradualmente desde el centro
        this.nodes.forEach((node, index) => {
            const delay = index * 0.01;
            const nodeProgress = Math.max(0, Math.min(1, (progress - delay) * 2));

            // Escalar desde 0
            node.scaling.setAll(nodeProgress * (0.5 + node.metadata.activity));

            // Opacidad
            if (node.material) {
                node.material.alpha = nodeProgress * 0.8;
            }
        });

        // Cámara se aleja lentamente
        this.camera.radius = 30 + progress * 20;
        this.camera.alpha = Math.PI/2 + progress * 0.2;
    }

    phaseExploration(progress) {
        // Movimiento orbital de la cámara
        this.camera.alpha = Math.PI/2 + progress * Math.PI * 2;
        this.camera.beta = Math.PI/4 + Math.sin(progress * Math.PI) * 0.3;
        this.camera.radius = 50 - progress * 20;

        // Nodos respiran suavemente
        this.nodes.forEach((node, index) => {
            const breath = Math.sin(progress * Math.PI * 2 + index * 0.1) * 0.1 + 1;
            node.scaling.setAll(breath * (0.5 + node.metadata.activity));
        });
    }

    phaseSynapseFlight(progress) {
        // Vuelo dinámico a través de las sinapsis
        const flightPath = this.generateFlightPath(progress);

        this.camera.position = flightPath.position;
        this.camera.setTarget(flightPath.target);

        // Nodos se activan cerca de la cámara
        this.nodes.forEach((node) => {
            const distance = BABYLON.Vector3.Distance(node.position, this.camera.position);
            if (distance < 15) {
                // Activar nodos cercanos
                const activation = Math.max(0, 1 - distance / 15);
                node.scaling.setAll((0.5 + node.metadata.activity) * (1 + activation * 0.5));

                if (node.material) {
                    node.material.emissiveColor = node.metadata.color.clone().scale(1 + activation);
                }
            }
        });

        // Actualizar conexiones
        this.updateConnections(progress);
    }

    phaseInterfaceFormation(progress) {
        // Nodos se reorganizan en formaciones de interfaz
        this.nodes.forEach((node, index) => {
            const formation = this.getInterfaceFormation(index, progress);
            node.position = BABYLON.Vector3.Lerp(node.metadata.originalPosition, formation, progress);

            // Escalar basado en importancia
            const targetScale = 0.3 + node.metadata.activity * 0.7 * (1 + progress * 0.5);
            node.scaling.setAll(targetScale);
        });

        // Cámara se posiciona para vista final
        this.camera.alpha = Math.PI/2;
        this.camera.beta = Math.PI/4 + progress * 0.2;
        this.camera.radius = 25 - progress * 10;
    }

    generateFlightPath(progress) {
        // Generar path de vuelo cinematográfico
        const angle = progress * Math.PI * 4;
        const radius = 20 - progress * 10;
        const height = Math.sin(progress * Math.PI * 2) * 5;

        return {
            position: new BABYLON.Vector3(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            ),
            target: new BABYLON.Vector3(
                Math.cos(angle + 0.5) * 5,
                height * 0.5,
                Math.sin(angle + 0.5) * 5
            )
        };
    }

    getInterfaceFormation(index, progress) {
        // Formaciones de interfaz (agentes, modelos, etc.)
        const formations = [
            // Formación de agentes (izquierda)
            new BABYLON.Vector3(-8 + (index % 4) * 2, -4 + Math.floor(index / 4) * 2, 0),
            // Formación de modelos (arriba)
            new BABYLON.Vector3(-6 + (index % 6) * 2, 6, -2 + Math.floor(index / 6) * 1),
            // Formación de datos (derecha)
            new BABYLON.Vector3(8, -4 + (index % 8) * 1, -4 + Math.floor(index / 8) * 1)
        ];

        return formations[index % formations.length];
    }

    updateConnections(progress) {
        this.connections.forEach((connection) => {
            const distance = BABYLON.Vector3.Distance(connection.start.position, connection.end.position);
            connection.mesh.scaling.y = distance / connection.originalLength;

            // Orientar conexión
            connection.mesh.position = connection.start.position.clone().add(connection.end.position).scale(0.5);
            connection.mesh.lookAt(connection.end.position);

            // Opacidad basada en actividad
            if (connection.mesh.material) {
                const activity = (connection.start.metadata.activity + connection.end.metadata.activity) / 2;
                connection.mesh.material.alpha = (0.2 + activity * 0.3) * (0.5 + progress * 0.5);
            }
        });
    }

    render() {
        // Animaciones por frame
        const time = this.engine.getDeltaTime() * 0.001;

        // Pulsos de nodos activos
        this.nodes.forEach((node, index) => {
            if (node.metadata.activity > 0.8) {
                const pulse = Math.sin(time * 3 + index) * 0.1 + 1;
                node.scaling.setAll(pulse * (0.5 + node.metadata.activity));
            }
        });

        // Renderizar escena
        this.scene.render();
    }

    dispose() {
        // Limpieza
        window.removeEventListener("scroll", this.scrollHandler);
        window.removeEventListener("resize", () => this.engine.resize());

        if (this.audioContext) {
            this.oscillator?.stop();
            this.audioContext.close();
        }

        this.particleSystems.forEach(ps => ps.dispose());
        this.engine.dispose();
    }
}