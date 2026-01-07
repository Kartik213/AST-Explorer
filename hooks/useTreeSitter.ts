import { useState, useEffect, useCallback } from "react"
import { Tree } from "web-tree-sitter"
import { initTreeSitter, parseCode, setLanguage as setTsLanguage } from "../lib/treesitter"

export function useTreeSitter(initialLanguage: string, initialCode: string) {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ast, setAst] = useState<Tree | null>(null)

  const parse = useCallback((code: string) => {
    setAst(parseCode(code))
  }, [])

  const setLanguage = useCallback(async (lang: string, code: string) => {
    setIsLoading(true)
    try {
      await setTsLanguage(lang)
      parse(code)
    } finally {
      setIsLoading(false)
    }
  }, [parse])

  useEffect(() => {
    ;(async () => {
      try {
        await initTreeSitter()
        await setTsLanguage(initialLanguage)
        const tree = parseCode(initialCode)
        setAst(tree)
        setIsReady(true)
      } catch (err) {
        // Silently fail or handle internally for cleaner OS code
      }
    })()
  }, [])

  return { isReady, isLoading, ast, setLanguage, parse }
}
