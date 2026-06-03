import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { initiateSocketConnection, disconnectSocket } from '../services/socket';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const conn = initiateSocketConnection(user.id);
      setSocket(conn);
    } else {
      disconnectSocket();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
