import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Layout from './layout';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      minHeight: '600px'
    },
  }),
);

export default function UserGuitarView() {
  const classes = useStyles();

  return (
    <Layout header="Some Awesome Guitar">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Paper className={classes.paper}><a href="https://placeholder.com"><img src="https://via.placeholder.com/350x560"></img></a></Paper>
          </Grid>
          <Grid item xs={12} lg={9}>
            <Paper className={classes.paper}>xs=12 sm=6</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>xs=6 sm=3</Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>xs=6 sm=3</Paper>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}