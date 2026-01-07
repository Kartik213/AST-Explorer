import React, { memo } from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import { MONACO_LANGS } from "../../lib/constants"

interface Props {
  code: string
  onChange: (value: string | undefined) => void
  onMount: OnMount
  language: string
  isDarkMode: boolean
  isLoading: boolean
  onClear: () => void
}

export const EditorPane = memo(({ 
  code, 
  onChange, 
  onMount, 
  language, 
  isDarkMode, 
  isLoading,
  onClear
}: Props) => {
  return (
    <div className="flex flex-col flex-1 h-full min-h-[300px] rounded-2xl border border-gray-200 dark:border-gray-800 bg-background shadow-sm overflow-hidden relative active-editor-border">
      <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/40 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
           <div className="hidden sm:flex gap-1.5">
              <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
           </div>
           <h2 className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Editor</h2>
        </div>
        <button 
          onClick={onClear}
          className="text-[9px] lg:text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors uppercase tracking-widest"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 min-h-0 relative h-full">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
             <div className="w-6 h-6 lg:w-8 lg:h-8 border-t-2 border-blue-500 rounded-full animate-spin" />
          </div>
        )}
        <Editor
          height="100%"
          language={MONACO_LANGS[language] || "javascript"}
          theme={isDarkMode ? "vs-dark" : "light"}
          value={code}
          onChange={onChange}
          onMount={onMount}
          options={{
            fontSize: 14,
            fontFamily: "var(--font-geist-mono), monospace",
            lineHeight: 1.8,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 20 },
            renderLineHighlight: "none",
            scrollbar: { vertical: "hidden", horizontal: "hidden" }
          }}
        />
      </div>
    </div>
  )
})

EditorPane.displayName = "EditorPane"
