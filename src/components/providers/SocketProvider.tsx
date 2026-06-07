'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    // If no accessToken is present (logged out), disconnect existing socket
    if (!accessToken) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://api.syncline.shakilhossain.tech';
    
    // Connect to WebSocket gateway
    const newSocket = io(socketUrl, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('⚡ WebSocket client connected successfully');
    });

    // Listen to real-time notification push events
    newSocket.on('notification:new', (notification: any) => {
      // Trigger a beautiful, rich toast notification using Sonner
      toast.info(notification.title, {
        description: notification.message,
        action: notification.link ? {
          label: 'View',
          onClick: () => router.push(notification.link),
        } : undefined,
        duration: 6000,
      });

      // Invalidate queries to instantly update counts and listing views
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    setSocket(newSocket);

    // Clean up connections on unmount/token change
    return () => {
      newSocket.disconnect();
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
