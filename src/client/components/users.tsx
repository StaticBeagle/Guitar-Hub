import React from 'react';
import Typography from '@material-ui/core/Typography';
import Layout from './layout';
import { useLocation } from "react-router-dom"

const Users = () => {
    const location = useLocation();
    return (
        <Layout header="Users">
        </Layout>
    )
};

export default Users;