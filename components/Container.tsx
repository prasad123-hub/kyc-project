import React from "react";
import { cn } from "@/utils";
import { Button } from "./Button";

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
  return (
    <div className="flex items-center justify-between py-6 mt-6">
      <h1 className="text-2xl">
        <span className="font-display font-semibold">Acme</span>Bank.
      </h1>
      <Button rounded>SignIn</Button>
    </div>
  );
};
