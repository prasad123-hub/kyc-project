/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cn } from "@/utils";
import { Button } from "./Button";
import { useAuth } from "@/context/AuthContext";
import { SignInButton } from "./SignInButton";
import { useRouter } from "next/router";
import Link from "next/link";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
};

export function Container<T extends React.ElementType = "div">({
  as,
  className,
  children,
}: Omit<React.ComponentPropsWithoutRef<T>, keyof ContainerProps<T>> &
  ContainerProps<T>) {
  let Component = as ?? "div";

  return (
    <Component className={cn("mx-auto max-w-7xl px-6 lg:px-8", className)}>
      <Header />
      <div>{children}</div>
    </Component>
  );
}

const Header = () => {
  const router = useRouter();
  const { logout, user } = useAuth();
  return (
    <div className="flex items-center justify-between py-6 mt-6 border-b">
      <Link href="/">
        <h1 className="text-2xl">
          <span className="font-display font-semibold">Acme</span>Bank.
        </h1>
      </Link>
      <div className="space-x-4">
        {user?.uid ? (
          <>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  router.push(`/dashboard`);
                }}
                className="flex"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="profile_image"
                    className="md:w-5 h-6 md:h-5 w-6 rounded-full object-cover inline-flex md:mr-2 border-[1px] dark:border-white border-zinc-900"
                  />
                ) : null}
                <span className="md:inline-block hidden">
                  {user.displayName?.split(" ")[0] || "Snippng user"}
                </span>
              </Button>
              <Button
                data-testid="logout-btn"
                onClick={() => {
                  const confirm = window.confirm(
                    "Are you sure you want to logout?"
                  );
                  if (confirm) {
                    logout();
                    router.push("/");
                  }
                }}
              >
                <span className="">Logout</span>
              </Button>
            </div>
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  );
};
