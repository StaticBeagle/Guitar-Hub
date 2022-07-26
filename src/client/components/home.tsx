import React from 'react';
import Layout from './layout';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../components/tab-panel';
import AdminRadii from './admin-radii';
import AdminWoods from './admin-woods';
import AdminFrets from './admin-frets';

const Home = () => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Layout header="Home">
            <Paper square>
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    aria-label="disabled tabs example"
                >
                    <Tab label="Radii" />
                    <Tab label="Woods" />
                    <Tab label="Scales" />
                    <Tab label="Frets" />
                </Tabs>
            </Paper>
            <TabPanel value={value} index={0}>
                <AdminRadii />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AdminWoods />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <AdminWoods />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <AdminFrets />
            </TabPanel>
        </Layout>
    )
};

export default Home;