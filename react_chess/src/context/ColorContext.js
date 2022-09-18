import { createContext } from "react";

export const ColorContext = createContext({
    isCreator: false,
    playerIsCreator: () => {},
    playerIsNotCreator: () => {}
});