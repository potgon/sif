import {BrowserRouter as Router, Routes, Route} from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import {ScrollToTop} from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp.tsx";

export default function App() {
    return (
        <>
            <Router>
                <ScrollToTop/>
                <Routes>
                    {/* Dashboard Layout */}
                    <Route element={<AppLayout/>}>
                        <Route index path="/" element={<Home/>}/>

                        {/* Others Page */}
                        <Route path="/calendar" element={<Calendar/>}/>
                        <Route path="/blank" element={<Blank/>}/>

                    </Route>

                    {/* Auth Layout */}
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Fallback Route */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </>
    );
}
