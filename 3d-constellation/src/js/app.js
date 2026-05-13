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