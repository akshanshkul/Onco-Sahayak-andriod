import React from "react";
import { OptionSheet } from "./pickers";
import { useI18n, LANGUAGE_NAMES, type Lang } from "../i18n";

/**
 * Language chooser. Each option is written in its own script so it is
 * readable to someone who cannot read the current language.
 */
export default function LanguageSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { lang, setLang, t } = useI18n();

  const options = (Object.keys(LANGUAGE_NAMES) as Lang[]).map((code) => ({
    id: code,
    name: LANGUAGE_NAMES[code],
  }));

  return (
    <OptionSheet
      visible={visible}
      title={t("lang.title")}
      options={options}
      value={lang}
      onSelect={(id) => setLang(id as Lang)}
      onClose={onClose}
      searchable={false}
    />
  );
}
