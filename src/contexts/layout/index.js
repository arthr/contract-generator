import LayoutContext from "./LayoutContext";
import { LayoutProvider } from "./LayoutProvider";
import { useContext } from "react";

export { LayoutProvider };
export const useLayout = () => useContext(LayoutContext);
