import React from 'react';
import Layout from './layout';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../components/tab-panel';
import AdminRadii from './admin-radii';
import AdminWoods from './admin-woods';
import AdminFrets from './admin-frets';
import AdminPickupConfigurations from './admin-pickup-configurations';
import AdminGuitarStyles from './admin-guitar-styles';
import AdminGuitarFinishes from './admin-guitar-finishes';

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
                    <Tab label="Pickup Configurations" />
                    <Tab label="Body Styles" />
                    <Tab label="Guitar Finishes" />
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
            <TabPanel value={value} index={4}>
                <AdminPickupConfigurations />
            </TabPanel>
            <TabPanel value={value} index={5}>
                <AdminGuitarStyles />
            </TabPanel>
            <TabPanel value={value} index={6}>
                <AdminGuitarFinishes />
            </TabPanel>
        </Layout>
    )
};

export default Home;