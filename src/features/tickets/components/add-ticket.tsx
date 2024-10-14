import TicketForm from "./ticket-form";

const TicketAdd = () => {
  const handleSubmit = (data: any) => {
    // Add the ticket data to your database or API
    console.log("Ticket added:", data);
  };

  return (
    <div>
      <h1>Add Ticket</h1>
      <TicketForm onSubmit={handleSubmit} />
    </div>
  );
};

export default TicketAdd;