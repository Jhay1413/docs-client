import React from "react";

type DetailsCardProps = {
  data: {
    projectName: string;
    caseHandler: string;
    nda: string;
    companyName: string;
    companyContactNumber: string;
    companyEmail: string;
    contactNumber: string;
    contactEmail: string;
    companyAddress: string;
  };
};

const DetailsCard: React.FC<DetailsCardProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-4 gap-8 bg-white p-6 rounded-lg shadow-md">
      <div>
        <p className="font-bold">Project Name:</p>
        <p>{data.projectName}</p>
      </div>
      <div>
        <p className="font-bold">Company Name:</p>
        <p>{data.companyName}</p>
      </div>
      <div>
        <p className="font-bold">Company Contact Number:</p>
        <p>{data.companyContactNumber}</p>
      </div>
      <div>
        <p className="font-bold">Company Email:</p>
        <p>{data.companyEmail}</p>
      </div>
      <div>
        <p className="font-bold">NDA:</p>
        <p>{data.nda}</p>
      </div>
      <div>
        <p className="font-bold">Case Handler:</p>
        <p>{data.caseHandler}</p>
      </div>
      <div>
        <p className="font-bold">Contact Number:</p>
        <p>{data.contactNumber}</p>
      </div>
      <div>
        <p className="font-bold">Contact Email:</p>
        <p>{data.contactEmail}</p>
      </div>
      <div className="col-span-4">
        <p className="font-bold">Company Address:</p>
        <p>{data.companyAddress}</p>
      </div>
    </div>
  );
};

export default DetailsCard;
