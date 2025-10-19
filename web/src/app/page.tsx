"use client";

import { cn, formatDate } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    ChevronDown,
    Database,
    Filter,
    LayoutDashboard,
    LogOut,
    Moon,
    Plus,
    Search,
    Settings,
    Shield,
    Sun,
    User,
    Users,
} from "lucide-react";
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type Role = "admin" | "editor" | "viewer";
type Route = "dashboard" | "projects" | "users" | "profile" | "settings";

type UserModel = {
	name: string;
	email: string;
	role: Role;
	avatarUrl?: string;
};

type AuthContextShape = {
	user: UserModel | null;
	signIn: (payload: Partial<UserModel>) => void;
	signOut: () => void;
	updateUser: (patch: Partial<UserModel>) => void;
};

const AuthContext = createContext<AuthContextShape | null>(null);

const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};

const traffic = [
	{ day: "Mon", value: 120 },
	{ day: "Tue", value: 180 },
	{ day: "Wed", value: 150 },
	{ day: "Thu", value: 220 },
	{ day: "Fri", value: 260 },
	{ day: "Sat", value: 190 },
	{ day: "Sun", value: 210 },
];

const errorRate = [
	{ day: "Mon", value: 0.21 },
	{ day: "Tue", value: 0.18 },
	{ day: "Wed", value: 0.25 },
	{ day: "Thu", value: 0.17 },
	{ day: "Fri", value: 0.16 },
	{ day: "Sat", value: 0.22 },
	{ day: "Sun", value: 0.19 },
];

const projectsSeed = [
	{
		id: "P-001",
		name: "Orion",
		status: "Active",
		owner: "Alice",
		updated: "2025-10-10",
	},
	{
		id: "P-002",
		name: "Aegis",
		status: "Paused",
		owner: "Bob",
		updated: "2025-10-11",
	},
	{
		id: "P-003",
		name: "Helios",
		status: "Active",
		owner: "Chloe",
		updated: "2025-10-12",
	},
	{
		id: "P-004",
		name: "Zephyr",
		status: "Archived",
		owner: "Dan",
		updated: "2025-10-13",
	},
];

const usersSeed: UserModel[] = [
	{ name: "Alice Martin", email: "alice@example.com", role: "admin" },
	{ name: "Bob Chen", email: "bob@example.com", role: "editor" },
	{ name: "Chloe Singh", email: "chloe@example.com", role: "viewer" },
];

const pageMotion = {
	initial: { opacity: 0, y: 8 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -8 },
	transition: { duration: 0.16, ease: "easeInOut" },
};

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonStyles: Record<ButtonVariant, string> = {
	primary:
		"bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500",
	secondary:
		"bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 focus-visible:ring-neutral-500",
	ghost:
		"bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 focus-visible:ring-neutral-500",
	danger:
		"bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-500",
};

function Button({
	children,
	variant = "primary",
	className,
	...props
}: {
	children: ReactNode;
	variant?: ButtonVariant;
	className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={cn(
				"inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
				buttonStyles[variant],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

function Card({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-neutral-200/70 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/80",
				className,
			)}
		>
			{children}
		</div>
	);
}

function CardHeader({
	title,
	hint,
	action,
	className,
}: {
	title: ReactNode;
	hint?: ReactNode;
	action?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn("mb-3 flex items-center justify-between gap-4", className)}
		>
			<div>
				<h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
					{title}
				</h3>
				{hint ? (
					<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
						{hint}
					</p>
				) : null}
			</div>
			{action}
		</div>
	);
}

function Badge({
	children,
	variant = "outline",
}: {
	children: ReactNode;
	variant?: "outline" | "solid";
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
				variant === "solid"
					? "bg-indigo-600/90 text-white"
					: "border border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300",
			)}
		>
			{children}
		</span>
	);
}

function Avatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("")
		.slice(0, 2);

	return (
		<div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/90 text-sm font-semibold text-white">
			{initials || "—"}
		</div>
	);
}

function Navbar({
	route,
	onNavigate,
	theme,
	onThemeChange,
}: {
	route: Route;
	onNavigate: (route: Route) => void;
	theme: ThemeMode;
	onThemeChange: (mode: ThemeMode) => void;
}) {
	const { user, signOut, updateUser } = useAuth();
	const [roleMenuOpen, setRoleMenuOpen] = useState(false);
	const [profileMenuOpen, setProfileMenuOpen] = useState(false);

	useEffect(() => {
		const listener = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest("[data-role-menu]")) {
				setRoleMenuOpen(false);
			}
			if (!target.closest("[data-profile-menu]")) {
				setProfileMenuOpen(false);
			}
		};

		document.addEventListener("click", listener);
		return () => document.removeEventListener("click", listener);
	}, []);

	return (
		<header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/70">
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
				<div className="flex items-center gap-2 text-sm font-semibold">
					<Shield className="h-5 w-5 text-indigo-600" />
					<span>Nova Control</span>
				</div>

				<div className="hidden items-center text-xs font-semibold uppercase tracking-wide text-neutral-400 md:flex">
					{route}
				</div>

				<div className="ml-4 hidden flex-1 items-center md:flex">
					<label className="relative w-full">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
						<input
							className="w-full rounded-xl border border-neutral-200/80 bg-white px-9 py-2 text-sm text-neutral-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:border-indigo-400"
							placeholder="Search anything..."
							type="search"
						/>
					</label>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<div className="relative" data-role-menu>
						<Button
							variant="secondary"
							className="gap-2"
							onClick={() => setRoleMenuOpen((open) => !open)}
						>
							<span className="capitalize">{user?.role}</span>
							<ChevronDown className="h-4 w-4" />
						</Button>
						{roleMenuOpen ? (
							<div className="absolute right-0 top-12 w-40 rounded-xl border border-neutral-200/80 bg-white p-2 shadow-xl dark:border-neutral-800/70 dark:bg-neutral-900">
								<p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
									Role
								</p>
								{(["admin", "editor", "viewer"] as Role[]).map(
									(currentRole) => (
										<button
											key={currentRole}
											className={cn(
												"flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm capitalize text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
												user?.role === currentRole &&
													"bg-neutral-100 font-semibold dark:bg-neutral-800",
											)}
											onClick={() => {
												updateUser({ role: currentRole });
												setRoleMenuOpen(false);
											}}
											type="button"
										>
											{currentRole}
											{user?.role === currentRole ? (
												<Badge variant="solid">✓</Badge>
											) : null}
										</button>
									),
								)}
							</div>
						) : null}
					</div>

					<Button
						variant="ghost"
						aria-label="Toggle theme"
						onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
					>
						{theme === "light" ? (
							<Moon className="h-5 w-5" />
						) : (
							<Sun className="h-5 w-5" />
						)}
					</Button>

					<Button variant="ghost" aria-label="Notifications">
						<Bell className="h-5 w-5" />
					</Button>

					<div className="relative" data-profile-menu>
						<Button
							variant="ghost"
							className="gap-2"
							onClick={() => setProfileMenuOpen((open) => !open)}
						>
							{user ? (
								<Avatar name={user.name} />
							) : (
								<User className="h-5 w-5" />
							)}
							<span className="hidden max-w-[10rem] truncate text-sm md:inline">
								{user?.name}
							</span>
							<ChevronDown className="h-4 w-4" />
						</Button>
						{profileMenuOpen ? (
							<div className="absolute right-0 top-12 w-56 rounded-xl border border-neutral-200/80 bg-white p-2 shadow-xl dark:border-neutral-800/70 dark:bg-neutral-900">
								<p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
									{user?.email}
								</p>
								<button
									className="w-full rounded-lg px-2 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
									onClick={() => {
										onNavigate("profile");
										setProfileMenuOpen(false);
									}}
									type="button"
								>
									Profile
								</button>
								<button
									className="w-full rounded-lg px-2 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
									onClick={() => {
										onNavigate("settings");
										setProfileMenuOpen(false);
									}}
									type="button"
								>
									Settings
								</button>
								<div className="my-2 h-px bg-neutral-200 dark:bg-neutral-800" />
								<button
									className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-900/30"
									onClick={signOut}
									type="button"
								>
									<LogOut className="h-4 w-4" /> Sign out
								</button>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</header>
	);
}

function Sidebar({
	route,
	onNavigate,
}: {
	route: Route;
	onNavigate: (route: Route) => void;
}) {
	const { user } = useAuth();
	const items: Array<{
		key: Route;
		label: string;
		icon: ReactNode;
		roles?: Role[];
	}> = [
		{
			key: "dashboard",
			label: "Dashboard",
			icon: <LayoutDashboard className="h-4 w-4" />,
		},
		{
			key: "projects",
			label: "Projects",
			icon: <Filter className="h-4 w-4" />,
		},
		{
			key: "users",
			label: "Users",
			icon: <Users className="h-4 w-4" />,
			roles: ["admin"],
		},
		{ key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
		{
			key: "settings",
			label: "Settings",
			icon: <Settings className="h-4 w-4" />,
		},
	];

	return (
		<aside className="hidden w-64 flex-col border-r border-neutral-200/70 bg-white/70 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/50 md:flex">
			<div className="px-4 py-4">
				<p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
					Navigation
				</p>
				<div className="mt-3 flex flex-col gap-1">
					{items
						.filter(
							(item) => !item.roles || (user && item.roles.includes(user.role)),
						)
						.map((item) => (
							<button
								key={item.key}
								className={cn(
									"flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
									route === item.key &&
										"bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",
								)}
								onClick={() => onNavigate(item.key)}
								type="button"
							>
								{item.icon}
								<span>{item.label}</span>
								{item.roles?.includes("admin") ? (
									<Badge className="ml-auto">Admin</Badge>
								) : null}
							</button>
						))}
				</div>
			</div>
			<div className="mt-auto border-t border-neutral-200/70 px-4 py-4 text-xs text-neutral-500 dark:border-neutral-800/70 dark:text-neutral-400">
				<p>Signed in as</p>
				<div className="mt-2 flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200">
					<Avatar name={user?.name ?? "Guest"} />
					<div className="truncate">
						<p>{user?.name}</p>
						<p className="text-xs text-neutral-400">{user?.email}</p>
					</div>
				</div>
			</div>
		</aside>
	);
}

function StatCard({
	title,
	value,
	hint,
}: {
	title: string;
	value: string;
	hint?: string;
}) {
	return (
		<Card>
			<CardHeader title={title} hint={hint} />
			<p className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
				{value}
			</p>
		</Card>
	);
}

function DashboardRoute() {
	const trafficGradientId = useId();
	return (
		<motion.div {...pageMotion}>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
				<StatCard title="Active Users" value="1,284" hint="▲ 8% vs last week" />
				<StatCard title="Requests Today" value="12,430" hint="≈ 1.7k / hour" />
				<StatCard title="Avg. Latency" value="142 ms" hint="P95 310 ms" />
				<StatCard title="Error Rate" value="0.14%" hint="P99 < 0.3%" />
			</div>

			<div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
				<Card className="xl:col-span-2">
					<CardHeader title="Weekly Traffic" hint="Synthetic telemetry" />
					<div className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={traffic} margin={{ top: 12, left: 8, right: 8 }}>
								<defs>
									<linearGradient
										id={trafficGradientId}
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
										<stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="4 4" strokeOpacity={0.2} />
								<XAxis dataKey="day" strokeOpacity={0.45} />
								<YAxis strokeOpacity={0.45} />
								<Tooltip
									contentStyle={{
										borderRadius: 12,
										borderColor: "#e5e7eb",
										boxShadow: "0 10px 40px rgba(15,23,42,0.08)",
									}}
								/>
								<Area
									type="monotone"
									dataKey="value"
									stroke="#4338ca"
									strokeWidth={2}
									fill={`url(#${trafficGradientId})`}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</Card>

				<Card>
					<CardHeader title="Quick Actions" hint="Try these in the demo" />
					<div className="flex flex-col gap-2">
						<Button className="justify-start">
							<Plus className="h-4 w-4" />
							New Project
						</Button>
						<Button variant="secondary" className="justify-start">
							<Users className="h-4 w-4" />
							Invite Teammate
						</Button>
						<Button variant="secondary" className="justify-start">
							<Database className="h-4 w-4" />
							Reset Demo Database
						</Button>
					</div>
				</Card>
			</div>

			<div className="mt-5 grid gap-4 xl:grid-cols-3">
				<Card className="xl:col-span-2">
					<CardHeader title="Latency vs Errors" hint="Correlation window" />
					<div className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={traffic} margin={{ top: 12, left: 8, right: 8 }}>
								<CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
								<XAxis dataKey="day" strokeOpacity={0.45} />
								<YAxis strokeOpacity={0.45} />
								<Tooltip
									contentStyle={{
										borderRadius: 12,
										borderColor: "#e5e7eb",
										boxShadow: "0 10px 40px rgba(15,23,42,0.08)",
									}}
								/>
								<Line
									type="monotone"
									dataKey="value"
									stroke="#0ea5e9"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</Card>
				<Card>
					<CardHeader title="Error Budget" hint="Errors per day" />
					<div className="h-72">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={errorRate}>
								<CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
								<XAxis dataKey="day" strokeOpacity={0.45} />
								<YAxis
									strokeOpacity={0.45}
									tickFormatter={(value) => `${(value as number).toFixed(2)}%`}
								/>
								<Tooltip
									formatter={(v: number) => `${v.toFixed(2)}%`}
									contentStyle={{
										borderRadius: 12,
										borderColor: "#e5e7eb",
										boxShadow: "0 10px 40px rgba(15,23,42,0.08)",
									}}
								/>
								<Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#f97316" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>
		</motion.div>
	);
}

function ProjectsRoute() {
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState<
		"All" | "Active" | "Paused" | "Archived"
	>("All");

	const filteredProjects = useMemo(() => {
		return projectsSeed.filter((project) => {
			const matchesStatus = status === "All" || project.status === status;
			const matchesQuery =
				query.trim().length === 0 ||
				project.name.toLowerCase().includes(query.toLowerCase()) ||
				project.id.toLowerCase().includes(query.toLowerCase());
			return matchesStatus && matchesQuery;
		});
	}, [query, status]);

	return (
		<motion.div {...pageMotion}>
			<Card>
				<CardHeader
					title="Projects"
					action={
						<div className="relative flex gap-2" data-role-menu>
							<Button className="gap-2">
								<Plus className="h-4 w-4" />
								New
							</Button>
							<Button variant="secondary" className="gap-2">
								<Filter className="h-4 w-4" />
								Filters
							</Button>
						</div>
					}
				/>
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
					<label className="relative w-full md:max-w-sm">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
						<input
							className="w-full rounded-xl border border-neutral-200/80 bg-white px-9 py-2 text-sm text-neutral-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-200"
							placeholder="Search projects..."
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							type="search"
						/>
					</label>

					<div className="flex gap-1 rounded-xl border border-neutral-200/70 bg-neutral-100/60 p-1 dark:border-neutral-800/70 dark:bg-neutral-900/60">
						{(["All", "Active", "Paused", "Archived"] as const).map(
							(option) => (
								<button
									key={option}
									className={cn(
										"rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50",
										status === option &&
											"bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50",
									)}
									onClick={() => setStatus(option)}
									type="button"
								>
									{option}
								</button>
							),
						)}
					</div>
				</div>

				<div className="mt-5 grid gap-3 lg:grid-cols-2">
					{filteredProjects.map((project) => (
						<Card
							key={project.id}
							className="border border-indigo-100/50 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-indigo-500/20 dark:bg-neutral-900/80"
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<div className="flex items-center gap-2">
										<Badge>{project.id}</Badge>
										<h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
											{project.name}
										</h4>
									</div>
									<p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
										Owner{" "}
										<span className="font-medium text-neutral-700 dark:text-neutral-200">
											{project.owner}
										</span>
									</p>
								</div>
								<Badge variant="solid">{project.status}</Badge>
							</div>
							<p className="mt-3 text-xs text-neutral-400">
								Updated {formatDate(project.updated)}
							</p>
						</Card>
					))}
				</div>
			</Card>
		</motion.div>
	);
}

function UsersRoute() {
	const [query, setQuery] = useState("");
	const [role, setRole] = useState<Role | "All">("All");
	const [rows, setRows] = useState<UserModel[]>(() => usersSeed);

	const filteredUsers = useMemo(() => {
		return rows.filter((row) => {
			const matchesRole = role === "All" || row.role === role;
			const matchesQuery =
				query.trim().length === 0 ||
				row.name.toLowerCase().includes(query.toLowerCase()) ||
				row.email.toLowerCase().includes(query.toLowerCase());
			return matchesRole && matchesQuery;
		});
	}, [query, role, rows]);

	const handleAddUser = () => {
		const name = window.prompt("Name?");
		const email = window.prompt("Email?");
		const roleInput = (window.prompt("Role? (admin|editor|viewer)", "viewer") ??
			"viewer") as Role;
		if (!name || !email) return;
		setRows((previous) => [...previous, { name, email, role: roleInput }]);
	};

	return (
		<motion.div {...pageMotion}>
			<Card>
				<CardHeader
					title="Users"
					action={
						<Button className="gap-2" onClick={handleAddUser}>
							<Plus className="h-4 w-4" />
							Add User
						</Button>
					}
				/>
				<div className="flex flex-col gap-3 md:flex-row md:items-center">
					<label className="relative w-full md:max-w-sm">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
						<input
							className="w-full rounded-xl border border-neutral-200/80 bg-white px-9 py-2 text-sm text-neutral-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-200"
							placeholder="Search users..."
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							type="search"
						/>
					</label>
					<div className="flex gap-1 rounded-xl border border-neutral-200/70 bg-neutral-100/60 p-1 dark:border-neutral-800/70 dark:bg-neutral-900/60">
						{(["All", "admin", "editor", "viewer"] as const).map((option) => (
							<button
								key={option}
								className={cn(
									"rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50",
									role === option &&
										"bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50",
								)}
								onClick={() => setRole(option as Role | "All")}
								type="button"
							>
								{option}
							</button>
						))}
					</div>
				</div>

				<div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800/70">
					<div className="grid grid-cols-[2fr_2fr_1fr_auto] items-center gap-2 border-b border-neutral-200/70 bg-neutral-100/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-800/70 dark:bg-neutral-900/60">
						<span>Name</span>
						<span>Email</span>
						<span>Role</span>
						<span className="text-right">Actions</span>
					</div>
					<div className="max-h-72 overflow-y-auto">
						{filteredUsers.map((user) => (
							<div
								key={`${user.email}-${user.name}`}
								className="grid grid-cols-[2fr_2fr_1fr_auto] items-center gap-2 border-b border-neutral-100 px-4 py-2 text-sm last:border-b-0 dark:border-neutral-800"
							>
								<span className="truncate font-medium text-neutral-700 dark:text-neutral-200">
									{user.name}
								</span>
								<span className="truncate text-neutral-500 dark:text-neutral-400">
									{user.email}
								</span>
								<span className="capitalize text-neutral-600 dark:text-neutral-300">
									<Badge>{user.role}</Badge>
								</span>
								<div className="flex justify-end gap-2">
									<Button
										type="button"
										variant="secondary"
										className="px-2"
										onClick={() =>
											window.alert("Edit is not wired in this demo.")
										}
									>
										Edit
									</Button>
									<Button
										type="button"
										variant="danger"
										className="px-2"
										onClick={() =>
											setRows((previous) =>
												previous.filter((row) => row.email !== user.email),
											)
										}
									>
										Delete
									</Button>
								</div>
							</div>
						))}
						{filteredUsers.length === 0 ? (
							<p className="px-4 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
								No users match your filters.
							</p>
						) : null}
					</div>
				</div>
			</Card>
		</motion.div>
	);
}

function ProfileRoute() {
	const { user, updateUser } = useAuth();
	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");

	useEffect(() => {
		setName(user?.name ?? "");
		setEmail(user?.email ?? "");
	}, [user]);

	return (
		<motion.div {...pageMotion}>
			<Card>
				<CardHeader title="Profile" hint="Edit your personal information" />
				<div className="grid gap-6 md:grid-cols-2">
					<div className="flex items-center gap-4">
						<Avatar name={user?.name ?? "User"} />
						<div>
							<p className="text-xs uppercase tracking-wide text-neutral-400">
								Role
							</p>
							<p className="text-base font-semibold capitalize text-neutral-700 dark:text-neutral-200">
								{user?.role}
							</p>
						</div>
					</div>
					<div />

					<label className="space-y-2">
						<span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
							Name
						</span>
						<input
							className="w-full rounded-xl border border-neutral-200/80 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-200"
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</label>
					<label className="space-y-2">
						<span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
							Email
						</span>
						<input
							className="w-full rounded-xl border border-neutral-200/80 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-200"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							type="email"
						/>
					</label>

					<div className="md:col-span-2 flex justify-end gap-2">
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								setName(user?.name ?? "");
								setEmail(user?.email ?? "");
							}}
						>
							Reset
						</Button>
						<Button type="button" onClick={() => updateUser({ name, email })}>
							Save
						</Button>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}

function SettingsRoute({
	theme,
	onThemeChange,
}: {
	theme: ThemeMode;
	onThemeChange: (mode: ThemeMode) => void;
}) {
	const resetDemoDatabase = () => {
		window.alert("Demo action — hook this into your backend reset script.");
	};

	return (
		<motion.div {...pageMotion}>
			<Card>
				<CardHeader title="Settings" hint="Fine tune your workspace" />
				<div className="space-y-6">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<p className="text-base font-semibold text-neutral-700 dark:text-neutral-200">
								Theme
							</p>
							<p className="text-sm text-neutral-500 dark:text-neutral-400">
								Switch between light and dark
							</p>
						</div>
						<div className="flex items-center gap-3">
							<Sun className="h-4 w-4 text-amber-500" />
							<label className="relative inline-flex cursor-pointer items-center">
								<input
									aria-label="Toggle dark mode"
									checked={theme === "dark"}
									className="peer sr-only"
									onChange={(event) =>
										onThemeChange(event.target.checked ? "dark" : "light")
									}
									type="checkbox"
								/>
								<div className="h-6 w-11 rounded-full bg-neutral-200 transition peer-checked:bg-indigo-500">
									<div className="h-5 w-5 translate-x-1 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
								</div>
							</label>
							<Moon className="h-4 w-4 text-indigo-500" />
						</div>
					</div>

					<div className="h-px bg-neutral-200 dark:bg-neutral-800" />

					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<p className="text-base font-semibold text-neutral-700 dark:text-neutral-200">
								Reset Demo Database
							</p>
							<p className="text-sm text-neutral-500 dark:text-neutral-400">
								Mock trigger for Docker + Prisma reset scripts
							</p>
						</div>
						<Button
							variant="danger"
							className="gap-2"
							onClick={resetDemoDatabase}
						>
							<Database className="h-4 w-4" /> Reset
						</Button>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}

function ForbiddenRoute() {
	return (
		<div className="flex h-[60vh] items-center justify-center">
			<Card className="max-w-md text-center">
				<h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
					Forbidden
				</h2>
				<p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
					You do not have permission to view this page.
				</p>
			</Card>
		</div>
	);
}

function SignInScreen({
	onContinue,
}: {
	onContinue: (user: Partial<UserModel>) => void;
}) {
	const [name, setName] = useState("Benjamin");
	const [email, setEmail] = useState("benjamin@example.com");
	const [role, setRole] = useState<Role>("admin");

	return (
		<div className="flex min-h-[80vh] items-center justify-center p-6">
			<Card className="w-full max-w-md space-y-4">
				<div className="flex items-center gap-2 text-lg font-semibold text-neutral-800 dark:text-neutral-100">
					<Shield className="h-5 w-5 text-indigo-500" /> Sign in
				</div>
				<label className="space-y-2">
					<span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
						Name
					</span>
					<input
						className="w-full rounded-xl border border-neutral-200/80 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-200"
						value={name}
						onChange={(event) => setName(event.target.value)}
					/>
				</label>
				<label className="space-y-2">
					<span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
						Email
					</span>
					<input
						className="w-full rounded-xl border border-neutral-200/80 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-200"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						type="email"
					/>
				</label>
				<div className="space-y-2">
					<span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
						Role
					</span>
					<div className="flex gap-2">
						{(["admin", "editor", "viewer"] as Role[]).map((option) => (
							<Button
								key={option}
								variant={role === option ? "primary" : "secondary"}
								onClick={() => setRole(option)}
								type="button"
								className="capitalize"
							>
								{option}
							</Button>
						))}
					</div>
				</div>
				<Button
					className="w-full"
					onClick={() => onContinue({ name, email, role })}
				>
					Continue
				</Button>
			</Card>
		</div>
	);
}

type ThemeMode = "light" | "dark";

export default function DashboardShell() {
	const [route, setRoute] = useState<Route>("dashboard");
	const [theme, setTheme] = useState<ThemeMode>("dark");
	const [user, setUser] = useState<UserModel | null>({
		name: "Benjamin",
		email: "benjamin@example.com",
		role: "admin",
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	const authValue = useMemo<AuthContextShape>(
		() => ({
			user,
			signIn: (payload) =>
				setUser({
					name: payload.name ?? "Guest User",
					email: payload.email ?? "guest@example.com",
					role: (payload.role as Role) ?? "viewer",
				}),
			signOut: () => setUser(null),
			updateUser: (patch) =>
				setUser((previous) =>
					previous ? { ...previous, ...patch } : previous,
				),
		}),
		[user],
	);

	const allowRoute = (target: Route) => {
		if (!user) return false;
		if (target === "users" && user.role !== "admin") return false;
		return true;
	};

	return (
		<div
			className={cn(
				"min-h-screen bg-neutral-100/60 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100",
			)}
		>
			<AuthContext.Provider value={authValue}>
				{!user ? (
					<SignInScreen
						onContinue={(payload) => {
							authValue.signIn(payload);
							setRoute("dashboard");
						}}
					/>
				) : (
					<div className="mx-auto flex min-h-screen max-w-6xl flex-col">
						<Navbar
							onNavigate={setRoute}
							onThemeChange={setTheme}
							route={route}
							theme={theme}
						/>
						<div className="flex flex-1 overflow-hidden">
							<Sidebar onNavigate={setRoute} route={route} />
							<main className="flex-1 overflow-y-auto bg-neutral-50/60 px-4 py-6 dark:bg-neutral-950/60">
								<AnimatePresence mode="wait">
									<motion.div
										key={route}
										className="mx-auto w-full max-w-4xl space-y-6"
									>
										{route === "dashboard" ? <DashboardRoute /> : null}
										{route === "projects" ? <ProjectsRoute /> : null}
										{route === "users" ? (
											allowRoute("users") ? (
												<UsersRoute />
											) : (
												<ForbiddenRoute />
											)
										) : null}
										{route === "profile" ? <ProfileRoute /> : null}
										{route === "settings" ? (
											<SettingsRoute onThemeChange={setTheme} theme={theme} />
										) : null}
									</motion.div>
								</AnimatePresence>
							</main>
						</div>
					</div>
				)}
			</AuthContext.Provider>
		</div>
	);
}
