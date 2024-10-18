import { useForm, FormProvider } from "react-hook-form";
import TicketForm from "./ticket-form"; // Assuming this is where you're using useFormContext()

const TicketFormWrapper = () => {
  const methods = useForm(); // Initialize useForm here

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <TicketForm />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default TicketFormWrapper;
