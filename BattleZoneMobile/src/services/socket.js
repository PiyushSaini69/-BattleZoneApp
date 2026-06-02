import { io } from 'socket.io-client';
import { CONFIG } from '../config';

let socket = null;

export const initiateSocketConnection = (userId) => {
  if (socket) return socket;

  socket = io(CONFIG.SOCKET_URL, {
    transports: ['websocket'],
    credentials: true
  });

  console.log('🔌 Mobile Socket connection requested...');

  socket.on('connect', () => {
    console.log(`🔌 Mobile Socket connected: ${socket.id}`);
    
    // Auto join user notifications room
    if (userId) {
      socket.emit('join:user', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Mobile Socket disconnected');
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
