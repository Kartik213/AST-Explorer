import Explorer from "@/components/ExplorerClient"

export default async function Page({searchParams}: {searchParams: Promise<{ lang: string; code: string }>}) {
  const { lang, code } = await searchParams;
  return (
    <Explorer languageParam={lang} codeParam={code} />
  )
}
