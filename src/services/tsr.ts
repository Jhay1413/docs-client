import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import {companyContract, contracts, transactionContract} from "shared-contract"

export const tsr = initTsrReactQuery(contracts, {
  baseUrl: 'http://localhost:3001',
});
