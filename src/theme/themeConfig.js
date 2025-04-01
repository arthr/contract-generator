import { createTheme } from "flowbite-react";

export const themes = createTheme({
	dark: {
		name: "dark",
		background: "#0f172a",
		surface: "#1e293b",
		primary: "#3b82f6",
		text: "#ffffff",
		secondaryText: "#94a3b8",
	},
	light: {
		name: "light",
		background: "#f8fafc",
		surface: "#ffffff",
		primary: "#2563eb",
		text: "#0f172a",
		secondaryText: "#475569",
	},
});
