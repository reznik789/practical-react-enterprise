import React, { useEffect, useState } from 'react';
import { Container, Backdrop, Box, CircularProgress } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import Header from './Header';
import Results from './Results';
import { deleteProduct, getProductsList } from 'services/productService';
import { ProductType } from 'models/product-type';
import Page from 'app/components/page';

const useStyles = makeStyles(theme =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    root: {
      minHeight: '100%',
      paddingTop: theme.spacing(3),
      paddingBottom: 100,
    },
  }),
);

const ProductListView = () => {
  const classes = useStyles();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      handleToggle();
      try {
        const { data } = await getProductsList();
        setProducts(data);
      } catch (error) {
        alert('Something is wrong.');
      }
      handleClose();
    };
    fetchProducts();
  }, []);

  const deleteProducts = async (productIds: string[]) => {
    const promises = productIds.map(prodId => deleteProduct(prodId));
    const results = await Promise.allSettled(promises);
    const removedIds = results.reduce<string[]>((acc: string[], res, indx) => {
      if (res.status === 'fulfilled') acc.push(productIds[indx]);
      return acc;
    }, []);
    setProducts(products =>
      products.filter(({ id }) => !removedIds.includes(id)),
    );
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(open => !open);
  };

  return (
    <Page className={classes.root} title="Product List">
      <Container maxWidth={false}>
        <Header />
        {products && (
          <Box mt={3}>
            <Results products={products} deleteProducts={deleteProducts}/>
          </Box>
        )}
        <Backdrop
          className={classes.backdrop}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </Page>
  );
};
export default ProductListView;
