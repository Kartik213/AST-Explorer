import React from "react"

interface LanguageSelectorProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const LANGUAGES = [
  { id: "javascript", label: "Javascript" },
  { id: "typescript", label: "Typescript" },
  { id: "python", label: "Python" },
  { id: "rust", label: "Rust" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
]

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <span className="hidden sm:block text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Lang:</span>
      <select 
        value={value}
        onChange={onChange}
        className="bg-slate-50 border border-slate-200 rounded-lg px-2 lg:px-3 py-1 lg:py-1.5 text-[10px] lg:text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer text-slate-700"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.id} value={lang.id}>{lang.label}</option>
        ))}
      </select>
    </div>
  )
}
