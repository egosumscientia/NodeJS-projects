import React, {Fragment, useState} from 'react';
import { Button, TextField, Grid, Container } from '@material-ui/core';
import { Colors } from '../../../shared/styles/Colors';
import ApiBaseUrl from '../../../shared/utils/Api.js'

const LoginPage = () =>{
    
    const colors = Colors();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    
    const login = async () => {

        if(email){
            const userData = {
                email:email,
                password:password
            }
            try{
                const response = await fetch(`${ApiBaseUrl}/login`,{
                    method:'POST',
                    body:JSON.stringify(userData),
                    header:{
                        'Content-Type':'application/json'
                    }
                });
                const user = await response.json()
                console.log(user);
            }catch(e){
                console.log(e);
            }
        }else{
            console.log("email is required");
        } 
    }

    return(
        <Fragment>
            <Container maxWidth='sm'>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField id="outlined-basic" onChange={(e)=>setEmail(e.target.value)} value={email} label="Email" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="outlined-basic" onChange={(e)=>setPassword(e.target.value)} value={password} label="Password" type="password" variant="outlined" />
                    </Grid>
                </Grid>
                <Button variant="contained" onClick={login} className={colors.btnPrimary}>LOG IN</Button>
            </Container>  
        </Fragment>
    ) 
}

export default LoginPage;