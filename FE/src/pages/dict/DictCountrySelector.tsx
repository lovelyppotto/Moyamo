import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Country = {
  code: string;
  name: string;
};

type CountrySelectorProps = {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  countryOptions: Country[];
};

function DictCountrySelector({
  selectedCountry,
  onSelectCountry,
  countryOptions,
}: CountrySelectorProps) {
  // 국기 이미지 경로 생성 함수
  const getFlagPath = (countryCode: string) => {
    return `images/flags/${countryCode}.png`;
  };

  // 국가 코드를 Country 객체로 변환
  const getCountryByCode = (code: string) => {
    return countryOptions.find((country) => country.code === code) || selectedCountry;
  };

  // 값 변경 핸들러
  const handleValueChange = (code: string) => {
    const country = getCountryByCode(code);
    onSelectCountry(country);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-center items-center gap-3 w-[180px] h-16 px-4 py-2 bg-white rounded-xl border border-gray-400 shadow-sm focus:outline-none">
        <div className="flex items-center gap-2">
          <img
            src={getFlagPath(selectedCountry.code)}
            alt={`${selectedCountry.code}`}
            className="w-[50px] h-[35px] shadow-md"
          />
          <span className="text-[18px]">{selectedCountry.name}</span>
          <FontAwesomeIcon icon={faCaretDown} className="ml-auto" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex justify-center w-[180px] bg-white border-gray-400 rounded-xl border shadow-md mt-2">
        <DropdownMenuRadioGroup value={selectedCountry.code} onValueChange={handleValueChange}>
          {countryOptions.map((country) => (
            <DropdownMenuRadioItem
              key={country.code}
              value={country.code}
              className="flex items-center gap-3 py-3 hover:bg-gray-200 cursor-pointer "
            >
              <img
                src={getFlagPath(country.code)}
                alt={`${country.name} 국기`}
                className="w-7 h-5 object-cover shadow-sm"
              />
              <span className="text-[16px]">{country.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DictCountrySelector;
