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
    const [radiiInputxText, setRadiiInputxText] = useState('');
    const [tableDataIsLoading, setTableDataIsLoading] = useState(true);
    const [tableData, setTableData] = useState<any>(() => {
        fetchAllRadii().then(radii => {
            setTableData(radii);
            setTableDataIsLoading(false);
        });
    });

    const handleRadiiTextInputChange = (event: any) => {
        setRadiiInputxText(event.target.value);
    };

    const handleAddRadius = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (tableData.some((radius: Radius) => radius.radius === radiiInputxText)) {
            alert('Radius already exists!'); // Remove the alert and use maybe a snackbar or better notification
        } else {
            await j.fact(new Radius(radiiInputxText, new Date(), domain));
            fetchAllRadii().then(radii => setTableData(radii));
            // TODO
            // Display sucess message or snackbar
            setOpen(false);
        }
    }

    const handleDeleteRadius = async (radius: Radius) => {
        await j.fact(new RadiusDeleted(radius, new Date()));
        fetchAllRadii().then(radii => setTableData(radii));
    }

    if (tableDataIsLoading) {
        return (
            <div className={classes.loading}>
                <CircularProgress size="3rem" />
            </div>
        )
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                            <DeleteIcon color="secondary" onClick={() => handleDeleteRadius(cellValues.row.radius)} />
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
                <form onSubmit={handleAddRadius}>
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
        </div>
    );
}

export default AdminRadii;