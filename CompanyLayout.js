// CompanyLayout.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

function CompanyLayout({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { profile } = useUser();

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
        <ListItem button onClick={() => { navigate('/company-dashboard'); setOpen(false); }}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {/* Hier kun je extra routes toevoegen voor bedrijfsadmins */}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Bovenbalk */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleToggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bedrijfsdashboard {profile?.company_id ? `- ${profile.company_id}` : ''}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Zijbalk */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleToggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      {/* Hoofdcontent */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}

export default CompanyLayout;
