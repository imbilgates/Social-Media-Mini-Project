import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../firebase';
import ReactLoading from 'react-loading';

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const logout = async () => {
    setLoading(true);
    try {
      await delay(2000);
      await signOut(auth);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div id="log_out">
      <button className='logout-button' onClick={logout} disabled={loading}>
        {loading ? (
          <ReactLoading type={'spokes'} color={"#FF0000"} height={20} width={20} />
        ) : (
          <i className='bx bx-log-out'></i>
        )}
      </button>
    </div>
  );
};

export default Logout;
