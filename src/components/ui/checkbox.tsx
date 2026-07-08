"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-md border border-gray-200 bg-white shadow-xs",
        "transition-all duration-200 outline-none",
        "hover:border-primary/40 hover:bg-primary/5",
        "focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/10",
        "data-[state=checked]:rounded-full data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-sm",
        "data-[state=checked]:hover:border-primary data-[state=checked]:hover:bg-primary",
        "dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        "dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary",
        "aria-invalid:border-red-300 aria-invalid:focus-visible:border-red-300 aria-invalid:focus-visible:ring-red-100",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current animate-in zoom-in-75 duration-150"
      >
        <CheckIcon className="size-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
