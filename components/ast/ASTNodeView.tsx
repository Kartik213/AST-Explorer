import React, { useState } from "react"
import { NodeRange } from "../../types"

interface Props {
  node: any
  depth: number
  onSelect: (range: NodeRange) => void
  selectedRange: NodeRange | null
}

export function ASTNodeView({ node, depth, onSelect, selectedRange }: Props) {
  const [isOpen, setIsOpen] = useState(depth < 2)
  const hasChildren = node.childCount > 0
  const isSelected = selectedRange && selectedRange.start === node.startIndex && selectedRange.end === node.endIndex

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect({ 
      start: node.startIndex, 
      end: node.endIndex,
      startPos: { row: node.startPosition.row, column: node.startPosition.column },
      endPos: { row: node.endPosition.row, column: node.endPosition.column }
    })
    if (hasChildren && !isOpen) setIsOpen(true)
  }

  const toggleOpen = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.stopPropagation()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={`flex flex-col ${depth > 0 ? "ml-3 lg:ml-4 border-l border-slate-100 dark:border-slate-800/50" : ""}`}>
      <div
        className={`flex items-center gap-1.5 lg:gap-2 px-1.5 lg:px-2 py-1.5 lg:py-1 cursor-pointer transition-all rounded-md group m-0.5 ${
          isSelected 
            ? "bg-blue-500/10 dark:bg-blue-400/20 ring-1 ring-blue-500/30 dark:ring-blue-400/30 shadow-sm" 
            : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
        onClick={handleSelect}
      >
        <span 
          className={`text-[9px] lg:text-[10px] w-4 h-4 flex justify-center items-center transition-transform duration-200 ${hasChildren ? "opacity-40 group-hover:opacity-100" : "opacity-0"} ${isOpen ? "rotate-0" : "-rotate-90"}`}
          onClick={toggleOpen}
        >
          ▼
        </span>
        <span className={`font-mono text-[12px] lg:text-[13px] ${isSelected ? "text-blue-600 dark:text-blue-300 font-bold" : "text-slate-600 dark:text-slate-400"}`}>
          {node.type}
        </span>
        <span className="hidden md:block text-[9px] lg:text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {node.startPosition.row + 1}:{node.startPosition.column}
        </span>
      </div>
      {isOpen && hasChildren && (
        <div className="flex flex-col">
          {node.children.map((child: any, i: number) => (
            <ASTNodeView 
              key={i} 
              node={child} 
              depth={depth + 1} 
              onSelect={onSelect}
              selectedRange={selectedRange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
