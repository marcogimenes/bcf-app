import { WS_URL } from '../constants/env';

class WebSocketService {
  constructor(contexto, codigoPosto, timeReconnect = 15000, onMessage, onClose, onError) {
    this.timeReconnect = timeReconnect;
    this.reconnectTimerRef = null;
    this.onMessageCallback = onMessage;
    this.onCloseCallback = onClose;
    this.onErrorCallback = onError;
    this.ws = null;
    this.contexto = contexto;
    this.codigoPosto = codigoPosto;

    this.connectWebSocket();
  }

  connectWebSocket() {
    this.clearReconnectTimeoutWS();

    // eslint-disable-next-line no-undef
    this.ws = new WebSocket(`${WS_URL}/${this.contexto}/${this.codigoPosto}`);

    this.ws.onmessage = (event) => this.onMessageCallback(event);
    this.ws.onerror = (event) => this.onErrorCallback(event);
    this.ws.onclose = (event) => {
      this.onCloseCallback(event);

      if (event.code !== 1000) {
        this.reconnectTimerRef = setTimeout(() => {
          this.connectWebSocket();
        }, this.timeReconnect);
      }
    };
  }

  clearReconnectTimeoutWS() {
    if (this.reconnectTimerRef) {
      clearTimeout(this.reconnectTimerRef);
      this.reconnectTimerRef = null;
    }
  }

  disconnect() {
    this.clearReconnectTimeoutWS();
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketService;
