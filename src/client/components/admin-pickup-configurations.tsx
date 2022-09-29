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
import { PickupConfiguration } from '../models/pickup-configuration';
import { Domain } from '../models/domain';
import { j } from '../jinaga-config';
import { PickupConfigurationDeleted } from '../models/pickup-configuration-deleted';
import SnackBarAlert from './snack-bar-alert';
import type { Color } from '@material-ui/lab/Alert'

const useStyles = makeStyles(() => ({
    table: {
        height: 630
    },
    addPickupConfigurationButtonContainer: {
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

export const getAllAvailablePickupConfigurationsInDomain = async (domain: Domain) => {
    let configurations = await j.query(domain, j.for(PickupConfiguration.getAllAvailablePickupConfigurations));
    return configurations; 
}

const AdminPickupConfigurations = () => {

    const domain = Domain.Instance;
    const classes = useStyles();

    const fetchAllPickupConfigurations = async () => {
        let pickupConfigurations = await j.query(domain, j.for(PickupConfiguration.getAllAvailablePickupConfigurations));
        return pickupConfigurations;
    }

    const [open, setOpen] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [pickupConfigurationsInputxText, setPickupConfigurationsInputxText] = useState('');
    const [selectedPickupConfiguration, setSelectedPickupConfiguration] = useState<PickupConfiguration>(new PickupConfiguration("", new Date(), domain));
    const [tableDataIsLoading, setTableDataIsLoading] = useState(true);
    const [tableData, setTableData] = useState<PickupConfiguration[]>([]);
    const [openSnackBarAlert, setOpenSnackBarAlert] = useState(false);
    const [snackBarAlertMessage, setSnackBarAlertMessage] = useState("");
    const [snackBarAlertSeverity, setSnackBarAlertSeverity] = useState<Color | undefined>("info");

    useEffect(() => {
        fetchAllPickupConfigurations().then(pickupConfigurations => {
            setTableData(pickupConfigurations);
            setTableDataIsLoading(false);
        });
    }, [])

    const handlePickupConfigurationsTextInputChange = (event: any) => {
        setPickupConfigurationsInputxText(event.target.value);
    };
    
    const displayAlert = (message: string, severity: Color) => {
        setSnackBarAlertMessage(message);
        setSnackBarAlertSeverity(severity);
        setOpenSnackBarAlert(true);
    }

    const handleSubmitAddPickupConfiguration = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (tableData.some((pickupConfiguration: PickupConfiguration) => pickupConfiguration.configuration === pickupConfigurationsInputxText)) {
            displayAlert('Pickup Configuration already exists!', 'error');
        } else {
            const pickupConfiguration = await j.fact(new PickupConfiguration(pickupConfigurationsInputxText, new Date(), domain));
            let pickupConfigurations = [...tableData, pickupConfiguration];
            pickupConfigurations.sort((a, b) => a.configuration.localeCompare(b.configuration))
            setTableData(pickupConfigurations);
            displayAlert('Pickup Configuration added successfully', 'success');
            setOpen(false);
        }
    }

    const handleSubmitDeletePickupConfiguration = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await j.fact(new PickupConfigurationDeleted(selectedPickupConfiguration, new Date()));
        setTableData(tableData.filter((pickupConfiguration: PickupConfiguration) => pickupConfiguration.configuration !== selectedPickupConfiguration.configuration));
        displayAlert('Pickup Configuration deleted successfully', 'success');
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
            field: "pickupConfigurationValue",
            headerName: "Pickup Configuration",
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
            <div className={classes.addPickupConfigurationButtonContainer}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>Add Pickup Configuration</Button>
            </div>
            <DataGrid
                className={classes.table}
                rows={tableData.map((row: PickupConfiguration, i: number) => {
                    return {
                        id: i,
                        pickupConfigurationValue: row.configuration,
                        pickupConfiguration: row
                    }
                })}
                columns={columns}
                pageSize={10}
                onRowClick={(rowData) => setSelectedPickupConfiguration(rowData.row.pickupConfiguration)}
                disableSelectionOnClick={true}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <form onSubmit={handleSubmitAddPickupConfiguration}>
                    <DialogTitle>Add Pickup Configuration</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Pickup Configurations can be any type of pickup route.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Pickup Configuration"
                            type="text"
                            fullWidth
                            variant="standard"
                            onInput={handlePickupConfigurationsTextInputChange}
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
                <form onSubmit={handleSubmitDeletePickupConfiguration}>
                    <DialogTitle>Delete PickupConfiguration</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete <strong>{selectedPickupConfiguration.configuration}</strong> pickup configuration?
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

export default AdminPickupConfigurations;