import React from 'react';
import Typography from '@material-ui/core/Typography';
import Layout from './layout';
import { useLocation } from "react-router-dom"

const Admins = () => {
    const location = useLocation();
    return (
        <Layout header="Admins">
        </Layout>
    )
};

export default Admins;