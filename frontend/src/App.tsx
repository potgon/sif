import {BrowserRouter as Router, Routes, Route} from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import {ScrollToTop} from "./components/common/ScrollToTop.tsx";

export default function App() {
    return (
        <Router>
            <ScrollToTop/>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/signup" element={<SignUp/>}/>

                {/* Rutas protegidas */}
                <Route element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
                    <Route index path="/" element={<Home/>}/>
                    <Route path="/calendar" element={<Calendar/>}/>
                    <Route path="/blank" element={<Blank/>}/>
                </Route>

                {/* Fallback Route */}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Router>
    );
}