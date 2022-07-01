import React from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Layout from './layout';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Radius } from '../models/radius';
import { Domain } from '../models/domain';
import { j } from '../jinaga-config';
const Home = () => {

    const [radiiInputxText, setRadiiInputxText] = useState('');

    const handleRadiiTextInputChange = (event: any) => {
        setRadiiInputxText(event.target.value);
    };

    const domain = Domain.Instance;

    const handleAddRadius = async () => {
        await j.fact(new Radius(radiiInputxText, new Date(), domain))
        setOpen(false);
    }

    const getAvailableRadiiHandler = async () => {
        j.query(domain, j.for(Radius.getAllAvailableRadii)).then(value => console.log(value));
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // return (
    //     <div>
    //         <Button variant="outlined" onClick={handleClickOpen}>
    //             Open form dialog
    //         </Button>

    //     </div>
    // );

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>
                Home
            </Typography>
            <hr />
            <Button onClick={handleClickOpen}>Add radius</Button>
            <Button onClick={getAvailableRadiiHandler}>Get all Radii</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Radius</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Radii can be compound or straight.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Radius"
                        type="text"
                        fullWidth
                        variant="standard"
                        onInput={handleRadiiTextInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddRadius}>Add</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    )
};

export default Home;