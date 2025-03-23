interface CountrySelectorProps {
  title: string;
  subtitle: string;
  onSelectCountry: (countryId: number) => void;
  onClose: () => void;
}

function CountrySelector({
  title,
  subtitle, onSelectCountry, onClose
}: CountrySelectorProps) {

}