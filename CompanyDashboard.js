// CompanyDashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useUser } from './UserContext';

function CompanyDashboard() {
  const [players, setPlayers] = useState([]);
  const { profile } = useUser();

  const fetchCompanyPlayers = useCallback(async () => {
    if (!profile || !profile.company_id) {
      setPlayers([]);
      return;
    }
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('company_id', profile.company_id);
    if (error) console.error('Error fetching company players:', error);
    else setPlayers(data);
  }, [profile]);

  useEffect(() => {
    fetchCompanyPlayers();
  }, [fetchCompanyPlayers]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Bedrijfsdashboard</Typography>
      <Typography variant="body1" gutterBottom>
        Overzicht van jouw spelers:
      </Typography>
      {players.length > 0 ? (
        players.map((player) => (
          <Card key={player.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{player.device_id}</Typography>
              <Typography variant="body2">Huidige URL: {player.current_url}</Typography>
              <Typography variant="body2">
                Online: {player.is_online ? 'Ja' : 'Nee'}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2">Geen spelers gevonden voor dit bedrijf.</Typography>
      )}
    </Box>
  );
}

export default CompanyDashboard;
