import { useEffect, useRef, useState } from "react";

const useWebsocket = (url: string, onMessage: (data: any) => void) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnectionOpen, setIsConnectionOpen] = useState(false);
  const reconnectIntervalRef = useRef<number>(1000);
  const maxReconnectInterval = 30000;

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectIntervalRef.current = 1000;
        setIsConnectionOpen(true);
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
        setIsConnectionOpen(false);
        if (!isMounted) return;

        setTimeout(connect, reconnectIntervalRef.current);
        reconnectIntervalRef.current = Math.min(
          reconnectIntervalRef.current * 2,
          maxReconnectInterval
        );
      };

      ws.onerror = (err) => {
        setIsConnectionOpen(false);
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

  const sendMessage = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not open. Cannot send message.");
    }
  };

  return { wsRef, isConnectionOpen, sendMessage };
};
export default useWebsocket;
