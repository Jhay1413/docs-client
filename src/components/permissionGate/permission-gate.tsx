import React from "react";
import { PERMISSIONS } from "./permission-map";
import { useCurrentUserRole } from "@/hooks/hooks/use-user-hook";

type THasPermission = {
  permissions: string[];
  scopes: string[];
};
const hasPermission = ({ permissions, scopes } : THasPermission) => {
  const scopesMap: { [key: string]: boolean } = {};
  scopes.forEach((scope) => {
    scopesMap[scope] = true;
  });

  return permissions.some((permission) => scopesMap[permission]);
};

type TPermissionsGate = {
  children: React.ReactNode;
  scopes: string[];
};
export default function PermissionsGate({
  children,
  scopes = [],
}: TPermissionsGate) {
  const role = useCurrentUserRole();
  const permissions = PERMISSIONS[role];
  
  const permissionGranted = hasPermission({ permissions, scopes });

  if (!permissionGranted) return <></>;

  return <>{children}</>;
}
