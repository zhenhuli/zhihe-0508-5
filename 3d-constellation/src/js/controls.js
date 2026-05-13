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