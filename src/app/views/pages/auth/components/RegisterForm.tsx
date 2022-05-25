import React, { useState } from 'react';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { Formik, FormikHandlers, FormikHelpers } from 'formik';
import { Alert } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { registerRequest } from '../../../../../services/authService';

const key = 'token';

const RegisterForm: React.FC = () => {
  const [error, setError] = useState('');
  const history = useHistory();
  const [isAlertVisible, setAlertVisible] = useState(false);

  const saveUserAuthDetails = (data: { accessToken: string }) => {
    localStorage.setItem(key, data.accessToken);
  };

  const handleSubmit = async (values, formikHelpers: FormikHelpers<any>) => {
    try {
      const data = await registerRequest(values);
      saveUserAuthDetails(data);
      formikHelpers.resetForm();
      formikHelpers.setStatus({ success: true });
      formikHelpers.setSubmitting(false);
      setError('');
      setAlertVisible(false);
      history.push('dashboard');
    } catch (e) {
      setError(e.message);
      setAlertVisible(true);
      formikHelpers.setStatus({ success: false });
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: 'johndoe@yahoo.com',
        name: 'John',
        mobile: '+34782364823',
        password: 'Pass123!',
        policy: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email!')
          .max(255)
          .required('Email is required'),
        name: Yup.string().max(255).required('Name is required'),
        mobile: Yup.string().min(10).required('Mobile is required'),
        password: Yup.string()
          .min(7, 'Must be at least 7 characters')
          .max(255)
          .required('Required'),
        policy: Yup.boolean().oneOf(
          [true],
          'You need to agreed with policy to continue',
        ),
      })}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        values,
        handleSubmit,
        handleChange,
        handleBlur,
        isSubmitting,
        touched,
      }) => (
        <Card>
          <CardHeader title="Register Form" />
          <Divider />
          <CardContent>
            {isAlertVisible && (
              <Alert onClose={() => setAlertVisible(false)} severity="info">
                {error}
              </Alert>
            )}
            {isSubmitting ? (
              <Box display="flex" justifyContent="center" my={5}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Name"
                      variant="outlined"
                      value={values.name}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name="mobile"
                      label="Mobile"
                      variant="outlined"
                      value={values.mobile}
                      error={Boolean(touched.mobile && errors.mobile)}
                      helperText={touched.mobile && errors.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Email"
                    variant="outlined"
                    value={values.email}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Box>
                <Box mt={2}>
                  <TextField
                    fullWidth
                    type="password"
                    name="password"
                    label="Password"
                    variant="outlined"
                    value={values.password}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Box>
                <Box ml={1}>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      name="policy"
                      checked={values.policy}
                      onChange={handleChange}
                    />
                    <Typography variant="body2" color="textSecondary">
                      I have read the{' '}
                      <Link href="#" color="secondary">
                        Terms and Conditions
                      </Link>
                    </Typography>
                  </Box>
                  <Box ml={1}>
                    {' '}
                    {Boolean(touched.policy && errors.policy) && (
                      <FormHelperText error>{errors.policy}</FormHelperText>
                    )}
                  </Box>
                </Box>
                <Box>
                  <form onSubmit={handleSubmit}>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Sign up
                    </Button>
                  </form>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Formik>
  );
};

export default RegisterForm;
