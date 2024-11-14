import { useCurrentDivision, useCurrentSection, useCurrentUserRole } from "@/hooks/use-user-hook";
import { LucideProps } from "lucide-react";
import React, { ComponentType, ElementType, ForwardRefExoticComponent } from "react";

export interface WithRoleProps {
  roles?: string[]; // Array of roles allowed to view the componen
  exemptions?: string[];
  className?: string;
  Icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  label?: string;
  callbackFn?: () => void;
}

const withRole = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const currentUserRole = useCurrentUserRole();
  console.log(currentUserRole);
  const currentSection = useCurrentSection();
  const currentDivision = useCurrentDivision();
  return ({ roles, exemptions, className, Icon, label, callbackFn, ...props }: WithRoleProps & P) => {
    if (!roles) {
      return null;
    }
    // Check if the user's role is in the list of allowed roles
    if (roles.includes(currentUserRole)) {
      return (
        <WrappedComponent
          Icon={Icon} // Also pass the icon here
          label={label}
          className={className}
          callbackFn={callbackFn}
          {...(props as P)}
        />
      );
    }
    if (exemptions) {
      if (exemptions.includes(currentDivision)) {
        return (
          <WrappedComponent
            Icon={Icon} // Also pass the icon here
            label={label}
            className={className}
            callbackFn={callbackFn}
            {...(props as P)}
          />
        );
      }
      return null;
    }
    return null;
  };
};

export default withRole;
