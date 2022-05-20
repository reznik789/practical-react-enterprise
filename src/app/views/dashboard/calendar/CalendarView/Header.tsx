import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PlusOne from '@mui/icons-material/AddCircleOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Button,
  Breadcrumbs,
  Grid,
  Link,
  SvgIcon,
  Typography,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

type Props = {
  className?: string;
  onAddClick: () => void;
};

const useStyles = makeStyles(theme => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const Header: React.FC<Props> = ({ className, onAddClick, ...rest }) => {
  const classes = useStyles();
  return (
    <Grid
      component="div"
      className={clsx(classes.root, className)}
      container
      justifyContent="space-between"
      spacing={3}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize={'small'} />}
          aria-label="breadcrumbs"
        >
          <Link
            variant="body1"
            color={'inherit'}
            to={'app'}
            component={RouterLink}
          >
            Dashboard
          </Link>
          <Box>
            <Typography variant="body1" color="inherit">
              Calendar
            </Typography>
          </Box>
        </Breadcrumbs>
        <Typography variant="h4" color="textPrimary">
          Here's what you planned
        </Typography>
      </Grid>
      <Grid item>
        <Button
          color="primary"
          variant="contained"
          onClick={onAddClick}
          className={classes.action}
          startIcon={
            <SvgIcon fontSize="small">
              <PlusOne />
            </SvgIcon>
          }
        >
          New Event
        </Button>
      </Grid>
    </Grid>
  );
};

export default Header;
