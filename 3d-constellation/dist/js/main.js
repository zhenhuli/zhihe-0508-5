class ConstellationApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.sceneRenderer = null;
    this.controls = null;
    this.animationId = null;
  }

  init() {
    this.sceneRenderer = new SceneRenderer(this.container);
    this.sceneRenderer.init();

    this.controls = new OrbitControls(
      this.sceneRenderer.getCamera(),
      this.container
    );

    this.container.style.cursor = 'grab';

    this.animate();
  }

  animate(time = 0) {
    this.animationId = requestAnimationFrame((t) => this.animate(t));
    this.sceneRenderer.render(time);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.sceneRenderer && this.sceneRenderer.renderer) {
      this.sceneRenderer.renderer.dispose();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new ConstellationApp();
  app.init();
  window.constellationApp = app;
});
class OrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    
    this.target = new THREE.Vector3(0, 0, 0);
    this.spherical = new THREE.Spherical();
    this.sphericalDelta = new THREE.Spherical();
    this.scale = 1;
    
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    
    this.rotateSpeed = 0.005;
    this.zoomSpeed = 0.1;
    this.minDistance = 5;
    this.maxDistance = 50;
    
    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI;
    
    this.initEvents();
    this.updateCameraPosition();
  }

  initEvents() {
    this.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.domElement.addEventListener('mouseup', () => this.onMouseUp());
    this.domElement.addEventListener('mouseleave', () => this.onMouseUp());
    this.domElement.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    
    this.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
    this.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.domElement.addEventListener('touchend', () => this.onTouchEnd());
  }

  onMouseDown(event) {
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    this.domElement.style.cursor = 'grabbing';
  }

  onMouseMove(event) {
    if (!this.isDragging) return;
    
    const deltaX = event.clientX - this.previousMousePosition.x;
    const deltaY = event.clientY - this.previousMousePosition.y;
    
    this.sphericalDelta.theta -= deltaX * this.rotateSpeed;
    this.sphericalDelta.phi -= deltaY * this.rotateSpeed;
    
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    this.updateCameraPosition();
  }

  onMouseUp() {
    this.isDragging = false;
    this.domElement.style.cursor = 'grab';
  }

  onWheel(event) {
    event.preventDefault();
    
    if (event.deltaY < 0) {
      this.scale *= (1 - this.zoomSpeed);
    } else {
      this.scale *= (1 + this.zoomSpeed);
    }
    
    this.updateCameraPosition();
  }

  onTouchStart(event) {
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
  }

  onTouchMove(event) {
    if (!this.isDragging || event.touches.length !== 1) return;
    
    event.preventDefault();
    
    const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
    const deltaY = event.touches[0].clientY - this.previousMousePosition.y;
    
    this.sphericalDelta.theta -= deltaX * this.rotateSpeed * 2;
    this.sphericalDelta.phi -= deltaY * this.rotateSpeed * 2;
    
    this.previousMousePosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
    
    this.updateCameraPosition();
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  updateCameraPosition() {
    const offset = new THREE.Vector3();
    
    this.spherical.radius = this.clamp(
      this.spherical.radius * this.scale,
      this.minDistance,
      this.maxDistance
    );
    
    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;
    
    this.spherical.phi = this.clamp(
      this.spherical.phi,
      this.minPolarAngle,
      this.maxPolarAngle
    );
    
    this.spherical.makeSafe();
    
    offset.setFromSpherical(this.spherical);
    offset.add(this.target);
    
    this.camera.position.copy(offset);
    this.camera.lookAt(this.target);
    
    this.sphericalDelta.set(0, 0, 0);
    this.scale = 1;
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  setTarget(x, y, z) {
    this.target.set(x, y, z);
    this.updateCameraPosition();
  }

  reset() {
    this.spherical.set(12, Math.PI / 2, 0);
    this.target.set(0, 0, 0);
    this.updateCameraPosition();
  }
}

window.OrbitControls = OrbitControls;
class SceneRenderer {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.stars = [];
    this.constellationLines = [];
    this.planets = [];
    this.isAnimating = false;
    
    this.constellations = this.createConstellationData();
  }

  createConstellationData() {
    return {
      bigDipper: {
        name: '北斗七星',
        desc: '大熊座的一部分，由七颗明亮的恒星组成',
        stars: [
          { x: -3, y: 2, z: 0, size: 0.15, name: '天枢' },
          { x: -2, y: 1.5, z: 0, size: 0.12, name: '天璇' },
          { x: -1, y: 1.8, z: 0, size: 0.13, name: '天玑' },
          { x: 0, y: 1.5, z: 0, size: 0.14, name: '天权' },
          { x: 1, y: 2, z: 0, size: 0.16, name: '玉衡' },
          { x: 2, y: 2.5, z: 0.5, size: 0.12, name: '开阳' },
          { x: 3, y: 3, z: 1, size: 0.18, name: '摇光' }
        ],
        connections: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
        ]
      }
    };
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLights();
    this.createBackgroundStars();
    this.createConstellation('bigDipper');
    this.createPlanets();
    
    window.addEventListener('resize', () => this.onResize());
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000011);
    this.scene.fog = new THREE.Fog(0x000011, 30, 100);
  }

  createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 12);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x4488ff, 0.5, 50);
    blueLight.position.set(-10, -5, 5);
    this.scene.add(blueLight);
  }

  createBackgroundStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const colorChoice = Math.random();
      if (colorChoice > 0.9) {
        colors[i3] = 1;
        colors[i3 + 1] = 0.8;
        colors[i3 + 2] = 0.6;
      } else if (colorChoice > 0.8) {
        colors[i3] = 0.8;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 1;
      } else {
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      }

      sizes[i] = Math.random() * 0.5 + 0.1;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    this.backgroundStars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.backgroundStars);
  }

  createConstellation(constellationKey) {
    const data = this.constellations[constellationKey];
    if (!data) return;

    const starGroup = new THREE.Group();
    const lineGroup = new THREE.Group();

    data.stars.forEach((starData, index) => {
      const starGeometry = new THREE.SphereGeometry(starData.size, 32, 32);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffaa,
        transparent: true,
        opacity: 0.9
      });
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(starData.x, starData.y, starData.z);
      star.userData = { name: starData.name, index };
      starGroup.add(star);

      const glowGeometry = new THREE.SphereGeometry(starData.size * 2, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffaa,
        transparent: true,
        opacity: 0.2
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(star.position);
      starGroup.add(glow);

      this.stars.push(star);
    });

    data.connections.forEach(([start, end]) => {
      const startStar = data.stars[start];
      const endStar = data.stars[end];
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(startStar.x, startStar.y, startStar.z),
        new THREE.Vector3(endStar.x, endStar.y, endStar.z)
      ]);
      
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x66aaff,
        transparent: true,
        opacity: 0.6
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      lineGroup.add(line);
      this.constellationLines.push(line);
    });

    this.scene.add(starGroup);
    this.scene.add(lineGroup);
    this.constellationGroup = starGroup;
  }

  createPlanets() {
    const planetData = [
      { x: 5, y: 0, z: 2, size: 0.3, color: 0xff6644, speed: 0.002, orbitRadius: 5 },
      { x: -4, y: 3, z: -1, size: 0.25, color: 0x44aaff, speed: 0.003, orbitRadius: 4 },
      { x: 0, y: -4, z: 3, size: 0.2, color: 0x88ff44, speed: 0.0025, orbitRadius: 3.5 }
    ];

    planetData.forEach((data, index) => {
      const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        shininess: 100,
        emissive: data.color,
        emissiveIntensity: 0.3
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.set(data.x, data.y, data.z);
      planet.userData = { 
        angle: Math.random() * Math.PI * 2,
        speed: data.speed,
        orbitRadius: data.orbitRadius,
        baseY: data.y
      };
      this.scene.add(planet);
      this.planets.push(planet);

      const ringGeometry = new THREE.RingGeometry(data.size * 1.5, data.size * 2, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(planet.position);
      ring.rotation.x = Math.PI / 3;
      this.scene.add(ring);
      planet.userData.ring = ring;

      const orbitGeometry = new THREE.TorusGeometry(data.orbitRadius, 0.02, 16, 100);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.2
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      orbit.position.y = data.y;
      this.scene.add(orbit);
    });
  }

  animatePlanets(time) {
    this.planets.forEach(planet => {
      const { angle, speed, orbitRadius, baseY, ring } = planet.userData;
      
      planet.userData.angle += speed;
      const newAngle = planet.userData.angle;
      
      planet.position.x = Math.cos(newAngle) * orbitRadius;
      planet.position.z = Math.sin(newAngle) * orbitRadius;
      planet.position.y = baseY + Math.sin(newAngle * 2) * 0.5;
      
      planet.rotation.y += 0.01;
      
      if (ring) {
        ring.position.copy(planet.position);
        ring.rotation.z += 0.005;
      }
    });
  }

  animateStars(time) {
    this.stars.forEach((star, index) => {
      star.scale.setScalar(1 + Math.sin(time * 0.002 + index) * 0.1);
    });
  }

  render(time) {
    this.animatePlanets(time);
    this.animateStars(time);
    
    if (this.backgroundStars) {
      this.backgroundStars.rotation.y += 0.0001;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }

  getCamera() {
    return this.camera;
  }

  getScene() {
    return this.scene;
  }
}

window.SceneRenderer = SceneRenderer;