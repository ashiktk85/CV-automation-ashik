import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const defaultLanguage = localStorage.getItem('avoria_language') || 'en'
  const [language, setLanguageState] = useState(defaultLanguage)

  const setLanguage = useCallback((lang) => {
    const normalized = lang === 'de' ? 'de' : 'en'
    localStorage.setItem('avoria_language', normalized)
    setLanguageState(normalized)
  }, [])

  const translate = useCallback((key, vars = {}) => {
    const parts = key.split('.')
    let value = parts.reduce((acc, part) => acc?.[part], translations[language])
    if (typeof value !== 'string') {
      return key
    }
    Object.entries(vars).forEach(([varKey, varValue]) => {
      value = value.replaceAll(`{{${varKey}}}`, String(varValue))
    })
    return value
  }, [language])

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t: translate
  }), [language, setLanguage, translate])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

