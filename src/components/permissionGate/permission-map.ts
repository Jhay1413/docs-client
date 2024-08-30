export const ROLES = {
  superAdmin: "SUPERADMIN",
  admin: "ADMIN",
  user: "USER",
  TL:"TL",
  CH:"CH",
  MANAGER:"MANAGER",
  RECORDS:"RECORDS",
  QA:"QA",
  GUEST:"GUEST"
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
  [ROLES.QA] : [SCOPES.canView],
  // [ROLES.user]: [
  //   SCOPES.canView,
  //   SCOPES.canEdit,
  //   SCOPES.canCreate,  
  //   SCOPES.canDelete,
  // ],
  [ROLES.TL] : [SCOPES.canView],
  [ROLES.CH] :[SCOPES.canView],
  [ROLES.MANAGER]:[SCOPES.canView],
  [ROLES.CH]:[SCOPES.canView],
  [ROLES.GUEST]:[SCOPES.canView],
  [ROLES.RECORDS]:[SCOPES.canCreate,SCOPES.canView]
};
