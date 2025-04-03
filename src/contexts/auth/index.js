import AuthContext from "./AuthContext";
import { AuthProvider } from "./AuthProvider";
import { useContext } from "react";

export { AuthProvider };
export const useAuth = () => useContext(AuthContext);
