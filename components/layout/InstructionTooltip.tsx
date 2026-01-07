import React from "react"

export function InstructionTooltip() {
  return (
    <div className="hidden lg:block absolute bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
       <div className="px-6 py-2.5 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 text-[11px] font-bold rounded-full shadow-lg backdrop-blur-sm border border-slate-200/10 dark:border-slate-800/10 flex items-center gap-3">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[8px]">i</span>
          Click AST nodes to highlight code in the editor
       </div>
    </div>
  )
}
