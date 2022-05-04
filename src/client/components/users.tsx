import React from 'react';
import Typography from '@material-ui/core/Typography';
import Layout from './layout';
import { useLocation } from "react-router-dom"

const Users = () => {
    const location = useLocation();
    console.log(location.pathname);
    return (
        <Layout>
            <Typography variant="h4" gutterBottom>
                Users
            </Typography>
            <hr />
        </Layout>
    )
};

export default Users;