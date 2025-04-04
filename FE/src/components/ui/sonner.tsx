import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  // 테마에 따라 배경색 설정
  const bgColor = theme === 'dark' ? 'rgba(30, 30, 30, 1)' : 'rgba(255, 255, 255, 1)';

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': bgColor,
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          zIndex: 9999,
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          backgroundColor: bgColor,
          opacity: 1,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
