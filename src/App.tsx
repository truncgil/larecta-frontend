import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import Main from './pages/Dashboard/Main';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PermissionSettings from './pages/PermissionSettings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Swal from 'sweetalert2';
import { AuthProvider } from './contexts/AuthContext';

// Global Sweetalert2 yapılandırması
const sweetAlert2Config = Swal.mixin({
  customClass: {
    confirmButton: 'bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors',
    cancelButton: 'bg-bodydark1 text-white px-4 py-2 rounded-lg mr-2 hover:bg-bodydark1/90 transition-colors'
  },
  buttonsStyling: false // Sweetalert'in kendi stil özelliklerini devre dışı bırak
});

// Global olarak yapılandırmayı uygula


window.API_URL = "http://localhost:8000/api";

const CLEAN_PAGES = [
    '/auth/signin', 
    '/auth/signup', 
    '/auth/forgot-password', 
    '/auth/reset-password'
  ];



function App() {

  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>

    <DefaultLayout showSidebar={!CLEAN_PAGES.includes(pathname)}>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Main Dashboard | Larecta - Tailwind CSS Admin Dashboard Template" />
              <Main />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | Larecta - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | Larecta - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | Larecta - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | Larecta - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | Larecta - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | Larecta - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/permissions"
          element={
            <>
              <PageTitle title="Settings | Larecta - Tailwind CSS Admin Dashboard Template" />
              <PermissionSettings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | Larecta - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | Larecta - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | Larecta - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | Larecta - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | Larecta - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
    </AuthProvider>
  );
}

export default App;
