import React, { ReactNode } from 'react';
import { makeStyles } from '@mui/styles';
import NavigationBar from './navigation-bar';

const useStyles = makeStyles(theme => {
  console.log('theme', theme);
  return {
    root: {
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      width: '100%',
      flexDirection: 'column',
    },
    wrapper: {
      display: 'flex',
      flex: '1 1 auto',
      overflow: 'hidden',
    },
    contentContainer: {
      display: 'flex',
      flex: '1 1 auto',
      overflow: 'hidden',
    },
    content: {
      flex: '1 1 auto',
      height: '100%',
      overflow: 'auto',
    },
  };
});

type Props = {
  children?: ReactNode;
};

const MainLayout = ({ children }: Props) => {
  const classes = useStyles();
  return (
    <>
      <NavigationBar />
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.content}>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
