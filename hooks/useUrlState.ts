import { useEffect, useRef } from "react"

export function useUrlState(language: string, code: string) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      params.set("lang", language)
      code ? params.set("code", code) : params.delete("code")
      
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl)
    }, 500)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [code, language])
}
