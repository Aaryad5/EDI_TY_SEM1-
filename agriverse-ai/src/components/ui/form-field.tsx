import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-dark/50">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}

type FormSectionProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function FormSection({ title, description, icon, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-agri/10 text-agri">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-dark">{title}</h3>
          {description && <p className="text-xs text-dark/50">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

type InfoRowProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={cn("flex items-center justify-between py-1.5 text-sm", className)}>
      <span className="text-dark/55">{label}</span>
      <span className="font-medium text-dark">{value}</span>
    </div>
  );
}