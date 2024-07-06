export const docRoute = [
  {
    name: "MANAGER",
    accessRole: ["RECORDS"],
  },
  {
    name: "TL",
    accessRole: ["MANAGER","CH"],
  },
  {
    name: "CH",
    accessRole: ["RECORDS","MANAGER","TL","CH"],
  },
  {
    name:"RECORDS",
    accessRole:["MANAGER"]
  }
];
