
import FormSelector from "./form-selector";

export const RequestForms = () => {
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full bg-white">
      <h1 className="text-4xl">Admin Request Forms</h1>
      <FormSelector />
    </div>
  );
};

export default RequestForms;