"use client"

import React from "react"
import { Tree } from "web-tree-sitter"
import { initTreeSitter, parseCode } from "../lib/treesitter"
import Editor, { OnMount } from "@monaco-editor/react"

const exampleCode = `
/**
 * Welcome to the AST Explorer!
 * 
 * Click on the tree nodes on the right to highlight
 * the corresponding code in this editor.
 */
const ASTExplorer = ({ version }) => {
  const [active, setActive] = React.useState(true);
  
  return (
    <div className="syntax-tree">
      <h1>Code Analysis V{version}</h1>
      <button onClick={() => setActive(!active)}>
        Toggle Analysis
      </button>
    </div>
  );
};
`

interface NodeRange {
  start: number
  end: number
  startPos: { row: number; column: number }
  endPos: { row: number; column: number }
}

function ASTNodeView({ 
  node, 
  depth, 
  onSelect, 
  selectedRange 
}: { 
  node: any; 
  depth: number; 
  onSelect: (range: NodeRange) => void;
  selectedRange: NodeRange | null;
}) {
  const [isOpen, setIsOpen] = React.useState(depth < 2)
  const hasChildren = node.childCount > 0
  const isSelected = selectedRange && selectedRange.start === node.startIndex && selectedRange.end === node.endIndex

  return (
    <div className={`flex flex-col ${depth > 0 ? "ml-4 border-l border-gray-100 dark:border-gray-800/50" : ""}`}>
      <div
        className={`flex items-center gap-2 px-2 py-1 cursor-pointer transition-all rounded-md group m-0.5 ${
          isSelected 
            ? "bg-indigo-500/10 dark:bg-indigo-400/20 ring-1 ring-indigo-500/30 dark:ring-indigo-400/30 shadow-sm" 
            : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
        }`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect({ 
            start: node.startIndex, 
            end: node.endIndex,
            startPos: { row: node.startPosition.row, column: node.startPosition.column },
            endPos: { row: node.endPosition.row, column: node.endPosition.column }
          })
          if (hasChildren && !isOpen) setIsOpen(true)
        }}
      >
        <span 
          className={`text-[10px] w-4 h-4 flex justify-center items-center transition-transform duration-200 ${hasChildren ? "opacity-40 group-hover:opacity-100" : "opacity-0"} ${isOpen ? "rotate-0" : "-rotate-90"}`}
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }
          }}
        >
          ▼
        </span>
        <span className={`font-mono text-[13px] ${isSelected ? "text-blue-600 dark:text-blue-300 font-bold" : "text-indigo-600 dark:text-indigo-400"}`}>
          {node.type}
        </span>
        <span className="text-[10px] text-gray-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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

export default function TreeSitterTest() {
  const [isReady, setIsReady] = React.useState(false)
  const [code, setCode] = React.useState(exampleCode)
  const [AST, setAST] = React.useState<Tree | null>(null)
  const [selectedRange, setSelectedRange] = React.useState<NodeRange | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  const editorRef = React.useRef<any>(null)
  const decorationsRef = React.useRef<string[]>([])

  React.useEffect(() => {
    setMounted(true)
    // Detect initial theme
    setIsDarkMode(document.documentElement.classList.contains("dark") || window.matchMedia("(prefers-color-scheme: dark)").matches)

    ;(async () => {
      try {
        await initTreeSitter()
        setIsReady(true)
        const tree = parseCode(exampleCode)
        setAST(tree)
      } catch (err) {
        console.error("Initialization error:", err)
      }
    })()
  }, [])

  React.useEffect(() => {
    if (!isReady) return

    const timeout = setTimeout(() => {
      const tree = parseCode(code)
      setAST(tree)
    }, 50)

    return () => clearTimeout(timeout)
  }, [code, isReady])

  // Update decorations in Monaco Editor
  React.useEffect(() => {
    if (!editorRef.current || !selectedRange) {
      if (editorRef.current) {
         decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [])
      }
      return
    }

    const { startPos, endPos } = selectedRange

    decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
      {
        range: {
          startLineNumber: startPos.row + 1,
          startColumn: startPos.column + 1,
          endLineNumber: endPos.row + 1,
          endColumn: endPos.column + 1
        },
        options: {
          inlineClassName: "ast-highlight-inline",
          className: "ast-highlight-line"
        }
      }
    ])

    // Reveal the range in view with a safe fallback
    const range = {
      startLineNumber: startPos.row + 1,
      startColumn: startPos.column + 1,
      endLineNumber: endPos.row + 1,
      endColumn: endPos.column + 1
    }

    if (typeof editorRef.current.revealRangeInCenterIfOutside === "function") {
      editorRef.current.revealRangeInCenterIfOutside(range)
    } else if (typeof editorRef.current.revealRange === "function") {
      editorRef.current.revealRange(range)
    }
  }, [selectedRange])

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  return (
    <main className="h-screen flex flex-col bg-background text-foreground transition-all duration-300 font-sans overflow-hidden select-none">
      {/* Premium Header */}
      <header className="px-8 py-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-background/80 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg shadow-lg rotate-3 overflow-hidden">
             <div className="text-white font-black text-sm tracking-tighter -rotate-3 px-1">AST</div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Language Explorer
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
              Interactive Syntax Tree Analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner">
             <div className={`w-2 h-2 rounded-full ${isReady ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-yellow-500 animate-pulse"}`} />
             <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
               {isReady ? "JavaScript Engine Ready" : "Initializing Engine..."}
             </span>
           </div>
        </div>
      </header>
      
      {/* Main Workspace */}
      <section className="flex flex-1 overflow-hidden p-8 gap-8 bg-[#fcfcfd] dark:bg-[#050507]">
        
        {/* Helper Instructions - Floating */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
           <div className="px-6 py-2.5 bg-gray-900/90 dark:bg-gray-100/90 text-white dark:text-gray-900 text-[11px] font-bold rounded-full shadow-2xl backdrop-blur-sm border border-gray-100/10 dark:border-gray-900/10 flex items-center gap-3 animate-bounce">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[8px]">i</span>
              Click AST nodes to highlight code in the editor
           </div>
        </div>

        {/* Source Code Panel (Monaco) */}
        <div className="flex flex-col w-1/2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative active-editor-border">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/40 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
               <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/40" />
               </div>
               <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Editor</h2>
            </div>
            <button 
              onClick={() => { setCode(""); setSelectedRange(null); }}
              className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme={mounted && isDarkMode ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => {
                setCode(value || "")
                setSelectedRange(null)
              }}
              onMount={handleEditorMount}
              options={{
                fontSize: 14,
                fontFamily: "var(--font-geist-mono), monospace",
                lineHeight: 1.8,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20 },
                lineNumbers: "on",
                glyphMargin: false,
                folding: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "none",
                scrollbar: {
                  vertical: "hidden",
                  horizontal: "hidden"
                }
              }}
            />
          </div>
        </div>

        {/* AST Panel */}
        <div className="flex flex-col w-1/2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden relative">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/40 flex justify-between items-center shrink-0">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Abstract Syntax Tree</h2>
            <div className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded uppercase">Live</div>
          </div>
          <div className="flex-1 overflow-auto p-6 font-mono custom-scrollbar">
            {AST ? (
              <div className="min-w-max pb-20">
                <ASTNodeView 
                  node={AST.rootNode} 
                  depth={0} 
                  onSelect={setSelectedRange}
                  selectedRange={selectedRange}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-50">
                <div className="w-12 h-12 border-t-2 border-indigo-500 rounded-full animate-spin mb-6" />
                <p className="text-sm font-bold tracking-tight text-gray-500">Constructing Graph...</p>
              </div>
            )}
            
            {code.trim() === "" && (
              <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-background/50 backdrop-blur-sm z-10 transition-opacity">
                 <div className="max-w-xs">
                    <p className="text-lg font-bold text-gray-300 dark:text-gray-700 mb-2">Editor Empty</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">The Abstract Syntax Tree will appear here as soon as you start typing.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .active-editor-border:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
        .ast-highlight-inline {
          background-color: rgba(99, 102, 241, 0.1);
          border-radius: 4px;
          box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.3);
        }
        .dark .ast-highlight-inline {
          background-color: rgba(129, 140, 248, 0.15);
          box-shadow: inset 0 0 0 1px rgba(129, 140, 248, 0.4);
        }
        .ast-highlight-line {
          background-color: rgba(99, 102, 241, 0.05);
        }
        .dark .ast-highlight-line {
          background-color: rgba(129, 140, 248, 0.05);
        }
      `}</style>
    </main>
  )
}
