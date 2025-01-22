import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import 'material-icons/iconfont/material-icons.css';
import 'devextreme/dist/css/dx.material.teal.light.css';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PermissionSettings from './pages/PermissionSettings';
import Template from './admin/Template';
import Types from './admin/Types';
import Contents from './admin/Contents';
import ContentEdit from './admin/ContentEdit';
import SpecificContents from './admin/SpecificContents';

import DefaultLayout from './layout/DefaultLayout';
import Swal from 'sweetalert2';
import { AuthProvider } from './contexts/AuthContext';


// Global Sweetalert2 yapılandırması
Swal.mixin({
  customClass: {
    confirmButton: 'bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors',
    cancelButton: 'bg-bodydark1 text-white px-4 py-2 rounded-lg mr-2 hover:bg-bodydark1/90 transition-colors'
  },
  buttonsStyling: false
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
          path="/admin/template"
          element={
            <>
              <PageTitle title="Template | Larecta - Content Management System" />
              <Template />
            </>
          }
        />
        <Route
          path="/admin/contents"
          element={
            <>
              <PageTitle title="Contents | Larecta - Content Management System" />
              <Contents />
            </>
          }
        />
        <Route
          path="/admin/contents/edit/:id"
          element={
            <>
              <PageTitle title="Contents | Larecta - Content Management System" />
              <ContentEdit />
            </>
          }
        />
        <Route
          path="/admin/type/:typeName"
          element={
            <>
            
              <PageTitle title="Larecta - Content Management System" />
              <SpecificContents />
            </>
          }
        />
        <Route
          path="/admin/types"
          element={
            <>
              <PageTitle title="Types | Larecta - Content Management System" />
              <Types />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | Larecta - Content Management System" />
              <Profile />
            </>
          }
        />
       
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | Larecta - Content Management System" />
              <Settings />
            </>
          }
        />
        <Route
          path="/permissions"
          element={
            <>
              <PageTitle title="Settings | Larecta - Content Management System" />
              <PermissionSettings />
            </>
          }
        />
        
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | Larecta - Content Management System" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | Larecta - Content Management System" />
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
