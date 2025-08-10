// src/UserContext.js
import { createContext, useContext } from "react";

export const UserContext = createContext(null);

// Custom hook for easier use
export const useUser = () => useContext(UserContext);
