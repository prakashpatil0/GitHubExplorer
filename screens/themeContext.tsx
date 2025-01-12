import React, { createContext, useContext, useState } from "react";
import { DefaultTheme, MD3DarkTheme, Provider as PaperProvider } from "react-native-paper";

const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const theme = darkMode ? MD3DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};
