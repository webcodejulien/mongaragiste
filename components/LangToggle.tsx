'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { translations, Lang } from '@/lib/i18n'

const LangCtx = createContext<{ lang: Lang; t: typeof translations['fr']; setLang: (l: Lang) => void }>({
  lang: 'fr', t: translations.fr, setLang: () => {}
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')
  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang
    if (saved === 'nl') setLangState('nl')
  }, [])
  function setLang(l: Lang) { setLangState(l); localStorage.setItem('lang', l) }
  return <LangCtx.Provider value={{ lang, t: translations[lang], setLang }}>{children}</LangCtx.Provider>
}

export function useLang() { return useContext(LangCtx) }

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ border: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
      {(['fr', 'nl'] as Lang[]).map(l => (
        <button key={l} onClick={() => setLang(l)}
          className="px-2 py-1 rounded text-[11px] font-semibold uppercase transition-colors"
          style={{ background: lang === l ? '#1D9E75' : 'transparent', color: lang === l ? '#fff' : 'var(--color-text-secondary)' }}>
          {l}
        </button>
      ))}
    </div>
  )
}
