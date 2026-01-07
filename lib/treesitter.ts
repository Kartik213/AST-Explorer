import { Parser, Tree, Language } from "web-tree-sitter"

let parserInstance: Parser | null = null
const languageCache: Record<string, Language> = {}

export async function initTreeSitter(): Promise<void> {
  if (parserInstance) return

  try {
    await Parser.init({
      locateFile(scriptName: string) {
        return scriptName
      },
    })
    parserInstance = new Parser()
  } catch (err) {
    console.error("Failed to initialize Tree-sitter:", err)
    throw err
  }
}

export async function setLanguage(langName: string): Promise<void> {
  if (!parserInstance) throw new Error("Parser not initialized")
  
  if (languageCache[langName]) {
    parserInstance.setLanguage(languageCache[langName])
    return
  }

  try {
    const lang = await Language.load(`/grammars/tree-sitter-${langName}.wasm`)
    languageCache[langName] = lang
    parserInstance.setLanguage(lang)
  } catch (err) {
    console.error(`Failed to load language: ${langName}`, err)
    throw err
  }
}

export function parseCode(code: string): Tree | null {
  if (!parserInstance) return null
  
  try {
    return parserInstance.parse(code)
  } catch (err) {
    console.error("Parsing error:", err)
    return null
  }
}
