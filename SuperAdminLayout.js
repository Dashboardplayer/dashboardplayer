// SuperAdminLayout.js
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

function SuperAdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { profile } = useUser();

  // Force redirect if not superadmin
  useEffect(() => {
    if (profile && profile.role !== 'superadmin') {
      // If user is not superadmin, push them to company dashboard
      navigate('/company-dashboard');
    }
  }, [profile, navigate]);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {/* Only show superadmin links if role is superadmin */}
        {profile?.role === 'superadmin' && (
          <>
            <ListItem button onClick={() => { navigate('/superadmin-dashboard'); setOpen(false); }}>
              <ListItemText primary="Superuser Panel" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/create-user'); setOpen(false); }}>
              <ListItemText primary="Nieuwe Account" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/company-dashboard'); setOpen(false); }}>
              <ListItemText primary="Bedrijven/Players" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleToggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {profile?.role === 'superadmin' ? 'Superadmin Dashboard' : 'Bedrijfsdashboard'}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleToggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

export default SuperAdminLayout;
