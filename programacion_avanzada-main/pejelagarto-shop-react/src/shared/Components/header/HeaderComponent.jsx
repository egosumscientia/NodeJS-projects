import * as React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {AppBar, Toolbar, IconButton, Link} from '@material-ui/core';

export const HeaderComponent = () => {
    return (
        <AppBar position="static">
        <Toolbar>
            <IconButton
            edge="start"
            color="inherit"
            >
            </IconButton>
            <Link color='inherit' component={RouterLink} to='/login'>Login</Link>
            <Link color='inherit' component={RouterLink} to='/register'>Register</Link>
        </Toolbar>
        </AppBar>
    )
}

