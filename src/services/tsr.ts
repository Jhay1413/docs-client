import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { companyContract, contracts, transactionContract } from "shared-contract";
const mode = import.meta.env.VITE_MODE;
export const tsr = initTsrReactQuery(contracts, {
  baseUrl: mode === "PROD" ? import.meta.env.VITE_PROD_API : mode === "DEV" ? import.meta.env.VITE_DEV_API : import.meta.env.VITE_LOCAL_API,
});
