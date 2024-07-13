export const docRoute = [
  {
    name: "MANAGER",
    accessRole: ["RECORDS","TL"],
  },
  {
    name: "TL",
    accessRole: ["MANAGER","CH"],
  },
  {
    name: "CH",
    accessRole: ["TL"],
  },
  {
    name:"RECORDS",
    accessRole:["MANAGER"]
  }
];
