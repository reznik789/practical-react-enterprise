import React from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { Formik, FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';
import { DateTimePicker } from '@mui/lab';
import TrashIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormHelperText,
  IconButton,
  SvgIcon,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  createEvent,
  deleteEvent,
  updateEvent,
  RangeType,
} from 'features/calendar/calendarSlice';
import { EventType } from 'models/calendar-type';

type Props = {
  event: EventType | null;
  onAddComplete?: () => void;
  onCancel?: () => void;
  onDeleteComplete?: () => void;
  onEditComplete?: () => void;
  range: RangeType | null;
};

const useStyles = makeStyles(theme => ({
  root: {},
  confirmButton: {
    marginLeft: theme.spacing(2),
  },
}));

const AddEditEventForm: React.FC<Props> = ({
  event,
  onAddComplete,
  onDeleteComplete,
  onCancel,
  onEditComplete,
  range,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const isCreating = !event;
  const handleDelete = async (): Promise<void> => {
    if (!event) return;
    try {
      await dispatch(deleteEvent(event.id));
      onDeleteComplete?.();
    } catch (e) {
      console.error(e);
    }
  };

  const getInitialValues = (
    event: EventType | null = null,
    range: { start: number; end: number } | null = null,
  ) => {
    const defaultValue = {
      allDay: false,
      color: '',
      description: '',
      start: moment().toDate(),
      end: moment().add(30, 'minutes').toDate(),
      title: '',
      submit: null,
    };
    if (event) return { ...defaultValue, ...event };
    if (range)
      return {
        ...defaultValue,
        start: new Date(range.start),
        end: new Date(range.end),
      };
    return defaultValue;
  };

  const onSubmitHandler = async (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }: FormikHelpers<any>,
  ) => {
    try {
      const data = {
        allDay: values.allDay,
        description: values.description,
        start: values.start,
        end: values.end,
        title: values.title,
        id: '',
      };
      if (event) {
        data.id = event.id;
        dispatch(updateEvent(data));
      } else {
        dispatch(createEvent(data));
      }
      resetForm();
      setStatus({ success: true });
      setSubmitting(false);
      enqueueSnackbar('Calendar updated', {
        variant: 'success',
      });
      isCreating ? onAddComplete?.() : onEditComplete?.();
    } catch (error) {
      console.error(error);
      setStatus({ success: false });
      setErrors({ submit: error.message });
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={getInitialValues(event, range)}
      validationSchema={Yup.object().shape({
        allDay: Yup.bool(),
        description: Yup.string().max(5000),
        start: Yup.date(),
        end: Yup.date().when(
          'start',
          (start: Date, schema: any) =>
            start &&
            schema.min(start, 'End date must be later than start date'),
        ),
      })}
      onSubmit={onSubmitHandler}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldTouched,
        setFieldError,
        setFieldValue,
        touched,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box px={3} mt={2}>
            <Typography
              align="center"
              gutterBottom
              variant="h3"
              color="textPrimary"
            >
              {isCreating ? 'Add Event' : 'Edit Event'}
            </Typography>
          </Box>
          <Box px={3} mt={2}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title}
              variant="outlined"
            />
          </Box>
          <Box px={3} mt={2}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={values.description}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
              onBlur={handleBlur}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          <Box px={3} mt={2}>
            <FormControlLabel
              control={
                <Switch
                  name="allDay"
                  value={values.allDay}
                  onChange={handleChange}
                />
              }
              label="All day"
            />
          </Box>
          <Box px={3} mt={2}>
            <DateTimePicker
              value={values.start}
              onChange={date => setFieldValue('start', date)}
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  name="start"
                  label="Start Date"
                  onClick={() => setFieldTouched('start')}
                  variant="outlined"
                />
              )}
            />
          </Box>
          <Box px={3} mt={2}>
            <DateTimePicker
              value={values.end}
              onChange={date => setFieldValue('end', date)}
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  name="end"
                  label="End Date"
                  onClick={() => setFieldTouched('end')}
                  variant="outlined"
                  error={Boolean(touched.end && errors.end)}
                  helperText={touched.end && errors.end}
                />
              )}
            />
          </Box>
          <Divider />
          <Box p={2} display="flex" alignItems="center">
            {!isCreating && (
              <IconButton onClick={handleDelete}>
                <SvgIcon>
                  <TrashIcon />
                </SvgIcon>
              </IconButton>
            )}
            <Box flexGrow={1} />
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              color="primary"
              className={classes.confirmButton}
            >
              Confirm
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AddEditEventForm;
