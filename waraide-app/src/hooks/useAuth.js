import { useState, useEffect } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // placeholder: check auth
  }, []);
  return { user, setUser };
}
