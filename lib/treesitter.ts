import { Parser, Tree, Language } from "web-tree-sitter"

let parserInstance: Parser | null = null

/**
 * Initializes the Tree-sitter parser and loads the JavaScript language.
 * Safe to call multiple times; it will only initialize once.
 */
export async function initTreeSitter(): Promise<void> {
  if (parserInstance) return

  try {
    await Parser.init({
      locateFile(scriptName: string) {
        return scriptName
      },
    })

    const newParser = new Parser()
    const lang = await Language.load("/tree-sitter-javascript.wasm")
    newParser.setLanguage(lang)
    
    parserInstance = newParser
  } catch (err) {
    console.error("Failed to initialize Tree-sitter:", err)
    throw err
  }
}

/**
 * Parses the provided source code into an AST Tree.
 * Returns null if the parser has not been initialized.
 */
export function parseCode(code: string): Tree | null {
  if (!parserInstance) {
    console.warn("parseCode called before initTreeSitter")
    return null
  }
  
  try {
    return parserInstance.parse(code)
  } catch (err) {
    console.error("Parsing error:", err)
    return null
  }
}
