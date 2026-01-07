import React, { memo } from "react"
import { Tree } from "web-tree-sitter"
import { ASTNodeView } from "./ASTNodeView"
import { NodeRange } from "../../types"

interface Props {
  ast: Tree | null
  isLoading: boolean
  code: string
  onSelect: (range: NodeRange) => void
  selectedRange: NodeRange | null
}

export const ASTTreeView = memo(({ ast, isLoading, code, onSelect, selectedRange }: Props) => {
  const isEmpty = code.trim() === ""

  return (
    <div className="flex flex-col flex-1 h-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative">
      <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100 bg-slate-50/40 flex justify-between items-center shrink-0">
        <h2 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Syntax Tree</h2>
        <div className="px-1.5 lg:px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] lg:text-[9px] font-black rounded uppercase">Live</div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 lg:p-6 font-mono custom-scrollbar">
        {ast && !isLoading ? (
          <div className="min-w-max pb-20">
            <ASTNodeView 
              node={ast.rootNode} 
              depth={0} 
              onSelect={onSelect}
              selectedRange={selectedRange}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 lg:p-12 opacity-50">
            <div className="w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-slate-400 rounded-full animate-spin mb-4 lg:mb-6" />
            <p className="text-xs lg:text-sm font-bold tracking-tight text-slate-500">
              {isLoading ? "Loading..." : "Parsing..."}
            </p>
          </div>
        )}
        
        {isEmpty && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12 text-center bg-white/50 backdrop-blur-sm z-10">
             <div className="max-w-xs">
                <p className="text-base lg:text-lg font-bold text-slate-300 mb-2">Empty</p>
                <p className="text-[10px] lg:text-xs text-slate-400">The Abstract Syntax Tree will appear here as soon as you start typing.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  )
})

ASTTreeView.displayName = "ASTTreeView"
