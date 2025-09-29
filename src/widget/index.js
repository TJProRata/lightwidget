import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ChatWidget2 } from '../components/ChatWidget2/ChatWidget2';
import '../components/ChatWidget2/ChatWidget2.css';

(function(window, document) {
  'use strict';

  const NAMESPACE = 'LightWidget';
  const CONVEX_URL = 'https://impartial-vulture-278.convex.cloud'; // TODO: Make this configurable

  class LightWidget {
    constructor(config) {
      this.config = {
        apiKey: config.apiKey || null,
        position: config.position || 'bottom-center',
        theme: config.theme || 'light',
        containerId: config.containerId || 'lightwidget-container',
        ...config
      };

      this.iframe = null;
      this.convexClient = null;
      this.isInitialized = false;
    }

    init() {
      if (this.isInitialized) {
        console.warn('LightWidget: Already initialized');
        return;
      }

      if (!this.config.apiKey) {
        console.error('LightWidget: API key is required');
        return;
      }

      // Create container
      let container = document.getElementById(this.config.containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = this.config.containerId;
        document.body.appendChild(container);
      }

      // Create iframe for isolation
      this.iframe = document.createElement('iframe');
      this.iframe.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        border: none;
        z-index: 2147483647;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: transparent;
      `;
      this.iframe.setAttribute('title', 'LightWidget Chat');
      this.iframe.setAttribute('id', 'lightwidget-iframe');

      container.appendChild(this.iframe);

      // Setup postMessage communication
      this.setupMessageListener();

      // Wait for iframe to load, then render widget
      this.iframe.addEventListener('load', () => {
        this.renderWidget();
      });

      // Set iframe src to trigger load (using about:blank initially)
      this.iframe.src = 'about:blank';

      this.isInitialized = true;
    }

    renderWidget() {
      const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;

      // Setup iframe document
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: transparent;
              }
              #widget-root {
                width: 100%;
                height: 100%;
              }
            </style>
          </head>
          <body>
            <div id="widget-root"></div>
          </body>
        </html>
      `);
      iframeDoc.close();

      // Initialize Convex client
      this.convexClient = new ConvexReactClient(CONVEX_URL);

      // Get the root element
      const rootElement = iframeDoc.getElementById('widget-root');

      if (!rootElement) {
        console.error('LightWidget: Could not find widget-root element');
        return;
      }

      // Render React app inside iframe
      const root = createRoot(rootElement);
      root.render(
        React.createElement(ConvexProvider, { client: this.convexClient },
          React.createElement(ChatWidget2, {
            config: this.config,
            position: this.config.position
          })
        )
      );

      // Notify parent that widget is ready
      this.sendMessage('WIDGET_READY', { config: this.config });
    }

    setupMessageListener() {
      window.addEventListener('message', (event) => {
        // Validate message source
        if (event.source !== this.iframe.contentWindow) {
          return;
        }

        // Handle messages from widget
        this.handleMessage(event.data);
      });
    }

    handleMessage(message) {
      if (!message || typeof message !== 'object') {
        return;
      }

      switch(message.type) {
        case 'WIDGET_READY':
          console.log('LightWidget: Widget ready');
          break;
        case 'RESIZE':
          this.handleResize(message.payload);
          break;
        case 'ERROR':
          console.error('LightWidget:', message.error);
          break;
        case 'QUERY_SENT':
          // Track analytics
          console.log('LightWidget: Query sent', message.payload);
          break;
        default:
          console.log('LightWidget: Unknown message type', message.type);
      }
    }

    handleResize(size) {
      if (this.iframe && size) {
        if (size.width) {
          this.iframe.style.width = size.width + 'px';
        }
        if (size.height) {
          this.iframe.style.height = size.height + 'px';
        }
      }
    }

    sendMessage(type, payload) {
      if (this.iframe && this.iframe.contentWindow) {
        this.iframe.contentWindow.postMessage({ type, payload }, '*');
      }
    }

    // Public API methods
    show() {
      if (this.iframe) {
        this.iframe.style.display = 'block';
      }
    }

    hide() {
      if (this.iframe) {
        this.iframe.style.display = 'none';
      }
    }

    destroy() {
      if (this.iframe) {
        this.iframe.remove();
        this.iframe = null;
      }
      if (this.convexClient) {
        this.convexClient.close();
        this.convexClient = null;
      }
      this.isInitialized = false;
    }

    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      // Notify widget of config change
      this.sendMessage('CONFIG_UPDATE', this.config);
    }
  }

  // Expose global API
  window[NAMESPACE] = window[NAMESPACE] || LightWidget;

  // Auto-initialize if config exists
  if (window.LightWidgetConfig) {
    const widget = new LightWidget(window.LightWidgetConfig);
    widget.init();
    window.lightWidgetInstance = widget;
  }

})(window, document);