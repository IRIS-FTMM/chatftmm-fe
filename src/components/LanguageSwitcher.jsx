import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select
      value={i18n.language}
      onChange={e => i18n.changeLanguage(e.target.value)}
      className="rounded border p-1 text-xs ml-2"
    >
      <option value="en">English</option>
      <option value="id">Bahasa</option>
    </select>
  );
}
