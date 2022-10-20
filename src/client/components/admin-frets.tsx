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
import SnackBarAlert from './snack-bar-alert';
import type { Color } from '@material-ui/lab/Alert'
import { Fret } from '../models/fret';
import { FretDeleted } from '../models/fret-deleted';

const useStyles = makeStyles(() => ({
    table: {
        height: 630
    },
    addFretContainer: {
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

export const getAllAvailableFretSizesInDomain = async (domain: Domain) => {
    let frets = await j.query(domain, j.for(Fret.getAllAvailableFrets));
    frets.sort((a, b) => a.fret.localeCompare(b.fret));
    return frets;
}

const AdminFrets = () => {

    const domain = Domain.Instance;
    const classes = useStyles();

    const fetchAllFrets = async () => {
        let frets = await j.query(domain, j.for(Fret.getAllAvailableFrets));
        frets.sort((a, b) => a.fret.localeCompare(b.fret));
        return frets;
    }

    const [open, setOpen] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [fretInputText, setFretInputText] = useState('');
    const [selectedFret, setSelectedFret] = useState<Fret>(new Fret("", new Date(), domain));
    const [tableDataIsLoading, setTableDataIsLoading] = useState(true);
    const [tableData, setTableData] = useState<Fret[]>([]);
    const [openSnackBarAlert, setOpenSnackBarAlert] = useState(false);
    const [snackBarAlertMessage, setSnackBarAlertMessage] = useState("");
    const [snackBarAlertSeverity, setSnackBarAlertSeverity] = useState<Color | undefined>("info");

    useEffect(() => {
        fetchAllFrets().then(frets => {
            setTableData(frets);
            setTableDataIsLoading(false);
        });
    }, [])

    const handleRadiiTextInputChange = (event: any) => {
        setFretInputText(event.target.value);
    };
    
    const displayAlert = (message: string, severity: Color) => {
        setSnackBarAlertMessage(message);
        setSnackBarAlertSeverity(severity);
        setOpenSnackBarAlert(true);
    }

    const handleSubmitAddFret = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (tableData.some((fret: Fret) => fret.fret === fretInputText)) {
            displayAlert('Fret already exists!', 'error');
        } else {
            const fret = await j.fact(new Fret(fretInputText, new Date(), domain));
            let frets = [...tableData, fret];
            frets.sort((a, b) => a.fret.localeCompare(b.fret));
            setTableData(frets);
            displayAlert('Fret added successfully', 'success');
            setOpen(false);
        }
    }

    const handleSubmitDeleteFret = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await j.fact(new FretDeleted(selectedFret, new Date()));
        setTableData(tableData.filter((fret: Fret) => fret.fret !== selectedFret.fret));
        displayAlert('Fret deleted successfully', 'success');
        setOpenDeleteConfirmDialog(false);
    }

    const handleClickOpen = () => {
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
            field: "fretValue",
            headerName: "Fret",
            flex: 1,
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

    if (tableDataIsLoading) {
        return (
            <div className={classes.loading}>
                <CircularProgress size="3rem" />
            </div>
        )
    }

    return (
        <div>
            <div className={classes.addFretContainer}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>Add Fret</Button>
            </div>
            <DataGrid
                className={classes.table}
                rows={tableData.map((row: Fret, i: number) => {
                    return {
                        id: i,
                        fretValue: row.fret,
                        fret: row
                    }
                })}
                columns={columns}
                pageSize={10}
                onRowClick={(rowData) => setSelectedFret(rowData.row.fret)}
                disableSelectionOnClick={true}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <form onSubmit={handleSubmitAddFret}>
                    <DialogTitle>Add Fret</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the material and size of the fret.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Fret"
                            type="text"
                            fullWidth
                            variant="standard"
                            onInput={handleRadiiTextInputChange}
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
                <form onSubmit={handleSubmitDeleteFret}>
                    <DialogTitle>Delete Fret</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete <strong>{selectedFret.fret}</strong> Fret?
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

export default AdminFrets;