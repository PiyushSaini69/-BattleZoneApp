import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5050';

let socket = null;

export const initiateSocketConnection = (userId) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    credentials: true
  });

  console.log('🔌 Socket connection requested...');

  socket.on('connect', () => {
    console.log(`🔌 Socket connected: ${socket.id}`);
    
    // Auto join user notifications room
    if (userId) {
      socket.emit('join:user', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
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
