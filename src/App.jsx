import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import MainLayout from "./layout/MainLayout";
import SearchPatient from "./pages/patient/SearchPatient";
import PatientDetails from "./pages/patient/PatientDetails";
import ReferralDetails from "./pages/patient/ReferralDetails";
import Dashboard from "./pages/mdt/Dashboard";
import MDTList from "./pages/admin/MDTList";
import Clinician from "./pages/admin/Clinician";
import Mapping from "./pages/admin/Mapping";
import Meetings from "./pages/mdt/Meetings";
import MeetingDetails from "./pages/mdt/MeetingDetails";
import Reports from "./pages/Reports";
import Tracking from "./pages/Tracking";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login has no sidebar */}
        <Route path="/" element={<Login />} />

        {/* All these pages share the Layout (sidebar + header) */}
        <Route element={<MainLayout />}>
          <Route path="/patient/search-patient" element={<SearchPatient />} />
          <Route path="/search-patient" element={<SearchPatient />} />
          <Route
            path="/search-patient/:id"
            element={<PatientDetails />}
          />
          <Route
            path="/search-patient/:patientId/referrals/:referralId"
            element={<ReferralDetails />}
          />
          <Route path="/mdt/dashboard" element={<Dashboard />} />
          <Route path="/admin/mdtList" element={<MDTList />} />
          <Route path="/admin/clinician" element={<Clinician />} />
          <Route path="/admin/mapping" element={<Mapping />} />
          <Route path="/mdt/meetings" element={<Meetings />} />
          <Route path="/mdt/meetings/:id" element={<MeetingDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tracking" element={<Tracking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}