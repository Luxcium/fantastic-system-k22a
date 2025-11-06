"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";

export function ThemeToggle() {
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const currentTheme = resolvedTheme ?? theme;

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button className="h-9 w-9 p-0" variant="ghost" aria-label="Toggle theme">
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	return (
		<Button
			className="h-9 w-9 p-0"
			variant="ghost"
			aria-label="Toggle theme"
			onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
		>
			{currentTheme === "light" ? (
				<Moon className="h-5 w-5" />
			) : (
				<Sun className="h-5 w-5" />
			)}
		</Button>
	);
}
