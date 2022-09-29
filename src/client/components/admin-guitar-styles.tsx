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
import { GuitarStyle } from '../models/guitar-style';
import { Domain } from '../models/domain';
import { j } from '../jinaga-config';
import { GuitarStyleDeleted } from '../models/guitar-style-deleted';
import SnackBarAlert from './snack-bar-alert';
import type { Color } from '@material-ui/lab/Alert'

const useStyles = makeStyles(() => ({
    table: {
        height: 630
    },
    addGuitarStyleButtonContainer: {
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

export const getAllAvailableGuitarStylesInDomain = async (domain: Domain) => {
    let configurations = await j.query(domain, j.for(GuitarStyle.getAllAvailableGuitarStyles));
    return configurations; 
}

const AdminGuitarStyles = () => {

    const domain = Domain.Instance;
    const classes = useStyles();

    const fetchAllGuitarStyles = async () => {
        let guitarStyles = await j.query(domain, j.for(GuitarStyle.getAllAvailableGuitarStyles));
        return guitarStyles;
    }

    const [open, setOpen] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [guitarStylesInputxText, setGuitarStylesInputxText] = useState('');
    const [selectedGuitarStyle, setSelectedGuitarStyle] = useState<GuitarStyle>(new GuitarStyle("", new Date(), domain));
    const [tableDataIsLoading, setTableDataIsLoading] = useState(true);
    const [tableData, setTableData] = useState<GuitarStyle[]>([]);
    const [openSnackBarAlert, setOpenSnackBarAlert] = useState(false);
    const [snackBarAlertMessage, setSnackBarAlertMessage] = useState("");
    const [snackBarAlertSeverity, setSnackBarAlertSeverity] = useState<Color | undefined>("info");

    useEffect(() => {
        fetchAllGuitarStyles().then(guitarStyles => {
            setTableData(guitarStyles);
            setTableDataIsLoading(false);
        });
    }, [])

    const handleGuitarStylesTextInputChange = (event: any) => {
        setGuitarStylesInputxText(event.target.value);
    };
    
    const displayAlert = (message: string, severity: Color) => {
        setSnackBarAlertMessage(message);
        setSnackBarAlertSeverity(severity);
        setOpenSnackBarAlert(true);
    }

    const handleSubmitAddGuitarStyle = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (tableData.some((guitarStyle: GuitarStyle) => guitarStyle.style === guitarStylesInputxText)) {
            displayAlert('Guitar Body Style already exists!', 'error');
        } else {
            const guitarStyle = await j.fact(new GuitarStyle(guitarStylesInputxText, new Date(), domain));
            let guitarStyles = [...tableData, guitarStyle];
            guitarStyles.sort((a, b) => a.style.localeCompare(b.style))
            setTableData(guitarStyles);
            displayAlert('Guitar Body Style added successfully', 'success');
            setOpen(false);
        }
    }

    const handleSubmitDeleteGuitarStyle = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        await j.fact(new GuitarStyleDeleted(selectedGuitarStyle, new Date()));
        setTableData(tableData.filter((guitarStyle: GuitarStyle) => guitarStyle.style !== selectedGuitarStyle.style));
        displayAlert('Guitar Body Style deleted successfully', 'success');
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
            field: "guitarStyleValue",
            headerName: "Body Style",
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
            <div className={classes.addGuitarStyleButtonContainer}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>Add Body Style</Button>
            </div>
            <DataGrid
                className={classes.table}
                rows={tableData.map((row: GuitarStyle, i: number) => {
                    return {
                        id: i,
                        guitarStyleValue: row.style,
                        guitarStyle: row
                    }
                })}
                columns={columns}
                pageSize={10}
                onRowClick={(rowData) => setSelectedGuitarStyle(rowData.row.guitarStyle)}
                disableSelectionOnClick={true}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <form onSubmit={handleSubmitAddGuitarStyle}>
                    <DialogTitle>Add Body Style</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Body styles can be any type of guitar body shape.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Body Style"
                            type="text"
                            fullWidth
                            variant="standard"
                            onInput={handleGuitarStylesTextInputChange}
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
                <form onSubmit={handleSubmitDeleteGuitarStyle}>
                    <DialogTitle>Delete GuitarStyle</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure that you want to delete <strong>{selectedGuitarStyle.style}</strong> body style?
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

export default AdminGuitarStyles;