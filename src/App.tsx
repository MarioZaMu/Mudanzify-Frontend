import { DesignSystemScreen } from '@/screens/design-system/DesignSystemScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

export function App() {
  return (
    <ThemeProvider>
      <DesignSystemScreen />
    </ThemeProvider>
  );
}
