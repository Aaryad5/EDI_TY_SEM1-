"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type StepperStep = {
  title: string;
  description?: string;
};

type StepperProps = {
  steps: StepperStep[];
  current: number;
  onSelect?: (index: number) => void;
  className?: string;
};

export function Stepper({ steps, current, onSelect, className }: StepperProps) {
  return (
    <ol className={cn("flex w-full items-start", className)}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const isLast = i === steps.length - 1;
        return (
          <li key={step.title} className={cn("flex items-start", !isLast && "flex-1")}>
            <div className="flex flex-col items-center">
              <button
                type="button"
                disabled={!onSelect}
                onClick={() => onSelect?.(i)}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all cursor-default",
                  done && "border-agri bg-agri text-white",
                  active && "border-fresh bg-white text-agri shadow-md ring-4 ring-fresh/25",
                  !done && !active && "border-agri/25 bg-white text-dark/40"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </button>
              <motion.div
                animate={{ opacity: active || done ? 1 : 0.6 }}
                className="mt-2 hidden text-center sm:block"
              >
                <p
                  className={cn(
                    "text-xs font-semibold",
                    active ? "text-agri" : "text-dark/60"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="mt-0.5 max-w-[120px] text-[11px] text-dark/40">
                    {step.description}
                  </p>
                )}
              </motion.div>
            </div>
            {!isLast && (
              <div className="relative mx-2 mt-4 hidden flex-1 sm:block">
                <div className="h-0.5 w-full overflow-hidden rounded bg-agri/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-agri to-fresh"
                    initial={false}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}