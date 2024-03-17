import {createContext, FunctionComponent, PropsWithChildren, useContext, useState} from "react";

interface IColorModeContext {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}

export const ColorModeContext = createContext<IColorModeContext>({} as IColorModeContext);

interface IColorModeContextProviderProps extends PropsWithChildren {
}

export const ColorModeContextProvider: FunctionComponent<IColorModeContextProviderProps> = (props) => {
    const {children} = props;

    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    return (
        <ColorModeContext.Provider
            value={{
                isDarkMode,
                setIsDarkMode
            }}
        >
            {children}
        </ColorModeContext.Provider>
    )
}

export const useColorMode = ():IColorModeContext => {
    return useContext(ColorModeContext)
}