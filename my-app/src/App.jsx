
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Workflow from "./pages/Workflow";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout/>}>
        <Route path="/" element={<Dashboard />} ></Route>
        <Route path="/workflow" element={<Workflow/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;