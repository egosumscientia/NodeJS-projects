import React from 'react';
import { Button, Grid } from '@material-ui/core';
import {Colors} from './shared/styles/Colors';

function App() {
  const colors = Colors();
  const {btnDanger, btnPrimary} = colors;

  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          <Button variant="contained" className={btnPrimary}>Login</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" className={btnDanger}>Login</Button>
        </Grid>
      </Grid>

    </div>
  );
}

export default App;
