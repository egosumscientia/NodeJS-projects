import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Grid } from '@material-ui/core';

function App() {
  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
        <Button variant="contained" color='secondary'>ENTER</Button>
        </ Grid>
        <Grid item xs={6}>
        <Button variant="contained" color='primary'>EXIT</Button>
        </ Grid>
      </Grid>
    </div>
  );
}

export default App;
