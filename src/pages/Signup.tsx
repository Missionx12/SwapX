import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setError(error.message);
    navigate('/login');
  };

  return null;
}
