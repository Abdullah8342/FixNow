import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-slate-200 placeholder:text-slate-500 focus-visible:border-slate-300 focus-visible:ring-slate-300/60 aria-invalid:ring-red-200/20 aria-invalid:border-red-400 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-2",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
