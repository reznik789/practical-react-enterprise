import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const useStyles = makeStyles(() => ({
  root: {},
}));

type Props = {
  className?: string;
};

const Header: React.FC<Props> = ({ className, ...rest }) => {
  const classes = useStyles();
  return (
    <Grid
      component="div"
      container
      justifyContent="space-between"
      spacing={3}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" aria-label="breadcrumb" />
          }
        >
          <Link
            variant="body1"
            color="inherit"
            to="/dashboard"
            component={RouterLink}
          >
            Dashboard
          </Link>
          <Box mb={3}>
            <Typography variant="body1" color="inherit">
              Create Product
            </Typography>
          </Box>
        </Breadcrumbs>
        <Typography variant="h4" color="textPrimary">
          Create a new product
        </Typography>
      </Grid>
      <Grid item>
        <Button component={RouterLink} to="/dashboard/list-products">
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default Header;
