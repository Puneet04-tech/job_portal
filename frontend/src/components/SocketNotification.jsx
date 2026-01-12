import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initSocket, disconnectSocket, getSocket } from '../utils/socket';
import { toast } from 'react-toastify';

const SocketNotification = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      // Initialize socket connection
      const socket = initSocket(user._id);

      // Listen for hiring notifications
      socket.on('hiringNotification', (data) => {
        // Check if this notification is for the current user
        if (data.freelancerId === user._id) {
          toast.success(data.message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Optional: Play a sound or show a browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('GigFlow - You Got Hired! 🎉', {
              body: data.message,
              icon: '/vite.svg',
            });
          }
        }
      });

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      return () => {
        disconnectSocket();
      };
    }
  }, [isAuthenticated, user]);

  return null;
};

export default SocketNotification;
