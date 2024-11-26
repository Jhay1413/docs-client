import React from "react";

type Permit = {
  name: string;
  status: string;
  link?: string; // Optional, in case a permit doesn't have a link.
};

type PermitsCardProps = {
  permits: Permit[];
};

const PermitsCard: React.FC<PermitsCardProps> = ({ permits }) => {
  return (
    <div className="p-6 rounded-lg shadow-md">
      <table className="table-auto w-full border-collapse border border-white">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border border-white p-2">Permit</th>
            <th className="border border-white p-2">Status</th>
            <th className="border border-white p-2">Links</th>
          </tr>
        </thead>
        <tbody>
          {permits.map((permit, index) => (
            <tr key={index} className="bg-white text-center">
              <td className="p-4">{permit.name}</td>
              <td className="p-4">{permit.status}</td>
              <td className="p-4">
                {permit.link ? (
                  <a
                    href={permit.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermitsCard;
