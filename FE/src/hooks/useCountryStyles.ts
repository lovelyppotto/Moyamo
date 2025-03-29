import { useTheme } from '@/components/theme-provider';

export function useCountryStyles() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getColorClass = (countryCode?: string) => {
    const code = countryCode?.toLowerCase() || 'kr';

    if (isDark) {
      switch (code) {
        case 'kr':
          return 'bg-d-kr-600';
        case 'jp':
          return 'bg-d-jp-300';
        case 'us':
          return 'bg-d-us-500';
        case 'cn':
          return 'bg-d-cn-400';
        case 'it':
          return 'bg-d-italy-600';
        default:
          return 'bg-d-kr-600';
      }
    }

    switch (code) {
      case 'kr':
        return 'bg-kr-500';
      case 'jp':
        return 'bg-jp-500';
      case 'us':
        return 'bg-us-600';
      case 'cn':
        return 'bg-cn-500';
      case 'it':
        return 'bg-italy-600';
      default:
        return 'bg-kr-500';
    }
  };

  const getHoverClass = (countryCode?: string) => {
    const code = countryCode?.toLowerCase() || 'kr';

    if (isDark) {
      switch (code) {
        case 'kr':
          return 'hover:bg-d-kr-700';
        case 'jp':
          return 'hover:bg-d-jp-400';
        case 'us':
          return 'hover:bg-d-us-600';
        case 'cn':
          return 'hover:bg-d-cn-500';
        case 'it':
          return 'hover:bg-d-italy-700';
        default:
          return 'hover:bg-d-kr-700';
      }
    }

    switch (code) {
      case 'kr':
        return 'hover:bg-kr-600';
      case 'jp':
        return 'hover:bg-jp-600';
      case 'us':
        return 'hover:bg-us-700';
      case 'cn':
        return 'hover:bg-cn-600';
      case 'it':
        return 'hover:bg-italy-700';
      default:
        return 'hover:bg-kr-600';
    }
  };

  return {
    getColorClass,
    getHoverClass,
    isDark,
  };
}
