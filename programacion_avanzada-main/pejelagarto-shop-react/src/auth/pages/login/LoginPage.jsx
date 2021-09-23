import React from 'react';
import {Button} from '@material-ui/core';
import { Colors } from '../../../shared/styles/Colors';
import loginStyles from './LoginStyles';
import loginStyles from './LoginStyles';
const LoginPage = () =>{
    const colors = Colors();
    const loginStyles = loginStyles();
    return <div>
        <Button variant="contained" className={colors.btnPrimary}>Boton prueba</Button>
        <div className={loginStyles.containerNews}></div>
    </div>
}

export default LoginPage;