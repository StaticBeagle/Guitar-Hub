import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Layout from './layout';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { Domain } from '../models/domain';
import { getAllAvailableWoodsInDomain } from './admin-woods';
import { getAllAvailablePickupConfigurationsInDomain } from './admin-pickup-configurations';
import { getAllAvailableGuitarStylesInDomain } from './admin-guitar-styles';
import { getAllAvailableGuitarFinishesInDomain } from './admin-guitar-finishes';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            minHeight: '600px'
        },
        bodyDiv: {
            textAlign: 'left',
            width: 300
        },
        checkBox: {
            paddingTop: 20
        }
    }),
);

export default function UserCreateGuitarView() {
    const classes = useStyles();

    const domain = Domain.Instance;

    const [bodyWoods, setBodyWoods] = useState<String[]>([]);
    const [topWoods, setTopWoods] = useState<String[]>([]);
    const [neckWoods, setNeckWoods] = useState<String[]>([]);
    const [fretboardWoods, setFretboardWoods] = useState<String[]>([]);

    const [pickupConfigurations, setPickupConfigurations] = useState<String[]>([]);

    const [guitarStyles, setGuitarStyles] = useState<String[]>([]);

    const [guitarFinishes, setGuitarFinishes] = useState<String[]>([]);

    const [state, setState] = React.useState({
        checkedOnePiece: false,
        checkedB: true,
        checkedF: true,
        checkedG: true,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
        getAllAvailableWoodsInDomain(domain).then(woods => {
            setBodyWoods(woods.filter(wood => wood.isBodyWood).map(wood => wood.wood));
            setTopWoods(woods.filter(wood => wood.isLaminatedTopWood).map(wood => wood.wood));
            setNeckWoods(woods.filter(wood => wood.isNeckWood).map(wood => wood.wood));
            setFretboardWoods(woods.filter(wood => wood.isFretboardWood).map(wood => wood.wood));
        });

        getAllAvailablePickupConfigurationsInDomain(domain).then(configurations => {
            setPickupConfigurations(configurations.map(configuration => configuration.configuration));
        });

        getAllAvailableGuitarStylesInDomain(domain).then(styles => {
            setGuitarStyles(styles.map(style => style.style));
        });

        getAllAvailableGuitarFinishesInDomain(domain).then(finishes => {
            setGuitarFinishes(finishes.map(finish => finish.finish));
        });
    }, [])

    return (
        <Layout header="Create A Guitar">
            <form className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={3}>
                        <Paper className={classes.paper}><a href="https://placeholder.com"><img src="https://via.placeholder.com/350x560"></img></a></Paper>
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <Paper className={classes.paper}>
                            <Typography variant="h4" gutterBottom align='left'>
                                Body
                            </Typography>
                            <div className={classes.bodyDiv}>
                                <Autocomplete
                                    id="body-wood-input"
                                    freeSolo
                                    options={bodyWoods}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Body Wood" margin="normal" required />
                                    )}
                                />
                                <Autocomplete
                                    id="top-wood-input"
                                    freeSolo
                                    disabled={state.checkedOnePiece}
                                    options={topWoods}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Top Wood" margin="normal" required disabled={state.checkedOnePiece} />
                                    )}
                                />
                                <FormControlLabel
                                    className={classes.checkBox}
                                    control={
                                        <Checkbox
                                            checked={state.checkedOnePiece}
                                            onChange={handleChange}
                                            name="checkedOnePiece"
                                            color="primary"
                                        />
                                    }
                                    label="One Piece"
                                />
                                <Autocomplete
                                    id="neck-pickup-input"
                                    options={pickupConfigurations}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Neck Pickup" margin="normal" required />
                                    )}
                                />
                                <Autocomplete
                                    id="middle-pickup-input"
                                    options={pickupConfigurations}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Middle Pickup" margin="normal" required />
                                    )}
                                />
                                <Autocomplete
                                    id="bridge-pickup-input"
                                    options={pickupConfigurations}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Bridge Pickup" margin="normal" required />
                                    )}
                                />
                                <Autocomplete
                                    id="guitar-style-input"
                                    freeSolo
                                    options={guitarStyles}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Body Style" margin="normal" required />
                                    )}
                                />
                                <Autocomplete
                                    id="color-top-input"
                                    freeSolo
                                    options={guitarFinishes}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Top Color" margin="normal" required />
                                    )}
                                />
                                <Autocomplete
                                    id="color-back-input"
                                    freeSolo
                                    options={guitarFinishes}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Back Color" margin="normal" required />
                                    )}
                                />
                            </div>

                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>xs=6 sm=3</Paper>
                    </Grid>
                </Grid>
                <Button variant="contained" color="primary" type="submit">
                    Save
                </Button>
                <Button variant="contained">
                    Cancel
                </Button>
            </form>
        </Layout>
    );
}