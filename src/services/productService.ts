import api, { EndPoints } from '../api/axios';
import { ProductType } from '../models/product-type';
export async function getProductsList() {
  return await api.get<ProductType[]>(EndPoints.products);
}
export async function createProduct(product: ProductType) {
  return await api.post<ProductType>(EndPoints.products, product);
}
export async function deleteProduct(productId: number | string) {
  return await api.delete<ProductType>(`${EndPoints.products}/${productId}`);
}
