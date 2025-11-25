import { useLanguage } from '../i18n/LanguageProvider'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white shadow-sm px-1 py-1">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
          language === 'en' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('de')}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
          language === 'de' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        DE
      </button>
    </div>
  )
}

