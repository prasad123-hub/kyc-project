import Link from "next/link";
import { cn } from "@/utils";

type ButtonProps = {
  invert?: boolean;
  rounded?: boolean;
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<"button"> & { href?: undefined })
);

export function Button({
  invert = false,
  rounded = false,
  className,
  children,
  ...props
}: ButtonProps) {
  className = cn(
    className,
    "inline-flex px-4 py-1.5 text-sm font-semibold transition hover:scale-105",
    invert
      ? "text-neutral-950 hover:bg-neutral-100/70 border border-black"
      : "bg-neutral-950 text-white hover:bg-neutral-800",
    rounded ? "rounded-full" : "rounded-md"
  );

  let inner = <span className="relative top-px">{children}</span>;

  if (typeof props.href === "undefined") {
    return (
      <button className={className} {...props}>
        {inner}
      </button>
    );
  }

  return (
    <Link className={className} {...props}>
      {inner}
    </Link>
  );
}
