import { NavLink } from "react-router-dom"

const Sidebar = () => {
    const navItems = [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/incomes", label: "Incomes" },
        { path: "/transactions", label: "Transactions" },
        { path: "/categories", label: "Categories" },
        { path: "/debts", label: "Debts" },
    ]

    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold text-primary-600">Finance App</h1>
            </div>
            <nav className="p-2">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded-md ${
                                        isActive ? "bg-primary-100 text-primary-700" : "text-gray-700 hover:bg-gray-100"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
