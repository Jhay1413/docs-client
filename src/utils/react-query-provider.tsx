import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tsr } from "@/services/tsr";
const queryClient = new QueryClient();
export const ReactQueryProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
};
