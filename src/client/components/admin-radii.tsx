import React from 'react';
import { useState } from 'react';
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
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DataGrid } from '@material-ui/data-grid';
import { Radius } from '../models/radius';
import { Domain } from '../models/domain';
import { j } from '../jinaga-config';
import { RadiusDeleted } from '../models/radius-deleted';
import SnackBarAlert from './snack-bar-alert';
import type { Color } from '@material-ui/lab/Alert'

const useStyles = makeStyles(() => ({
    table: {
        height: 630
    },
    addRadiusButtonContainer: {
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

const AdminRadii = () => {

    const domain = Domain.Instance;
    const classes = useStyles();

    const fetchAllRadii = async () => {
        let radii = await j.query(domain, j.for(Radius.getAllAvailableRadii));
        radii.sort((a, b) => a.radius.localeCompare(b.radius));
        return radii;
    }

    const [open, setOpen] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [radiiInputxText, setRadiiInputxText] = useState('');
    const [selectedRadius, setSelectedRadius] = useState<Radius>(() => new Radius("", new Date(), domain));
    const [tableDataIsLoading, setTableDataIsLoading] = useState(true);
    const [tableData, setTableData] = useState<any>(() => {
        fetchAllRadii().then(radii => {
            setTableData(radii);
            setTableDataIsLoading(false);
        });
    });
    const [openSnackBarAlert, setOpenSnackBarAlert] = useState(false);
    const [snackBarAlertMessage, setSnackBarAlertMessage] = useState("");
    const [snackBarAlertSeverity, setSnackBarAlertSeverity] = useState<Color | undefined>("info");

    const handleRadiiTextInputChange = (event: any) => {
        setRadiiInputxText(event.target.value);
    };
    
    const displayAlert = (message: string, severity: Color) => {
        setSnackBarAlertMessage(message);
        setSnackBarAlertSeverity(severity);
        setOpenSnackBarAlert(true);
    }

    const handleSubmitAddRadius = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (tableData.some((radius: Radius) => radius.radius === radiiInputxText)) {
            displayAlert('Radius already exists!', 'error');
        } else {
            await j.fact(new Radius(radiiInputxText, new Date(), domain));
            fetchAllRadii().then(radii => setTableData(radii));
            displayAlert('Radius added successfully', 'success');
            setOpen(false);
        }
    }

    const handleSubmitDeleteRadius = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await j.fact(new RadiusDeleted(selectedRadius, new Date()));
        fetchAllRadii().then(radii => setTableData(radii));
        setSelectedRadius(new Radius("", new Date(), domain));
        displayAlert('Radius deleted successfully', 'success');
        setOpenDeleteConfirmDialog(false);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleoOpenDeleteConfirmDialog = (radius: Radius) => {
        setSelectedRadius(radius);
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
            field: "radiusValue",
            headerName: "Radius",
            flex: 1,
        },
        {
            field: "Actions",
            renderCell: (cellValues: any) => {
                return (
                    <>
                        <IconButton>
                            <EditIcon color="primary" onClick={() => console.log(cellValues.row.radius)} />
                        </IconButton>
                        <IconButton>
                            <DeleteIcon color="secondary" onClick={() => handleoOpenDeleteConfirmDialog(cellValues.row.radius)} />
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
            <div className={classes.addRadiusButtonContainer}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>Add radius</Button>
            </div>
            <DataGrid
                className={classes.table}
                rows={tableData.map((row: Radius, i: number) => {
                    return {
                        id: i,
                        radiusValue: row.radius,
                        radius: row
                    }
                })}
                columns={columns}
                pageSize={10}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <form onSubmit={handleSubmitAddRadius}>
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
                <form onSubmit={handleSubmitDeleteRadius}>
                    <DialogTitle>Delete Radius</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete <strong>{selectedRadius.radius}</strong> radius?
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

export default AdminRadii;