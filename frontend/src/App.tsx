import {BrowserRouter as Router, Routes, Route} from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import {ScrollToTop} from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

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

                        {/* Tables */}
                        <Route path="/basic-tables" element={<BasicTables/>}/>

                        {/* Charts */}
                        <Route path="/line-chart" element={<LineChart/>}/>
                        <Route path="/bar-chart" element={<BarChart/>}/>
                    </Route>

                    {/* Fallback Route */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </>
    );
}
