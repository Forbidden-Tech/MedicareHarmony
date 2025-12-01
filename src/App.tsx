import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import BookAppointment from './Pages/BookAppointment';
import MyAppointments from './Pages/MyAppointments';
import MyRecords from './Pages/MyRecords';
import MyInvoices from './Pages/MyInvoices';
import HealthChat from './Pages/HealthChat';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={createPageUrl('Home')} element={<Home />} />
        <Route path={createPageUrl('Dashboard')} element={<Dashboard />} />
        <Route path={createPageUrl('BookAppointment')} element={<BookAppointment />} />
        <Route path={createPageUrl('MyAppointments')} element={<MyAppointments />} />
        <Route path={createPageUrl('MyRecords')} element={<MyRecords />} />
        <Route path={createPageUrl('MyInvoices')} element={<MyInvoices />} />
        <Route path={createPageUrl('HealthChat')} element={<HealthChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
