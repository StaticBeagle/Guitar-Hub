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
import { GuitarFinish } from '../models/guitar-finish';
import { Domain } from '../models/domain';
import { j } from '../jinaga-config';
import { GuitarFinishDeleted } from '../models/guitar-finish-deleted';
import SnackBarAlert from './snack-bar-alert';
import type { Color } from '@material-ui/lab/Alert'

const useStyles = makeStyles(() => ({
    table: {
        height: 630
    },
    addGuitarFinishButtonContainer: {
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

export const getAllAvailableGuitarFinishesInDomain = async (domain: Domain) => {
    let guitarFinishes = await j.query(domain, j.for(GuitarFinish.getAllAvailableGuitarFinishes));
    guitarFinishes.sort((a, b) => a.finish.localeCompare(b.finish));
    return guitarFinishes;
}

const AdminGuitarFinishes = () => {

    const domain = Domain.Instance;
    const classes = useStyles();

    const fetchAllGuitarFinishes = async () => {
        let guitarFinishes = await j.query(domain, j.for(GuitarFinish.getAllAvailableGuitarFinishes));
        guitarFinishes.sort((a, b) => a.finish.localeCompare(b.finish));
        return guitarFinishes;
    }

    const [open, setOpen] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [guitarFinishInputxText, setGuitarFinishInputxText] = useState('');
    const [selectedGuitarFinish, setSelectedGuitarFinish] = useState<GuitarFinish>(new GuitarFinish("", new Date(), domain));
    const [tableDataIsLoading, setTableDataIsLoading] = useState(true);
    const [tableData, setTableData] = useState<GuitarFinish[]>([]);
    const [openSnackBarAlert, setOpenSnackBarAlert] = useState(false);
    const [snackBarAlertMessage, setSnackBarAlertMessage] = useState("");
    const [snackBarAlertSeverity, setSnackBarAlertSeverity] = useState<Color | undefined>("info");

    useEffect(() => {
        fetchAllGuitarFinishes().then(guitarFinishes => {
            setTableData(guitarFinishes);
            setTableDataIsLoading(false);
        });
    }, [])

    const handleGuitarFinishTextInputChange = (event: any) => {
        setGuitarFinishInputxText(event.target.value);
    };
    
    const displayAlert = (message: string, severity: Color) => {
        setSnackBarAlertMessage(message);
        setSnackBarAlertSeverity(severity);
        setOpenSnackBarAlert(true);
    }

    const handleSubmitAddGuitarFinish = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (tableData.some((guitarFinish: GuitarFinish) => guitarFinish.finish === guitarFinishInputxText)) {
            displayAlert('Guitar Finish already exists!', 'error');
        } else {
            const guitarFinish = await j.fact(new GuitarFinish(guitarFinishInputxText, new Date(), domain));
            let guitarFinishes = [...tableData, guitarFinish];
            guitarFinishes.sort((a, b) => a.finish.localeCompare(b.finish))
            setTableData(guitarFinishes);
            displayAlert('Guitar Finish added successfully', 'success');
            setOpen(false);
        }
    }

    const handleSubmitDeleteGuitarFinish = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await j.fact(new GuitarFinishDeleted(selectedGuitarFinish, new Date()));
        setTableData(tableData.filter((guitarFinish: GuitarFinish) => guitarFinish.finish !== selectedGuitarFinish.finish));
        displayAlert('Guitar Finish deleted successfully', 'success');
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
            field: "guitarFinishValue",
            headerName: "Guitar Finish",
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
            <div className={classes.addGuitarFinishButtonContainer}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>Add Guitar Finish</Button>
            </div>
            <DataGrid
                className={classes.table}
                rows={tableData.map((row: GuitarFinish, i: number) => {
                    return {
                        id: i,
                        guitarFinishValue: row.finish,
                        guitarFinish: row
                    }
                })}
                columns={columns}
                pageSize={10}
                onRowClick={(rowData) => setSelectedGuitarFinish(rowData.row.guitarFinish)}
                disableSelectionOnClick={true}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <form onSubmit={handleSubmitAddGuitarFinish}>
                    <DialogTitle>Add Guitar Finish</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Guitar Finish can be any color applied to a guitar.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Guitar Finish"
                            type="text"
                            fullWidth
                            variant="standard"
                            onInput={handleGuitarFinishTextInputChange}
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
                <form onSubmit={handleSubmitDeleteGuitarFinish}>
                    <DialogTitle>Delete GuitarFinish</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete <strong>{selectedGuitarFinish.finish}</strong> guitar finish?
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

export default AdminGuitarFinishes;