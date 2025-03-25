import { useEffect, useRef } from "react";

const useWebsocket = (url: string, onMessage: (data: any) => void) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectIntervalRef = useRef<number>(1000);
  const maxReconnectInterval = 30000;

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectIntervalRef.current = 1000;
      };

      ws.onmessage = (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          onMessage(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;

        setTimeout(connect, reconnectIntervalRef.current);
        reconnectIntervalRef.current = Math.min(
          reconnectIntervalRef.current * 2,
          maxReconnectInterval
        );
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };
    };
    connect();
    return () => {
      isMounted = false;
      wsRef.current?.close();
    };
  }, [url]);

  return wsRef;
};
export default useWebsocket;
