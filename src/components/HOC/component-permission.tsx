import { useCurrentDivision, useCurrentSection, useCurrentUserRole } from '@/hooks/use-user-hook';
import React from 'react';


interface WithRoleProps {
  roles: string[]; // Array of roles allowed to view the component
  exemptions?: string[]

}

const withRole = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
    const currentUserRole = useCurrentUserRole();
    const currentSection = useCurrentSection();
    const currentDivision = useCurrentDivision();
  return ({ roles,exemptions , ...props }: WithRoleProps & P) => {
    // Check if the user's role is in the list of allowed roles
    if (roles.includes(currentUserRole)) {
      return <WrappedComponent {...props as P} />;
    }
    if(exemptions){
        if(exemptions.includes(currentDivision)){
            return <WrappedComponent {...props as P} />;
        }
        return null
    }
    return null;
  };
};

export default withRole;