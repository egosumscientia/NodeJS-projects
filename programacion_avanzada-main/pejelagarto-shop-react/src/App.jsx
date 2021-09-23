import React from 'react';
import { Button, Grid, makeStyles } from '@material-ui/core';
import {Colors} from './shared/styles/Colors';
function App() {
  const colors = Colors();
  const {primary, btnDanger, btnPrimary} = colors;

  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          <Button variant="contained" className={btnPrimary}>Login</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="primary">Login</Button>
        </Grid>
      </Grid>

    </div>
  );
}

export default App;
