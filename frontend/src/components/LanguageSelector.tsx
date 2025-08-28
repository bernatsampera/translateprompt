import ISO6391 from "iso-639-1";
import Select from "react-select";

const featured = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "ru",
  "zh",
  "ja",
  "ko",
  "ar",
  "ca"
];
const allLanguages = ISO6391.getAllCodes();

const LANGUAGE_OPTIONS = [
  // featured first
  ...featured.map((code) => ({
    value: code,
    label: ISO6391.getName(code),
    featured: true
  })),
  // then the rest
  ...allLanguages
    .filter((code) => !featured.includes(code))
    .map((code) => ({
      value: code,
      label: ISO6391.getName(code)
    }))
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function LanguageSelector({
  value,
  onChange,
  className = "w-32"
}: LanguageSelectorProps) {
  return (
    <Select
      options={LANGUAGE_OPTIONS}
      value={LANGUAGE_OPTIONS.find((o) => o.value === value)}
      className={`${className} text-sm lg:text-base bg-base-100`}
      onChange={(e) => onChange(e?.value ?? value)}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: "var(--bg-base-100)"
        })
      }}
    />
  );
}

export default LanguageSelector;
export {LANGUAGE_OPTIONS};
