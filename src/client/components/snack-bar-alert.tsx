import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar, { SnackbarCloseReason } from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import type { Color } from '@material-ui/lab/Alert'

interface SnackBarAlertProps {
    open: boolean;
    message: string;
    severity?: Color | undefined;
    handleClose: (event: React.SyntheticEvent<Element, Event>) => void
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function SnackBarAlert(props: SnackBarAlertProps) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Snackbar open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
                <Alert onClose={props.handleClose} severity={props.severity ? props.severity : "info"}>
                    {props.message}
                </Alert>
            </Snackbar>
        </div>
    );
}