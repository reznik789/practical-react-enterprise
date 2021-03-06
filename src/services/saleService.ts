import api, { EndPoints } from 'api/axios';
import { SaleType } from 'models/sale-type';

export async function getSalesList() {
  return await api.get<SaleType[]>(EndPoints.sales);
}
/* Other commonly-used api methods:
  api.post
  api.put
  api.delete
  api.patch
*/
