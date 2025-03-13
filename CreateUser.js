// CreateUser.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, MenuItem } from '@mui/material';

function CreateUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('bedrijfsadmin'); // Alleen bedrijfsadmin of user
  const [companyId, setCompanyId] = useState('');
  const navigate = useNavigate();

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert('Account creation failed: ' + error.message);
      return;
    }

    const user = data.user;
    if (!user) {
      alert('No user returned from signUp');
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: user.id, role, company_id: companyId }]);

    if (profileError) {
      alert('Profile creation failed: ' + profileError.message);
    } else {
      alert('Account created successfully!');
      navigate('/superadmin-dashboard');
    }
  };

  return (
    <Box sx={{ maxWidth: '400px', margin: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>Maak nieuw account aan</Typography>
      <form onSubmit={handleCreateUser}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Rol"
          select
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="bedrijfsadmin">Bedrijfsadmin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </TextField>
        <TextField
          label="Bedrijfs ID (optioneel)"
          fullWidth
          margin="normal"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Maak account aan
        </Button>
      </form>
    </Box>
  );
}

export default CreateUser;
