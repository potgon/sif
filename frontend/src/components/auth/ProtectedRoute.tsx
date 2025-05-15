import {useAuth} from "../../hooks/useAuth"
import {JSX} from "react";

interface Props {
    children: JSX.Element
}

export default function ProtectedRoute({children}: Readonly<Props>) {
    const {isAuthenticated} = useAuth()

    if (!isAuthenticated) {
        window.location.href = "/signin"
    }

    return children
}
