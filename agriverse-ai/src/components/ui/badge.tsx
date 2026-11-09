import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-agri text-white",
        secondary: "border-transparent bg-lightgreen text-forest",
        outline: "border-agri/25 text-dark",
        soft: "border-transparent bg-agri/10 text-agri",
        success: "border-fresh/30 bg-fresh/15 text-fresh",
        warning: "border-amber-300 bg-amber-100 text-amber-800",
        destructive: "border-red-300 bg-red-100 text-red-800",
        info: "border-sky-300 bg-sky-100 text-sky-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };