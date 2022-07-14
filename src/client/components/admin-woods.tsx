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
    const [woodsInputxText, setWoodsInputxText] = useState('');
    const [tableDataIsLoading, setTableDataIsLoading] = useState(true);
    const [tableData, setTableData] = useState<Wood[]>([]);
    const [checkBoxStates, setCheckBoxStates] = React.useState({
        checkedBody: true,
        checkedNeck: false,
        checkedLaminatedTop: false,
    });

    useEffect(() => {
        fetchAllWoods().then(woods => {
            setTableData(woods);
            setTableDataIsLoading(false);
        });
    })

    const handleChangeCheckBoxes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBoxStates({ ...checkBoxStates, [event.target.name]: event.target.checked });
    };

    const handleWoodsTextInputChange = (event: any) => {
        setWoodsInputxText(event.target.value);
    };

    const handleAddWood = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (tableData.some((wood: Wood) => wood.wood.toLowerCase() === woodsInputxText.toLowerCase())) {
            alert('Wood already exists!'); // Remove the alert and use maybe a snackbar or better notification
        } else {
            const isNeckChecked = checkBoxStates.checkedNeck;
            const isBodyChecked = checkBoxStates.checkedBody;
            const isLaminatedTopChecked = checkBoxStates.checkedLaminatedTop;
            await j.fact(new Wood(woodsInputxText, isNeckChecked, isBodyChecked, isLaminatedTopChecked, new Date(), domain));
            fetchAllWoods().then(woods => setTableData(woods));
            // TODO
            // Dispatch "success message or snackbar"
            setOpen(false);
        }
    }

    const handleDeleteWood = async (wood: Wood) => {
        await j.fact(new WoodDeleted(wood, new Date()));
        fetchAllWoods().then(woods => setTableData(woods));
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
            checkedBody: true,
            checkedNeck: false,
            checkedLaminatedTop: false,
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
            field: "Delete",
            renderCell: (cellValues: any) => {
                return (
                    <>
                        <IconButton>
                            <DeleteIcon color="secondary" onClick={() => handleDeleteWood(cellValues.row.wood)} />
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
                        wood: row
                    }
                })}
                columns={columns}
                pageSize={10}
            />
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
                <form onSubmit={handleAddWood}>
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
        </div>
    );
}

export default AdminWoods;