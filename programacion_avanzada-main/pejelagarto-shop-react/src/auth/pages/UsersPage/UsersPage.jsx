import React, {useEffect,useState} from 'react';
import apiBaseUrl from '../../../shared/utils/Api';
import {Card, CardActions, CardContent, Container, Grid, Typography, Button} from '@material-ui/core';

const UsersPage = () => {
    
    const [users, setUsers] = useState([])

    const generateItems = (data) => {
        return data.map((item) => {
            return(
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography>
                                {item.email}
                            </Typography>
                            <Typography>
                                {item.shop}
                            </Typography>
                        </CardContent>
                        <CardActions>
                        <Button variant="contained" color="primary">Cick Me</Button>
                        </CardActions>
                    </Card>
                </Grid>
            ) 
        })
    }

    const getUsers = async () => {
        const response = await fetch(`${apiBaseUrl}/get-users`);
        const responseJSON = await response.json();
        setUsers(generateItems(responseJSON.data));
        console.log(responseJSON);
    }
    
    useEffect(()=>{
        getUsers();
    },[])

    return (
        <Container maxWidth='sm'>
            <Grid container>
                {users}
            </Grid>
        </Container>    
    )
}

export default UsersPage
