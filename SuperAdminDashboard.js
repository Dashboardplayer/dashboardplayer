// SuperAdminDashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import SuperAdminLayout from './SuperAdminLayout';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

function SuperAdminDashboard() {
  const [players, setPlayers] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [companies, setCompanies] = useState({}); // Per player: player.id -> company_id
  const [companyOptions, setCompanyOptions] = useState([]);

  // Haal alle players op
  const fetchPlayers = useCallback(async () => {
    const { data, error } = await supabase.from('players').select('*');
    if (error) {
      console.error('Error fetching players:', error);
    } else {
      setPlayers(data);
      const compObj = {};
      data.forEach((player) => {
        compObj[player.id] = player.company_id || '';
      });
      setCompanies(compObj);
    }
  }, []);

  // Haal bedrijven op voor de dropdown
  const fetchCompanyOptions = async () => {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanyOptions(data);
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchCompanyOptions();
    const subscription = supabase
      .channel('players')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        () => fetchPlayers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchPlayers]);

  const updatePlayerUrl = async (playerId) => {
    const { error } = await supabase
      .from('players')
      .update({ current_url: newUrl })
      .eq('id', playerId);
    if (error) console.error('Error updating URL:', error);
  };

  const updatePlayerCompany = async (playerId) => {
    const company_id = companies[playerId];
    const { error } = await supabase
      .from('players')
      .update({ company_id })
      .eq('id', playerId);
    if (error) console.error('Error updating company:', error);
  };

  return (
    <SuperAdminLayout>
      <Typography variant="h4" gutterBottom>
        Welkom, Superadmin!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Beheer hier alle players en koppel ze aan bedrijven.
      </Typography>

      {players.map((player) => (
        <Card key={player.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Player ID: {player.device_id}</Typography>
            <Typography variant="body2">Huidige URL: {player.current_url}</Typography>
            <Typography variant="body2">
              Online: {player.is_online ? 'Ja' : 'Nee'}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <TextField
                label="Nieuwe URL"
                size="small"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button variant="contained" onClick={() => updatePlayerUrl(player.id)}>
                Update URL
              </Button>
            </Box>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id={`company-select-label-${player.id}`}>Bedrijf</InputLabel>
                <Select
                  labelId={`company-select-label-${player.id}`}
                  value={companies[player.id] || ''}
                  label="Bedrijf"
                  onChange={(e) => {
                    setCompanies({ ...companies, [player.id]: e.target.value });
                  }}
                >
                  {companyOptions.map((company) => (
                    <MenuItem key={company.id} value={company.company_id}>
                      {company.company_name} ({company.company_id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={() => updatePlayerCompany(player.id)}>
                Update Bedrijf
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </SuperAdminLayout>
  );
}

export default SuperAdminDashboard;
