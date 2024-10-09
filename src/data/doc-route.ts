export const docRoute = [
  {
    name: "MANAGER",
    accessRole: ["RECORDS", "TL"],
  },
  {
    name: "TL",
    accessRole: ["MANAGER", "CH"],
  },
  {
    name: "CH",
    accessRole: ["TL"],
  },
  {
    name: "FINANCE",
    accessRole: ["ADMIN", "CH"],
  },
  {
    name: "ADMIN",
    accessRole: ["RECORDS"],
  },
  {
    name: "DMS",
    accessRole: ["FINANCE", "MANAGER"],
  },
  {
    name: "RECORDS",
    accessRole: ["MANAGER", "QA", "DMS"],
  },
];
