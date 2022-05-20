import React, { ElementType, ReactNode } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import {
  Button,
  ButtonGroup,
  Grid,
  Hidden,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ViewConfigIcon from '@mui/icons-material/ViewComfyOutlined';
import ViewWeekIcon from '@mui/icons-material/ViewWeekOutlined';
import ViewDayIcon from '@mui/icons-material/ViewDayOutlined';
import ViewAgendaIcon from '@mui/icons-material/ViewAgendaOutlined';
import { ViewType } from 'models/calendar-type';

type ViewOption = {
  label: string;
  value: ViewType;
  icon: ElementType;
};

type Props = {
  children?: ReactNode;
  className?: string;
  date: Date;
  onDateNext?: () => void;
  onDatePrev?: () => void;
  onDateToday?: () => void;
  onAddClick?: () => void;
  onViewChange?: (view: ViewType) => void;
  view: ViewType;
};

const useStyles = makeStyles(() => ({
  root: {},
}));

const viewOptions: ViewOption[] = [
  {
    label: 'Month',
    value: 'dayGridMonth',
    icon: ViewConfigIcon,
  },
  {
    label: 'Week',
    value: 'timeGridWeek',
    icon: ViewWeekIcon,
  },
  {
    label: 'Day',
    value: 'timeGridDay',
    icon: ViewDayIcon,
  },
  {
    label: 'Agenda',
    value: 'listWeek',
    icon: ViewAgendaIcon,
  },
];

const Toolbar: React.FC<Props> = ({
  view,
  date,
  className,
  onAddClick,
  onDateNext,
  onDatePrev,
  onDateToday,
  onViewChange,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <Grid
      component="div"
      className={clsx(classes.root, className)}
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
      {...rest}
    >
      <Grid item>
        <ButtonGroup size="small">
          <Button onClick={onDatePrev}>Prev</Button>
          <Button onClick={onDateToday}>Today</Button>
          <Button onClick={onDateNext}>Next</Button>
        </ButtonGroup>
      </Grid>
      <Hidden smDown>
        <Grid item>
          <Typography variant="h3" color="textPrimary">
            {moment(date).format('MMMM YYYY')}
          </Typography>
        </Grid>
        <Grid item>
          {viewOptions.map(({ label, value, icon }) => {
            const Icon = icon;
            return (
              <Tooltip title={label} key={value}>
                <IconButton
                  color={value === view ? 'primary' : 'default'}
                  onClick={() => {
                    onViewChange && onViewChange(value);
                  }}
                >
                  <Icon />
                </IconButton>
              </Tooltip>
            );
          })}
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default Toolbar;
