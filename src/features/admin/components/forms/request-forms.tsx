
import FormSelector from "./form-selector";

export const RequestForms = () => {
  return (
    <div className="min-h-full flex flex-col w-full items-center p-4 bg-white rounded-lg ">
      <div className="flex flex-col w-full items-center justify-center p-4 bg-white rounded-lg">
        <div className="flex justify-start w-full flex-col">
          <h1 className="text-[#404041] font-medium text-[28px]">Admin Request Forms</h1>
          <p className="text-muted-foreground text-[12px] truncate">
            Select a form below to initiate your request. Each form is tailored to help you efficiently manage specific administrative requests.
          </p>
          <FormSelector />
        </div>
      </div>
    </div>
  );
};

export default RequestForms;