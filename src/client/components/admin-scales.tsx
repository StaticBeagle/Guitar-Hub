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
import { Scale } from '../models/scale';
import { Domain } from '../models/domain';
import { j } from '../jinaga-config';
import { ScaleDeleted } from '../models/scale-deleted';
import SnackBarAlert from './snack-bar-alert';
import type { Color } from '@material-ui/lab/Alert'

const useStyles = makeStyles(() => ({
    table: {
        height: 630
    },
    addScaleButtonContainer: {
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

const AdminScales = () => {

    const domain = Domain.Instance;
    const classes = useStyles();

    const fetchAllScales = async () => {
        let scales = await j.query(domain, j.for(Scale.getAllAvailableScales));
        scales.sort((a, b) => a.scale.localeCompare(b.scale));
        return scales;
    }

    const [open, setOpen] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [scalesInputxText, setScalesInputxText] = useState('');
    const [selectedScale, setSelectedScale] = useState<Scale>(new Scale("", new Date(), domain));
    const [tableDataIsLoading, setTableDataIsLoading] = useState(true);
    const [tableData, setTableData] = useState<Scale[]>([]);
    const [openSnackBarAlert, setOpenSnackBarAlert] = useState(false);
    const [snackBarAlertMessage, setSnackBarAlertMessage] = useState("");
    const [snackBarAlertSeverity, setSnackBarAlertSeverity] = useState<Color | undefined>("info");

    useEffect(() => {
        fetchAllScales().then(scales => {
            setTableData(scales);
            setTableDataIsLoading(false);
        });
    }, [])

    const handleScalesTextInputChange = (event: any) => {
        setScalesInputxText(event.target.value);
    };
    
    const displayAlert = (message: string, severity: Color) => {
        setSnackBarAlertMessage(message);
        setSnackBarAlertSeverity(severity);
        setOpenSnackBarAlert(true);
    }

    const handleSubmitAddScale = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (tableData.some((scale: Scale) => scale.scale === scalesInputxText)) {
            displayAlert('Scale already exists!', 'error');
        } else {
            const scale = await j.fact(new Scale(scalesInputxText, new Date(), domain));
            let scales = [...tableData, scale];
            scales.sort((a, b) => a.scale.localeCompare(b.scale))
            setTableData(scales);
            displayAlert('Scale added successfully', 'success');
            setOpen(false);
        }
    }

    const handleSubmitDeleteScale = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await j.fact(new ScaleDeleted(selectedScale, new Date()));
        setTableData(tableData.filter((scale: Scale) => scale.scale !== selectedScale.scale));
        displayAlert('Scale deleted successfully', 'success');
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
            field: "scaleValue",
            headerName: "Scale",
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
            <div className={classes.addScaleButtonContainer}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>Add scale</Button>
            </div>
            <DataGrid
                className={classes.table}
                rows={tableData.map((row: Scale, i: number) => {
                    return {
                        id: i,
                        scaleValue: row.scale,
                        scale: row
                    }
                })}
                columns={columns}
                pageSize={10}
                onRowClick={(rowData) => setSelectedScale(rowData.row.scale)}
                disableSelectionOnClick={true}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <form onSubmit={handleSubmitAddScale}>
                    <DialogTitle>Add Scale</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Scales in inches.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Scale"
                            type="text"
                            fullWidth
                            variant="standard"
                            onInput={handleScalesTextInputChange}
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
                <form onSubmit={handleSubmitDeleteScale}>
                    <DialogTitle>Delete Scale</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete <strong>{selectedScale.scale}</strong> scale?
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

export default AdminScales;