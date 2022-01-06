import React from 'react';
import { Grid } from '@mui/material';
import DashboardSidebarNavigation from './dashboard-sidebar-navigation';
interface Props {
  children: React.ReactNode;
}

const Dashboard = ({ children }: Props) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <DashboardSidebarNavigation /> {children}
    </Grid>
  );
};
export default Dashboard;
