import React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Layout from './layout';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Domain } from '../models/domain';
import { getAllAvailableWoodsInDomain } from './admin-woods';
import { getAllAvailablePickupConfigurationsInDomain } from './admin-pickup-configurations';
import { getAllAvailableGuitarStylesInDomain } from './admin-guitar-styles';
import { getAllAvailableGuitarFinishesInDomain } from './admin-guitar-finishes';
import { getAllAvailableFretSizesInDomain } from './admin-frets';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            minHeight: '668px'
        },
        bodyDiv: {
            textAlign: 'left',
            width: 300
        },
        checkBox: {
            paddingTop: 20,
            display: 'block'
        },
        pickupModelInput: {
            marginTop: 17
        },
        checkboxWrapper: {
            textAlign: 'left'
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

    const [fretSizes, setFretSizes] = useState<String[]>([]);

    const [state, setState] = React.useState({
        checkedOnePiece: false,
        checkedUniversalRout: false,
        checkedOnePieceNeck: false,
        checkedQuartersawn: true,
    });

    const handleChangeOnePieceCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleChangeUniversalRoutCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleChangeOnePieceNeckCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleChangeQuatersawnNeck = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        getAllAvailableFretSizesInDomain(domain).then(sizes => {
            setFretSizes(sizes.map(size => size.fret));
        })
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
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={6}>
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
                                            <TextField {...params} label="Top Wood" margin="normal" required={!state.checkedOnePiece} disabled={state.checkedOnePiece} />
                                        )}
                                    />
                                    <div className={classes.checkboxWrapper}>
                                        <FormControlLabel
                                            className={classes.checkBox}
                                            control={
                                                <Checkbox
                                                    checked={state.checkedOnePiece}
                                                    onChange={handleChangeOnePieceCheckbox}
                                                    name="checkedOnePiece"
                                                    color="primary"
                                                />
                                            }
                                            label="One Piece Body"
                                        />
                                        <FormControlLabel
                                            className={classes.checkBox}
                                            control={
                                                <Checkbox
                                                    checked={state.checkedUniversalRout}
                                                    onChange={handleChangeUniversalRoutCheckbox}
                                                    name="checkedUniversalRout"
                                                    color="primary"
                                                />
                                            }
                                            label="Universal Rout"
                                        />
                                    </div>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Autocomplete
                                                id="neck-pickup-rout-input"
                                                options={pickupConfigurations}
                                                disabled={state.checkedUniversalRout}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Neck Pickup" margin="normal" required={!state.checkedUniversalRout} />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div className={classes.pickupModelInput}>
                                                <TextField
                                                    id="neck-pickup-model-input"
                                                    label="Pickup model"
                                                    fullWidth={true}
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Autocomplete
                                                id="middle-pickup-rout-input"
                                                options={pickupConfigurations}
                                                disabled={state.checkedUniversalRout}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Middle Pickup" margin="normal" required={!state.checkedUniversalRout} />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div className={classes.pickupModelInput}>
                                                <TextField
                                                    id="middle-pickup-model-input"
                                                    label="Pickup model"
                                                    fullWidth={true}
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Autocomplete
                                                id="bridge-pickup-rout-input"
                                                options={pickupConfigurations}
                                                disabled={state.checkedUniversalRout}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Bridge Pickup" margin="normal" required={!state.checkedUniversalRout} />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div className={classes.pickupModelInput}>
                                                <TextField
                                                    id="bridge-pickup-model-input"
                                                    label="Pickup model"
                                                    fullWidth={true}
                                                />
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Autocomplete
                                        id="guitar-style-input"
                                        freeSolo
                                        options={guitarStyles}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Body Style" margin="normal" required />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
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
                                    <TextField
                                        id="number-of-strings-input"
                                        label="Number of Strings"
                                        type="number"
                                        margin="normal"
                                        required
                                        defaultValue="6"
                                        fullWidth={true}
                                        InputProps={{
                                            inputProps: { min: "6", step: "1" }
                                        }}
                                    />
                                    <TextField
                                        id="comments-body-textarea"
                                        label="Comments"
                                        multiline
                                        rows={17}
                                        variant="outlined"
                                        fullWidth={true}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    {/*-------------------------------------------------- Neck --------------------------------------------------*/}
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h4" gutterBottom align='left'>
                                Neck
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={6}>
                                    <Autocomplete
                                        id="neck-wood-input"
                                        freeSolo
                                        options={neckWoods}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Neck Wood" margin="normal" required />
                                        )}
                                    />
                                    <Autocomplete
                                        id="fretboard-wood-input"
                                        freeSolo
                                        disabled={state.checkedOnePieceNeck}
                                        options={fretboardWoods}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Fretboard Wood" margin="normal" required={!state.checkedOnePieceNeck} disabled={state.checkedOnePieceNeck} />
                                        )}
                                    />
                                    <div className={classes.checkboxWrapper}>
                                        <FormControlLabel
                                            className={classes.checkBox}
                                            control={
                                                <Checkbox
                                                    checked={state.checkedOnePieceNeck}
                                                    onChange={handleChangeOnePieceNeckCheckbox}
                                                    name="checkedOnePieceNeck"
                                                    color="primary"
                                                    />
                                                }
                                            label="One Piece Neck"
                                        />
                                        <FormControlLabel
                                            className={classes.checkBox}
                                            control={
                                                <Checkbox
                                                    checked={state.checkedUniversalRout}
                                                    onChange={handleChangeQuatersawnNeck}
                                                    name="checkedQuartersawn"
                                                    color="primary"
                                                />
                                            }
                                            label="Quartersawn"
                                        />
                                    </div>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <Autocomplete
                                                id="fret-size-input"
                                                freeSolo
                                                options={fretSizes}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Fret Size" margin="normal" required />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                id="number-of-frets-input"
                                                label="Number of Frets"
                                                type="number"
                                                margin="normal"
                                                required
                                                defaultValue="22"
                                                fullWidth={true}
                                                InputProps={{
                                                    inputProps: { min: "21", step: "1" }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Autocomplete
                                        id="neck-heel-shape-input"
                                        freeSolo
                                        options={guitarStyles} // Need to create a new admin section
                                        renderInput={(params) => (
                                            <TextField {...params} label="Heel Shape" margin="normal" required />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Autocomplete
                                        id="neck-fretboard-finish-input" // need to create an admin section
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
                                    <TextField
                                        id="number-of-strings-input"
                                        label="Number of Strings"
                                        type="number"
                                        margin="normal"
                                        required
                                        defaultValue="6"
                                        fullWidth={true}
                                        InputProps={{
                                            inputProps: { min: "6", step: "1" }
                                        }}
                                    />
                                    <TextField
                                        id="comments-body-textarea"
                                        label="Comments"
                                        multiline
                                        rows={17}
                                        variant="outlined"
                                        fullWidth={true}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
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