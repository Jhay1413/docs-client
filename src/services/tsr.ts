import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { initClient } from "@ts-rest/core";
import { contracts } from "shared-contract";
// const mode = import.meta.env.VITE_MODE;
const endpoint = import.meta.env.VITE_ENDPOINT;
// const prod = import.meta.env.VITE_PROD_API;
// const local = import.meta.env.VITE_LOCAL_API;

export const client = initClient(contracts, {
  baseUrl: endpoint,
  baseHeaders: {},
  // Uses `tsRestFetchApi` by default
});
export const tsr = initTsrReactQuery(contracts, {
  // baseUrl: "https://dts-dev.onrender.com",
  baseUrl: endpoint,
  credentials: "include",
  queryClientConfig: {
    defaultOptions: {
      queries: {
        onError: (error: any) => {
          if (error.status === 403) {
            console.log("roles");
          }
        }, // Set your global error handler for queries
      },
    },
  },
});
