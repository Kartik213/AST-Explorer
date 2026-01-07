"use client"

import React, { useState, useRef, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { EditorPane } from "@/components/editor/EditorPane"
import { ASTTreeView } from "@/components/ast/ASTTreeView"
import { InstructionTooltip } from "@/components/layout/InstructionTooltip"
import { EXAMPLES } from "@/lib/constants"
import { useTreeSitter } from "@/hooks/useTreeSitter"
import { useUrlState } from "@/hooks/useUrlState"
import { useMonacoDecorations } from "@/hooks/useMonacoDecorations"
import { NodeRange } from "@/types"

export default function Explorer({languageParam, codeParam}: {languageParam: string; codeParam: string}) {
  const [language, setLanguageState] = useState(languageParam ?? "javascript")
  const [code, setCode] = useState(codeParam ?? EXAMPLES[language] ?? "")
  const [selectedRange, setSelectedRange] = useState<NodeRange | null>(null)
  const [activeView, setActiveView] = useState<"editor" | "ast">("editor")
  const editorRef = useRef<any>(null)

  const { isReady, isLoading, ast, setLanguage, parse } = useTreeSitter(language, code)
  
  useUrlState(language, code)
  useMonacoDecorations(editorRef.current, selectedRange)

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value
    const newCode = EXAMPLES[lang] || ""
    setLanguageState(lang)
    setCode(newCode)
    setSelectedRange(null)
    setLanguage(lang, newCode)
  }

  const handleClear = useCallback(() => {
    setCode("")
    setSelectedRange(null)
    parse("")
  }, [parse])

  const handleEditorChange = useCallback((value: string | undefined) => {
    const newCode = value || ""
    setCode(newCode)
    setSelectedRange(null)
    parse(newCode)
  }, [parse])

  const handleNodeSelect = (range: NodeRange) => {
    setSelectedRange(range)
    if (window.innerWidth < 1280) setActiveView("editor")
  }

  return (
    <main className="h-screen flex flex-col bg-slate-50 text-slate-700 transition-all duration-300 font-sans overflow-hidden select-none">
      <Header 
        language={language}
        onLanguageChange={handleLanguageChange}
        isReady={isReady}
        isLoading={isLoading}
      />
      
      <section className="flex flex-1 flex-col xl:flex-row overflow-hidden p-4 lg:p-8 gap-4 lg:gap-8 bg-slate-50">
        <InstructionTooltip />

        {/* View Switcher (Mobile Only) */}
        <div className="flex xl:hidden bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button 
            onClick={() => setActiveView("editor")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeView === "editor" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
          >
            Editor
          </button>
          <button 
            onClick={() => setActiveView("ast")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${activeView === "ast" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
          >
            Syntax Tree
          </button>
        </div>

        <div className={`${activeView === "editor" ? "flex" : "hidden"} xl:flex xl:w-1/2 flex-col min-h-0 h-full`}>
          <EditorPane 
            code={code}
            onChange={handleEditorChange}
            onMount={(editor) => { editorRef.current = editor }}
            language={language}
            isLoading={isLoading}
            onClear={handleClear}
          />
        </div>

        <div className={`${activeView === "ast" ? "flex" : "hidden"} xl:flex xl:w-1/2 flex-col min-h-0 h-full`}>
          <ASTTreeView 
            ast={ast}
            isLoading={isLoading}
            code={code}
            onSelect={handleNodeSelect}
            selectedRange={selectedRange}
          />
        </div>
      </section>
    </main>
  )
}
