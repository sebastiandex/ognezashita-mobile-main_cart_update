import React, {useState} from 'react';
import { Appearance } from 'react-native';
import gstore from "../stores/gstore";

// контекст с параметрами по-умолчанию
export const ThemeContext = React.createContext({
    isDark: false,
    setColorScheme: () => {},
});
// провайдер
export const ThemeProvider = ({ children }) => {
    const colorScheme = Appearance.getColorScheme();
    // храним флаг isDark
    const [isDark, setIsDark] = useState(colorScheme === 'dark');
    const defaultTheme = {
        isDark,
        colors: isDark ? 'dark' : 'light',
        // будем менять флаг isDark по требованию
        setColorScheme: (scheme) => {
            setIsDark(scheme === 'dark');
        },
    };
    gstore.colorScheme = colorScheme

    return (
        <ThemeContext.Provider value={defaultTheme}>
            {children}
        </ThemeContext.Provider>
    );
};
