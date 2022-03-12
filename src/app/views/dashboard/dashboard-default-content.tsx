import React, { useEffect, useState } from 'react';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { SaleType } from 'models/sale-type';
import { getSalesList } from 'services/saleService';
import { useTheme } from '@mui/system';
import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import Page from 'app/components/page';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
  },
}));

const getChartStyling = (theme: Theme) => ({
  chart: {
    background: theme.palette.background.paper,
    toolbar: {
      show: false,
    },
  },
  colors: ['#13affe', '#fbab49'],
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: theme.palette.divider,
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  legend: {
    show: true,
    labels: {
      colors: theme.palette.text.secondary,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '40%',
    },
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  theme: {
    mode: theme.palette.mode,
  },
  tooltip: {
    theme: theme.palette.mode,
  },
  xaxis: {
    axisBorder: {
      show: true,
      color: theme.palette.divider,
    },
    axisTicks: {
      show: true,
      color: theme.palette.divider,
    },
    categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: {
      style: {
        colors: theme.palette.text.secondary,
      },
    },
  },
  yaxis: {
    axisBorder: {
      show: true,
      color: theme.palette.divider,
    },
    axisTicks: {
      show: true,
      color: theme.palette.divider,
    },
    labels: {
      style: {
        colors: theme.palette.text.secondary,
      },
    },
  },
});

const DashboardDefaultContent = () => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [sales, setSales] = useState<SaleType[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadSales = async () => {
      const { data: sales } = await getSalesList();
      isMounted && setSales(sales);
    };
    loadSales();
    return () => {
      isMounted = false;
    };
  }, []);

  console.log(sales);

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={'sm'}>
        <Typography variant="h4" color="textPrimary">
          Dashboard
        </Typography>
        <Box my={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" color="textPrimary">
                    Sales
                  </Typography>
                  <Chart
                    options={getChartStyling(theme)}
                    series={sales}
                    type="bar"
                    height={'100%'}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default DashboardDefaultContent;
