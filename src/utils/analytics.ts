// Configuración y utilidades de Google Analytics

const GA_TRACKING_ID = 'G-DQZDW6TNY6';

// Inicializar Google Analytics
export const initGA = () => {
  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID);
};

// Seguimiento de páginas vistas
export const trackPageView = (path: string) => {
  if (window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path,
    });
  }
};

// Seguimiento de eventos personalizados
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Tipos para TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}