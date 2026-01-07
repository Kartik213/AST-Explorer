import React from "react"
import { LanguageSelector } from "../editor/LanguageSelector"

interface HeaderProps {
  language: string
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  isReady: boolean
  isLoading: boolean
}

export function Header({ language, onLanguageChange, isReady, isLoading }: HeaderProps) {
  return (
    <header className="px-4 lg:px-8 py-4 lg:py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center bg-white/80 backdrop-blur-md shrink-0 z-20 gap-4 sm:gap-0">
      <div className="flex items-center gap-4 lg:gap-6 w-full sm:w-auto">
        <div className="p-1.5 lg:p-2 bg-slate-700/90 rounded-lg shadow-sm -rotate-[10deg] transition-transform hover:rotate-0 hover:scale-110 duration-300">
           <div className="text-white font-black text-xs lg:text-sm rotate-[10deg] transition-transform group-hover:rotate-0 tracking-tighter">AST</div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg lg:text-xl font-bold tracking-tight text-slate-800 leading-none">Explorer</h1>
          <p className="hidden lg:block text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
            Interactive Syntax Tree Analysis
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-3 lg:gap-6 w-full sm:w-auto">
         <LanguageSelector value={language} onChange={onLanguageChange} />

         <div className="flex items-center gap-2 px-3 lg:px-4 py-1.5 bg-slate-50 rounded-full border border-slate-200 shadow-sm">
           <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${isReady && !isLoading ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
           <span className="hidden sm:block text-[10px] lg:text-xs font-bold text-slate-600">
             {!isReady ? "Initializing..." : isLoading ? "Loading..." : "Ready"}
           </span>
         </div>
      </div>
    </header>
  )
}
