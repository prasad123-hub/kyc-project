import { Container } from "@/components/Container";
import { useAuth } from "@/context/AuthContext";

import { ComponentType } from "react";

/**
 * @function withAuth (HOC)
 * @description Handles the authentication logic and returns the wrapped `Component` if the user is `authenticated` else renders signin button
 */
const withAuth = <T extends Object>(Component: ComponentType<T>) => {
  const InnerComponent = (props: T) => {
    const { user } = useAuth();
    if (!user)
      return (
        <Container>
          <div className="w-full flex justify-center items-center">
            <h1>Please Sign in to continue ..</h1>
          </div>
        </Container>
      );

    return <Component {...props} />;
  };
  return InnerComponent;
};

export default withAuth;
