import { write } from "fs";

const configuration = [
    {
      name: "SUPERADMIN",
      permission: {
        read: true,
        write: false,
        update: false,
        delete: false,
        sidebarMenu: {
          dashboard: true,
          reports: false,
          settings: true,
        },
      },
    },
    {
      name: "MANAGER",
      permission: {
        module: {
          userList: {
            read:true,
            write:false,
            update:false,
            delete:false,
          },
          settings: false,
        },
      },
    },
    // more permission objects...
  ];