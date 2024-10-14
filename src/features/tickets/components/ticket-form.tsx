import { useState } from "react";

interface TicketFormProps {
  onSubmit: (data: any) => void;
}

const TicketForm = ({ onSubmit }: TicketFormProps) => {
  const [ticketId, setTicketId] = useState("");
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      ticketId,
      subject,
      section,
      status,
      remarks,
      createdAt,
      updatedAt,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Ticket ID:
        <input type="text" value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
      </label>
      <br />
      <label>
        Subject:
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <br />
      <label>
        Section:
        <input type="text" value={section} onChange={(e) => setSection(e.target.value)} />
      </label>
      <br />
      <label>
        Status:
        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
      </label>
      <br />
      <label>
        Remarks:
        <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      </label>
      <br />
      <label>
        Created At:
        <input type="datetime-local" value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} />
      </label>
      <br />
      <label>
        Updated At:
        <input type="datetime-local" value={updatedAt} onChange={(e) => setUpdatedAt(e.target.value)} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default TicketForm;