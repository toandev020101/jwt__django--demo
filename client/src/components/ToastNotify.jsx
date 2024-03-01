import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const ToastNotify = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.notify) {
      const { notify } = location.state;
      toast[notify.type](notify.message, notify.options);

      const newLocationState = { ...location.state };
      delete newLocationState.notify;
      location.state = newLocationState;
    }
  }, [location]);

  return <ToastContainer />;
};

export default ToastNotify;