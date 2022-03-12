import React, { useState } from 'react';
import { useHistory } from 'react-router';
import clsx from 'clsx';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FilesDropzone from 'app/components/files-dropzone';
import QuillEditor from 'app/components/quill-editor';
import { yupProductValidation } from './yupValidationSchema';
import { productDefaultValue } from './productDefaultValue';
import { touch } from 'shelljs';

const categories = [
  {
    id: 'shirts',
    name: 'Shirts',
  },
  {
    id: 'phones',
    name: 'Phones',
  },
  {
    id: 'cars',
    name: 'Cars',
  },
];

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 400,
    },
  },
}));

type Props = {
  className?: string;
};

const ProductCreateForm: React.FC<Props> = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState('');

  return (
    <Formik
      initialValues={productDefaultValue}
      validationSchema={yupProductValidation}
      onSubmit={(values, formikHelpers) => console.log(values, formikHelpers)}
    >
      {({
        handleSubmit,
        touched,
        errors,
        handleBlur,
        handleChange,
        values,
        isSubmitting,
        setFieldValue,
      }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Product name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                  <Box mt={3} mb={1}>
                    <Typography variant="subtitle2">Description</Typography>
                  </Box>
                  <Paper variant="outlined">
                    <QuillEditor
                      className={classes.editor}
                      value={values.description}
                      onChange={(value: string) =>
                        setFieldValue('description', value)
                      }
                    />
                  </Paper>
                  {touched.description && errors.description && (
                    <Box mt={2}>
                      <FormHelperText error>
                        {errors.description}
                      </FormHelperText>
                    </Box>
                  )}
                </CardContent>
              </Card>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Upload Images" />
                  <Divider />
                  <CardContent>
                    <FilesDropzone />
                  </CardContent>
                </Card>
              </Box>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Set Price" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          error={Boolean(touched.price && errors.price)}
                          helperText={
                            touched.price && errors.price
                              ? errors.price
                              : 'If you have a sale price this will be shown as old price'
                          }
                          label="Price"
                          name="price"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.price}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          error={Boolean(touched.salePrice && errors.salePrice)}
                          helperText={touched.salePrice && errors.salePrice}
                          label="Sale price"
                          name="salePrice"
                          type="number"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.salePrice}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.isTaxable}
                            onChange={handleChange}
                            value={values.isTaxable}
                            name="isTaxable"
                          />
                        }
                        label="Product is taxable"
                      />
                    </Box>
                    <Box mt={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.includesTaxes}
                            onChange={handleChange}
                            value={values.includesTaxes}
                            name="includeTaxes"
                          />
                        }
                        label="Price includes taxes"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader title="Organize" />
                <Divider />
                <CardContent>
                  <TextField
                    select
                    fullWidth
                    SelectProps={{ native: true }}
                    label="Category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </TextField>
                  <Box mt={2}>
                    <TextField
                      error={Boolean(touched.productCode && errors.productCode)}
                      fullWidth
                      helperText={touched.productCode && errors.productCode}
                      label="Product Code"
                      name="productCode"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.productCode}
                      variant="outlined"
                    />
                  </Box>
                  <Box mt={2}>
                    <TextField
                      error={Boolean(touched.productSku && errors.productSku)}
                      fullWidth
                      helperText={touched.productSku && errors.productSku}
                      label="Product Sku"
                      name="productSku"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.productSku}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {error && (
            <Box mt={3}>
              <FormHelperText error>{error}</FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Create product
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default ProductCreateForm;
