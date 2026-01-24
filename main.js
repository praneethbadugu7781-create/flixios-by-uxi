/* ============================================
   FLIXIOS – Creative Media Studio
   Main JavaScript - Enhanced Multi-Page
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // GLOBAL VARIABLES
    // ============================================
    const body = document.body;
    const pageName = body.dataset.page;
    
    // ============================================
    // CUSTOM CURSOR
    // ============================================
    function initCursor() {
        const cursor = document.getElementById('cursor');
        if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorOutline = cursor.querySelector('.cursor-outline');
        
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Dot follows instantly
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            
            // Outline follows with lag
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;

            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover states
        const hoverElements = document.querySelectorAll('a, button, .service-card, .work-item, .project-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // Click states
        document.addEventListener('mousedown', () => cursor.classList.add('click'));
        document.addEventListener('mouseup', () => cursor.classList.remove('click'));
    }

    // ============================================
    // LOADER
    // ============================================
    function initLoader() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                body.classList.remove('no-scroll');
                
                // Trigger initial animations after loader
                document.querySelectorAll('.animate-on-scroll').forEach(el => {
                    if (isInViewport(el)) {
                        el.classList.add('visible');
                    }
                });
            }, 2000);
        });
    }

    // ============================================
    // NAVIGATION
    // ============================================
    function initNavigation() {
        const nav = document.getElementById('nav');
        const navToggle = document.getElementById('navToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        // Scroll handling
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });

        // Mobile menu toggle
        if (navToggle && mobileMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                body.classList.toggle('no-scroll');
            });

            // Close menu on link click
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    body.classList.remove('no-scroll');
                });
            });
        }
    }

    // ============================================
    // PAGE TRANSITIONS
    // ============================================
    function initPageTransitions() {
        const transition = document.getElementById('pageTransition');
        if (!transition) return;

        // Handle internal links
        document.querySelectorAll('a[href^="index"], a[href^="work"], a[href^="services"], a[href^="about"], a[href^="contact"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if same page or anchor
                if (href.includes('#') && !href.startsWith('#')) return;
                if (window.location.pathname.endsWith(href)) return;

                e.preventDefault();
                
                transition.classList.add('active');
                
                gsap.to(transition, {
                    y: 0,
                    duration: 0.5,
                    ease: 'power4.inOut',
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
                
                gsap.to(transition.querySelector('.transition-logo'), {
                    opacity: 1,
                    duration: 0.3,
                    delay: 0.2
                });
            });
        });
    }

    // ============================================
    // THREE.JS HERO SCENE
    // ============================================
    function initHeroScene() {
        const container = document.getElementById('heroCanvas');
        if (!container || typeof THREE === 'undefined') return;

        // Scene setup
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(
            45,
            container.offsetWidth / container.offsetHeight,
            0.1,
            1000
        );
        camera.position.z = 6;
        camera.position.x = 2;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        scene.add(mainLight);

        const accentLight = new THREE.PointLight(0xc9a962, 0.8, 15);
        accentLight.position.set(-4, 2, 3);
        scene.add(accentLight);

        const rimLight = new THREE.PointLight(0xc9a962, 0.5, 10);
        rimLight.position.set(3, -2, -3);
        scene.add(rimLight);

        // Create Professional Cinema Camera Model
        const cameraGroup = new THREE.Group();

        // Materials
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.3
        });

        const lensMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 0.95,
            roughness: 0.15
        });

        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1a3050,
            metalness: 0.1,
            roughness: 0.05,
            transmission: 0.9,
            thickness: 0.5,
            envMapIntensity: 1,
            clearcoat: 1,
            clearcoatRoughness: 0.1
        });

        const accentMaterial = new THREE.MeshStandardMaterial({
            color: 0xc9a962,
            metalness: 0.95,
            roughness: 0.2,
            emissive: 0xc9a962,
            emissiveIntensity: 0.1
        });

        const redMaterial = new THREE.MeshStandardMaterial({
            color: 0xff3333,
            metalness: 0.8,
            roughness: 0.3,
            emissive: 0xff3333,
            emissiveIntensity: 0.3
        });

        // Main Camera Body
        const bodyGeometry = new THREE.BoxGeometry(2.2, 1.4, 1.2);
        bodyGeometry.translate(0, 0, 0);
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        cameraGroup.add(body);

        // Body details - chamfered edges simulation
        const bodyTopGeometry = new THREE.BoxGeometry(2.0, 0.1, 1.0);
        const bodyTop = new THREE.Mesh(bodyTopGeometry, bodyMaterial);
        bodyTop.position.set(0, 0.75, 0);
        cameraGroup.add(bodyTop);

        // Grip
        const gripGeometry = new THREE.BoxGeometry(0.5, 1.5, 1.3);
        const grip = new THREE.Mesh(gripGeometry, bodyMaterial);
        grip.position.set(1.3, 0, 0);
        cameraGroup.add(grip);

        // Grip texture lines
        for (let i = 0; i < 8; i++) {
            const lineGeometry = new THREE.BoxGeometry(0.02, 0.1, 1.25);
            const line = new THREE.Mesh(lineGeometry, new THREE.MeshBasicMaterial({ color: 0x0a0a0a }));
            line.position.set(1.52, -0.5 + i * 0.14, 0);
            cameraGroup.add(line);
        }

        // Lens Mount Ring
        const mountGeometry = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 48);
        const mount = new THREE.Mesh(mountGeometry, bodyMaterial);
        mount.rotation.x = Math.PI / 2;
        mount.position.set(0, 0, 0.65);
        cameraGroup.add(mount);

        // Inner mount ring
        const innerMountGeometry = new THREE.RingGeometry(0.35, 0.52, 48);
        const innerMount = new THREE.Mesh(innerMountGeometry, accentMaterial);
        innerMount.position.set(0, 0, 0.73);
        cameraGroup.add(innerMount);

        // Main Lens Barrel
        const lensBarrel1Geometry = new THREE.CylinderGeometry(0.52, 0.58, 1.0, 48);
        const lensBarrel1 = new THREE.Mesh(lensBarrel1Geometry, lensMaterial);
        lensBarrel1.rotation.x = Math.PI / 2;
        lensBarrel1.position.set(0, 0, 1.2);
        cameraGroup.add(lensBarrel1);

        // Focus Ring
        const focusRingGeometry = new THREE.CylinderGeometry(0.56, 0.56, 0.2, 48);
        const focusRing = new THREE.Mesh(focusRingGeometry, accentMaterial);
        focusRing.rotation.x = Math.PI / 2;
        focusRing.position.set(0, 0, 0.9);
        cameraGroup.add(focusRing);

        // Focus ring grip texture
        for (let i = 0; i < 36; i++) {
            const notchGeometry = new THREE.BoxGeometry(0.015, 0.02, 0.18);
            const notch = new THREE.Mesh(notchGeometry, new THREE.MeshBasicMaterial({ color: 0x8b7355 }));
            const angle = (i / 36) * Math.PI * 2;
            notch.position.set(Math.cos(angle) * 0.57, Math.sin(angle) * 0.57, 0.9);
            notch.rotation.z = angle;
            cameraGroup.add(notch);
        }

        // Second Lens Barrel
        const lensBarrel2Geometry = new THREE.CylinderGeometry(0.48, 0.52, 0.4, 48);
        const lensBarrel2 = new THREE.Mesh(lensBarrel2Geometry, lensMaterial);
        lensBarrel2.rotation.x = Math.PI / 2;
        lensBarrel2.position.set(0, 0, 1.9);
        cameraGroup.add(lensBarrel2);

        // Lens Hood
        const hoodGeometry = new THREE.CylinderGeometry(0.55, 0.48, 0.35, 48);
        const hood = new THREE.Mesh(hoodGeometry, lensMaterial);
        hood.rotation.x = Math.PI / 2;
        hood.position.set(0, 0, 2.25);
        cameraGroup.add(hood);

        // Front Glass Element
        const glassGeometry = new THREE.CircleGeometry(0.42, 48);
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.position.set(0, 0, 2.43);
        cameraGroup.add(glass);

        // Inner lens elements (visible through glass)
        for (let i = 0; i < 4; i++) {
            const ringGeometry = new THREE.RingGeometry(0.1 + i * 0.08, 0.13 + i * 0.08, 48);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0x0a1020,
                transparent: true,
                opacity: 0.6 - i * 0.1
            });
            const ring = new THREE.Mesh(ringGeometry, ringMat);
            ring.position.set(0, 0, 2.4 - i * 0.02);
            cameraGroup.add(ring);
        }

        // Viewfinder
        const viewfinderBaseGeometry = new THREE.BoxGeometry(0.5, 0.45, 0.4);
        const viewfinderBase = new THREE.Mesh(viewfinderBaseGeometry, bodyMaterial);
        viewfinderBase.position.set(-0.4, 0.9, -0.1);
        cameraGroup.add(viewfinderBase);

        const eyepieceGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.15, 24);
        const eyepiece = new THREE.Mesh(eyepieceGeometry, lensMaterial);
        eyepiece.rotation.x = Math.PI / 2;
        eyepiece.position.set(-0.4, 0.9, -0.35);
        cameraGroup.add(eyepiece);

        // Top Handle Mount
        const handleMountGeometry = new THREE.BoxGeometry(0.8, 0.08, 0.3);
        const handleMount = new THREE.Mesh(handleMountGeometry, bodyMaterial);
        handleMount.position.set(0.3, 0.78, 0);
        cameraGroup.add(handleMount);

        // Hot Shoe
        const hotShoeGeometry = new THREE.BoxGeometry(0.35, 0.05, 0.25);
        const hotShoe = new THREE.Mesh(hotShoeGeometry, accentMaterial);
        hotShoe.position.set(0.3, 0.82, 0);
        cameraGroup.add(hotShoe);

        // Record Button
        const recordBtnGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 24);
        const recordBtn = new THREE.Mesh(recordBtnGeometry, redMaterial);
        recordBtn.position.set(1.0, 0.78, 0.4);
        cameraGroup.add(recordBtn);

        // Mode Dial
        const dialGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 32);
        const dial = new THREE.Mesh(dialGeometry, accentMaterial);
        dial.position.set(0.7, 0.85, -0.2);
        cameraGroup.add(dial);

        // Dial markings
        for (let i = 0; i < 8; i++) {
            const markGeometry = new THREE.BoxGeometry(0.02, 0.03, 0.06);
            const mark = new THREE.Mesh(markGeometry, new THREE.MeshBasicMaterial({ color: 0x1a1a1a }));
            const angle = (i / 8) * Math.PI * 2;
            mark.position.set(0.7 + Math.cos(angle) * 0.12, 0.92, -0.2 + Math.sin(angle) * 0.12);
            cameraGroup.add(mark);
        }

        // Back Screen
        const screenBorderGeometry = new THREE.BoxGeometry(1.4, 0.95, 0.08);
        const screenBorder = new THREE.Mesh(screenBorderGeometry, bodyMaterial);
        screenBorder.position.set(0, 0, -0.64);
        cameraGroup.add(screenBorder);

        const screenGeometry = new THREE.PlaneGeometry(1.2, 0.75);
        const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.rotation.y = Math.PI;
        screen.position.set(0, 0, -0.69);
        cameraGroup.add(screen);

        // Side ports cover
        const portCoverGeometry = new THREE.BoxGeometry(0.08, 0.4, 0.5);
        const portCover = new THREE.Mesh(portCoverGeometry, bodyMaterial);
        portCover.position.set(-1.14, -0.2, 0);
        cameraGroup.add(portCover);

        // Position camera model
        cameraGroup.position.set(0, 0, 0);
        cameraGroup.rotation.set(0.15, -0.4, 0.05);
        scene.add(cameraGroup);

        // Floating particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 100;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
            posArray[i] = (Math.random() - 0.5) * 15;
            posArray[i + 1] = (Math.random() - 0.5) * 15;
            posArray[i + 2] = (Math.random() - 0.5) * 15;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0xc9a962,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Mouse tracking
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });

        // Animation
        let time = 0;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.003;

            // Smooth mouse following
            targetX += (mouseX * 0.15 - targetX) * 0.03;
            targetY += (mouseY * 0.1 - targetY) * 0.03;

            // Camera rotation
            cameraGroup.rotation.y = -0.4 + Math.sin(time * 0.5) * 0.1 + targetX;
            cameraGroup.rotation.x = 0.15 + Math.cos(time * 0.3) * 0.05 - targetY;
            cameraGroup.rotation.z = Math.sin(time * 0.4) * 0.02;

            // Floating effect
            cameraGroup.position.y = Math.sin(time * 0.6) * 0.1;

            // Particles rotation
            particles.rotation.y = time * 0.1;
            particles.rotation.x = time * 0.05;

            // Accent light animation
            accentLight.intensity = 0.6 + Math.sin(time * 2) * 0.2;

            renderer.render(scene, camera);
        }

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    }

    // ============================================
    // CTA CANVAS ANIMATION
    // ============================================
    function initCtaCanvas() {
        const canvas = document.getElementById('ctaCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 169, 98, ${this.opacity})`;
                ctx.fill();
            }
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(201, 169, 98, ${0.1 * (1 - dist / 150)})`;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        }

        init();
        animate();

        window.addEventListener('resize', init);
    }

    // ============================================
    // CONTACT CANVAS
    // ============================================
    function initContactCanvas() {
        const canvas = document.getElementById('contactCanvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create floating geometric shapes
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshBasicMaterial({
            color: 0xc9a962,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });

        const shapes = [];
        for (let i = 0; i < 5; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            );
            mesh.scale.setScalar(Math.random() * 0.5 + 0.5);
            shapes.push({
                mesh,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01
                }
            });
            scene.add(mesh);
        }

        function animate() {
            requestAnimationFrame(animate);

            shapes.forEach(({ mesh, rotationSpeed }) => {
                mesh.rotation.x += rotationSpeed.x;
                mesh.rotation.y += rotationSpeed.y;
            });

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            // Fallback to IntersectionObserver
            initFallbackAnimations();
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Showreel
        const showreel = document.querySelector('.showreel-container');
        if (showreel) {
            // Add visible class immediately to ensure video shows
            showreel.classList.add('visible');
            
            gsap.fromTo(showreel, 
                {
                    opacity: 0,
                    scale: 0.95
                },
                {
                    scrollTrigger: {
                        trigger: showreel,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: 'power3.out'
                }
            );
        }

        // Service cards
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Work items
        gsap.utils.toArray('.work-item, .project-card').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                delay: (i % 3) * 0.1,
                ease: 'power3.out'
            });
        });

        // Process steps
        gsap.utils.toArray('.process-step').forEach((step, i) => {
            gsap.from(step, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'power3.out',
                onComplete: () => step.classList.add('visible')
            });
        });

        // Section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header.children, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        });

        // CTA section
        const ctaContent = document.querySelector('.cta-content');
        if (ctaContent) {
            gsap.from(ctaContent.children, {
                scrollTrigger: {
                    trigger: ctaContent,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }

        // Service detail items
        gsap.utils.toArray('.service-detail-item').forEach(item => {
            gsap.from(item.children, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        });

        // Value cards
        gsap.utils.toArray('.value-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Team members
        gsap.utils.toArray('.team-member').forEach((member, i) => {
            gsap.from(member, {
                scrollTrigger: {
                    trigger: member,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        // Timeline items
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                x: i % 2 === 0 ? -30 : 30,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Stats counter animation
        gsap.utils.toArray('.stat-number, .hero-stat-number').forEach(stat => {
            const count = parseInt(stat.dataset.count) || 0;
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(stat, {
                        innerHTML: count,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerHTML: 1 },
                        onUpdate: function() {
                            stat.innerHTML = Math.round(this.targets()[0].innerHTML);
                        }
                    });
                },
                once: true
            });
        });
    }

    function initFallbackAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.showreel-container, .service-card, .work-item, .project-card, .process-step, .value-card, .team-member, .timeline-item').forEach(el => {
            observer.observe(el);
        });
    }

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom > 0
        );
    }

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================
    function initTestimonialsSlider() {
        const slider = document.getElementById('testimonialsSlider');
        if (!slider) return;

        const testimonials = slider.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.testimonial-dot');
        const prevBtn = document.querySelector('.testimonial-nav-btn.prev');
        const nextBtn = document.querySelector('.testimonial-nav-btn.next');

        let currentIndex = 0;

        function showTestimonial(index) {
            testimonials.forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }

        prevBtn?.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
            showTestimonial(newIndex);
        });

        nextBtn?.addEventListener('click', () => {
            const newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
            showTestimonial(newIndex);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showTestimonial(index));
        });

        // Auto-advance
        setInterval(() => {
            const newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
            showTestimonial(newIndex);
        }, 6000);
    }

    // ============================================
    // WORK FILTER
    // ============================================
    function initWorkFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (!filterBtns.length || !projectCards.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = '';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ============================================
    // PROJECT CARD VIDEO HOVER
    // ============================================
    function initProjectCardHover() {
        document.querySelectorAll('.project-card, .work-item').forEach(card => {
            const video = card.querySelector('video');
            if (!video) return;

            card.addEventListener('mouseenter', () => {
                video.play().catch(() => {});
            });

            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });
    }

    // ============================================
    // FAQ ACCORDION
    // ============================================
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question?.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all
                faqItems.forEach(i => i.classList.remove('active'));
                
                // Open clicked if wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ============================================
    // CONTACT FORM (with Web3Forms Integration)
    // ============================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(form);
                
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Success - show success message
                    form.style.display = 'none';
                    if (formSuccess) formSuccess.style.display = 'flex';
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Error - show error message
                submitBtn.innerHTML = '<span>Error! Try Again</span>';
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // ============================================
    // SHOWREEL VIDEO CONTROL
    // ============================================
    function initShowreelVideo() {
        const video = document.getElementById('showreelVideo');
        const playBtn = document.getElementById('showreelPlay');
        const overlay = document.querySelector('.showreel-overlay');

        if (!video || !playBtn) return;

        playBtn.addEventListener('click', () => {
            if (video.paused) {
                video.muted = false;
                video.play();
                overlay.style.opacity = '0';
            } else {
                video.pause();
                overlay.style.opacity = '1';
            }
        });

        video.addEventListener('click', () => {
            if (!video.paused) {
                video.pause();
                video.muted = true;
                overlay.style.opacity = '1';
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // VIDEO MODAL
    // ============================================
    function initVideoModal() {
        const modal = document.getElementById('videoModal');
        if (!modal) return;

        const overlay = modal.querySelector('.video-modal-overlay');
        const closeBtn = document.getElementById('videoModalClose');
        const videoPlayer = document.getElementById('videoModalPlayer');
        const muteBtn = document.getElementById('videoMuteBtn');
        const muteText = muteBtn?.querySelector('.mute-text');

        // Work items on home page
        document.querySelectorAll('.work-item[data-video]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const videoSrc = item.dataset.video;
                openVideoModal(videoSrc);
            });
        });

        // Project cards on work page
        document.querySelectorAll('.project-card[data-video]').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const videoSrc = card.dataset.video;
                openVideoModal(videoSrc);
            });
        });

        function openVideoModal(videoSrc) {
            if (!videoPlayer || !videoSrc) return;
            
            videoPlayer.src = videoSrc;
            videoPlayer.muted = true;
            modal.classList.add('active');
            document.body.classList.add('no-scroll');
            
            videoPlayer.play().catch(err => console.log('Video play error:', err));
            
            // Reset mute button state
            if (muteBtn) {
                muteBtn.classList.remove('sound-on');
                if (muteText) muteText.textContent = 'Sound Off';
            }
        }

        function closeVideoModal() {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            videoPlayer.pause();
            videoPlayer.src = '';
        }

        // Close events
        closeBtn?.addEventListener('click', closeVideoModal);
        overlay?.addEventListener('click', closeVideoModal);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeVideoModal();
            }
        });

        // Mute/Unmute toggle
        muteBtn?.addEventListener('click', () => {
            videoPlayer.muted = !videoPlayer.muted;
            muteBtn.classList.toggle('sound-on', !videoPlayer.muted);
            if (muteText) {
                muteText.textContent = videoPlayer.muted ? 'Sound Off' : 'Sound On';
            }
        });
    }

    // ============================================
    // INITIALIZE
    // ============================================
    function init() {
        initCursor();
        initLoader();
        initNavigation();
        initPageTransitions();
        initSmoothScroll();
        initScrollAnimations();
        initTestimonialsSlider();
        initWorkFilter();
        initProjectCardHover();
        initFaqAccordion();
        initContactForm();
        initShowreelVideo();
        initVideoModal();

        // Page-specific initializations
        if (pageName === 'home') {
            initHeroScene();
            initCtaCanvas();
        }

        if (pageName === 'contact') {
            initContactCanvas();
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
