import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DataGrid } from '@material-ui/data-grid';
import { Domain } from '../models/domain';
import { j } from '../jinaga-config';
import { Wood } from '../models/wood';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { WoodDeleted } from '../models/wood-deleted';
import SnackBarAlert from './snack-bar-alert';
import type { Color } from '@material-ui/lab/Alert'

const useStyles = makeStyles(() => ({
    table: {
        height: 630
    },
    addWoodButtonContainer: {
        textAlign: 'right',
        marginBottom: '10px',
        marginTop: '10px'
    },
    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    }
}));

const AdminWoods = () => {

    const domain = Domain.Instance;
    const classes = useStyles();

    const fetchAllWoods = async () => {
        let woods = await j.query(domain, j.for(Wood.getAllAvailableWoods));
        woods.sort((a, b) => a.wood.localeCompare(b.wood));
        return woods;
    }

    const [open, setOpen] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [woodsInputxText, setWoodsInputxText] = useState('');
    const [tableDataIsLoading, setTableDataIsLoading] = useState(true);
    const [tableData, setTableData] = useState<Wood[]>([]);
    const [checkBoxStates, setCheckBoxStates] = useState({
        checkedBody: false,
        checkedNeck: false,
        checkedLaminatedTop: false,
        checkedFretboard: false
    });
    const [selectedWood, setSelectedWood] = useState<Wood>(new Wood("", false, false, false, false, new Date(), domain));
    const [openSnackBarAlert, setOpenSnackBarAlert] = useState(false);
    const [snackBarAlertMessage, setSnackBarAlertMessage] = useState("");
    const [snackBarAlertSeverity, setSnackBarAlertSeverity] = useState<Color | undefined>("info");

    useEffect(() => {
        fetchAllWoods().then(woods => {
            setTableData(woods);
            setTableDataIsLoading(false);
        });
    }, [])

    const handleChangeCheckBoxes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxStates({ ...checkBoxStates, [event.target.name]: event.target.checked });
    };

    const handleWoodsTextInputChange = (event: any) => {
        setWoodsInputxText(event.target.value);
    };

    const displayAlert = (message: string, severity: Color) => {
        setSnackBarAlertMessage(message);
        setSnackBarAlertSeverity(severity);
        setOpenSnackBarAlert(true);
    }

    const handleSubmitAddWood = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (tableData.some((wood: Wood) => wood.wood.toLowerCase() === woodsInputxText.toLowerCase())) {
            displayAlert('Wood already exists!', 'error');
        } else {
            const isNeckChecked = checkBoxStates.checkedNeck;
            const isBodyChecked = checkBoxStates.checkedBody;
            const isLaminatedTopChecked = checkBoxStates.checkedLaminatedTop;
            const isFretboardCheckec = checkBoxStates.checkedFretboard
            const wood = await j.fact(new Wood(woodsInputxText, isNeckChecked, isBodyChecked, isLaminatedTopChecked, isFretboardCheckec, new Date(), domain));
            let woods = [...tableData, wood];
            woods.sort((a, b) => a.wood.localeCompare(b.wood))
            setTableData(woods)
            displayAlert('Wood added successfully', 'success');
            setOpen(false);
        }
    }

    const handleSubmitDeleteWood = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await j.fact(new WoodDeleted(selectedWood, new Date()));
        setTableData(tableData.filter((wood: Wood) => wood.wood !== selectedWood.wood));
        displayAlert('Wood deleted successfully', 'success');
        setOpenDeleteConfirmDialog(false);
    }

    if (tableDataIsLoading) {
        return (
            <div className={classes.loading}>
                <CircularProgress size="3rem" />
            </div>
        )
    }

    const handleClickOpen = () => {
        setCheckBoxStates({
            checkedBody: false,
            checkedNeck: false,
            checkedLaminatedTop: false,
            checkedFretboard: false
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleoOpenDeleteConfirmDialog = () => {
        setOpenDeleteConfirmDialog(true);
    }

    const handleCloseDeleteConfirmDialog = () => {
        setOpenDeleteConfirmDialog(false);
    };

    const handleCloseSnackBarAlert = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBarAlert(false);
    };

    const columns = [
        {
            field: "woodValue",
            headerName: "Wood",
            flex: 1,
        },
        {
            field: "isBodyWood",
            headerName: "Body Wood",
            flex: 1,
        },
        {
            field: "isNeckWood",
            headerName: "Neck Wood",
            flex: 1,
        },
        {
            field: "isLaminatedTopWood",
            headerName: "Laminated Top Wood",
            flex: 1,
        },
        {
            field: "isFretboardWood",
            headerName: "Fretboard Wood",
            flex: 0.75,
        },
        {
            field: "Delete",
            renderCell: () => {
                return (
                    <>
                        <IconButton>
                            <DeleteIcon color="secondary" onClick={handleoOpenDeleteConfirmDialog} />
                        </IconButton>
                    </>

                );
            },
            flex: 1,
            sortable: false,
            filterable: false,
        }
    ];

    return (
        <div>
            <div className={classes.addWoodButtonContainer}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>Add wood</Button>
            </div>
            <DataGrid
                className={classes.table}
                rows={tableData.map((row: Wood, i: number) => {
                    return {
                        id: i,
                        woodValue: row.wood,
                        isBodyWood: row.isBodyWood ? "Yes" : "No",
                        isNeckWood: row.isNeckWood ? "Yes" : "No",
                        isLaminatedTopWood: row.isLaminatedTopWood ? "Yes" : "No",
                        isFretboardWood: row.isFretboardWood ? "Yes" : "No",
                        wood: row
                    }
                })}
                columns={columns}
                pageSize={10}
                onRowClick={(rowData) => setSelectedWood(rowData.row.wood)}
                disableSelectionOnClick={true}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <form onSubmit={handleSubmitAddWood}>
                    <DialogTitle>Add Wood</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Woods can be used for bodies, necks, and laminated tops.
                        </DialogContentText>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkBoxStates.checkedBody}
                                        onChange={handleChangeCheckBoxes}
                                        name="checkedBody"
                                        color="primary" />}
                                label="Body"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkBoxStates.checkedNeck}
                                        onChange={handleChangeCheckBoxes}
                                        name="checkedNeck"
                                        color="primary" />
                                }
                                label="Neck"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkBoxStates.checkedLaminatedTop}
                                        onChange={handleChangeCheckBoxes}
                                        name="checkedLaminatedTop"
                                        color="primary" />}
                                label="Laminated Top"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkBoxStates.checkedFretboard}
                                        onChange={handleChangeCheckBoxes}
                                        name="checkedFretboard"
                                        color="primary" />}
                                label="Fretboard"
                            />
                        </FormGroup>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Wood"
                            type="text"
                            fullWidth
                            variant="standard"
                            onInput={handleWoodsTextInputChange}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={openDeleteConfirmDialog} onClose={handleCloseDeleteConfirmDialog} maxWidth="sm" fullWidth={true}>
                <form onSubmit={handleSubmitDeleteWood}>
                    <DialogTitle>Delete Radius</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete <strong>{selectedWood.wood}</strong> wood?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteConfirmDialog}>Cancel</Button>
                        <Button type="submit" color="secondary">Delete</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <SnackBarAlert
                open={openSnackBarAlert}
                message={snackBarAlertMessage}
                severity={snackBarAlertSeverity}
                handleClose={handleCloseSnackBarAlert}
            />
        </div>
    );
}

export default AdminWoods;