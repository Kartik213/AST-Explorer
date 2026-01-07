import { useEffect, useRef } from "react"
import { NodeRange } from "../types"

export function useMonacoDecorations(editor: any, selectedRange: NodeRange | null) {
  const decorationsRef = useRef<string[]>([])

  useEffect(() => {
    if (!editor) return

    if (!selectedRange) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [])
      return
    }

    const { startPos, endPos } = selectedRange
    const range = {
      startLineNumber: startPos.row + 1,
      startColumn: startPos.column + 1,
      endLineNumber: endPos.row + 1,
      endColumn: endPos.column + 1
    }

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
      {
        range,
        options: { inlineClassName: "ast-highlight-inline", className: "ast-highlight-line" }
      }
    ])

    editor.revealRangeInCenterIfOutside?.(range) || editor.revealRange?.(range)
  }, [selectedRange, editor])
}
