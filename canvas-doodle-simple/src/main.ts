import { DoodleApp } from './DoodleApp';

function initApp(): void {
  const container = document.getElementById('app');
  if (!container) {
    console.error('App container not found');
    return;
  }
  
  const app = new DoodleApp(container as HTMLDivElement);
  
  window.addEventListener('beforeunload', () => {
    app.destroy();
  });
}

document.addEventListener('DOMContentLoaded', initApp);
