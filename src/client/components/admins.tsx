import React from 'react';
import Typography from '@material-ui/core/Typography';
import Layout from './layout';
import { useLocation } from "react-router-dom"

const Admins = () => {
    const location = useLocation();
    return (
        <Layout>
            <Typography variant="h4" gutterBottom>
                Admins
            </Typography>
            <hr />
        </Layout>
    )
};

export default Admins;