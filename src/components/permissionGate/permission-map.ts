export const ROLES = {
  superAdmin: "SUPERADMIN",
  admin: "ADMIN",
  user: "USER",
  TL:"TL",
  CH:"CH",
  MANAGER:"MANAGER",
  RECORDS:"RECORDS"
};

export const SCOPES = {
  canCreate: "can-create",
  canEdit: "can-edit",
  canDelete: "can-delete",
  canView: "can-view",
};

export const PERMISSIONS = {
  [ROLES.superAdmin]: [SCOPES.canView],
  [ROLES.admin]: [SCOPES.canView, SCOPES.canEdit],
  // [ROLES.user]: [
  //   SCOPES.canView,
  //   SCOPES.canEdit,
  //   SCOPES.canCreate,
  //   SCOPES.canDelete,
  // ],
  [ROLES.MANAGER]:[SCOPES.canView],
  [ROLES.RECORDS]:[SCOPES.canCreate,SCOPES.canView]
};
