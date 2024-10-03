import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { companyContract, contracts, transactionContract } from "shared-contract";
// const mode = import.meta.env.VITE_MODE;
// const dev = import.meta.env.VITE_DEV_API;
// const prod = import.meta.env.VITE_PROD_API;
// const local = import.meta.env.VITE_LOCAL_API;
export const tsr = initTsrReactQuery(contracts, {
  baseUrl: "https://dts-dev.onrender.com",
});
