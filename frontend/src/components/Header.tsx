"use client"

import { useState } from "react"
import { format } from "date-fns"

const Header = () => {
    const [currentDate] = useState(new Date())

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">{format(currentDate, "MMMM yyyy")}</h2>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{format(currentDate, "EEEE, MMMM d, yyyy")}</span>
            </div>
        </header>
    )
}

export default Header
