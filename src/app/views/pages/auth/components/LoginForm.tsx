import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Alert } from '@mui/lab';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  CardHeader,
  Divider,
  Card,
} from '@mui/material';
import { loginRequest } from '../../../../../services/authService';

const key = 'token';
const LoginForm: React.FC = () => {
  const [error, setError] = useState('');
  const history = useHistory();

  const saveAuthDetails = (data: { accessToken: string }) => {
    localStorage.setItem(key, data.accessToken);
  };

  const handleFormSubmit = async (values, formikHelpers) => {
    try {
      const data = await loginRequest(values);
      saveAuthDetails(data);
      formikHelpers.resetForm();
      formikHelpers.setStatus({ success: true });
      formikHelpers.setSubmitting(false);
      history.push('dashboard');
    } catch (e) {
      setError(e.message);
      console.error(e.message);
      formikHelpers.setStatus({ success: false });
      formikHelpers.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: 'demo@acme.io',
        password: 'Pass123!',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        password: Yup.string().max(255).required('Password is required'),
      })}
      onSubmit={handleFormSubmit}
    >
      {({
        errors,
        handleBlur,
        handleSubmit,
        handleChange,
        isSubmitting,
        touched,
        values,
      }) => (
        <Card>
          <form noValidate onSubmit={handleSubmit}>
            <CardHeader title="Login" />
            <Divider />
            <Box m={2}>
              <TextField
                fullWidth
                autoFocus
                name="login"
                label="Email Address"
                margin="normal"
                type="email"
                value={values.email}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <TextField
                fullWidth
                autoFocus
                name="password"
                label="Password"
                margin="normal"
                type="password"
                value={values.password}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Box>
            <Box mt={2}>
              <Button
                fullWidth
                type="submit"
                color="primary"
                size="large"
                variant="contained"
                disabled={isSubmitting}
              >
                Log in
              </Button>
            </Box>
            {error && (
              <Box mt={3}>
                <FormHelperText error>{error}</FormHelperText>
              </Box>
            )}
            <Box mt={2}>
              <Alert severity="info">
                <div>
                  Use <b>demo@acme.io</b> and password <b>Pass123!</b>
                </div>
              </Alert>
            </Box>
          </form>
        </Card>
      )}
    </Formik>
  );
};

export default LoginForm;
