export const ROLES = {
  superAdmin: "SUPERADMIN",
  admin: "ADMIN",
  user: "USER",
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
  [ROLES.user]: [
    SCOPES.canView,
    SCOPES.canEdit,
    SCOPES.canCreate,
    SCOPES.canDelete,
  ],
};
