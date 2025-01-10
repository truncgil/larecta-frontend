import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { Tab, TabList, TabPanel, TabPanels } from '@headlessui/react';
import RolePermissions from './Settings/RolePermissions';
import UserRoles from './Settings/RoleModal';
import { useAuth } from '../contexts/AuthContext'; // Auth context'i oluşturmanız gerekecek

const PermissionSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/permissions`);
      if (!response.ok) throw new Error('Permissions fetch failed');
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('İzinler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePermission = async (permissionData) => {
    try {
      const response = await fetch(`${API_URL}/api/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissionData),
      });
      if (!response.ok) throw new Error('Permission creation failed');
      await fetchPermissions(); // Listeyi yenile
    } catch (error) {
      console.error('İzin oluşturulurken hata:', error);
    }
  };

  const handleUpdatePermission = async (id, permissionData) => {
    try {
      const response = await fetch(`${API_URL}/api/permissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permissionData),
      });
      if (!response.ok) throw new Error('Permission update failed');
      await fetchPermissions();
    } catch (error) {
      console.error('İzin güncellenirken hata:', error);
    }
  };

  const handleDeletePermission = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/permissions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Permission deletion failed');
      await fetchPermissions();
    } catch (error) {
      console.error('İzin silinirken hata:', error);
    }
  };

  // Sadece super-admin erişebilir kontrolü
  if (user?.role !== 'super-admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">Erişim Reddedildi</h1>
          <p className="mt-2 text-bodydark2">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Sistem Ayarları" />
      
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex border-b border-stroke px-4 dark:border-strokedark">
            <Tab className={({ selected }) =>
              `border-b-2 py-4 px-4 text-sm font-medium outline-none ${
                selected
                  ? 'border-primary text-primary'
                  : 'border-transparent text-black hover:text-primary dark:text-white'
              }`
            }>
              Rol ve İzin Yönetimi
            </Tab>
            <Tab className={({ selected }) =>
              `border-b-2 py-4 px-4 text-sm font-medium outline-none ${
                selected
                  ? 'border-primary text-primary'
                  : 'border-transparent text-black hover:text-primary dark:text-white'
              }`
            }>
              Kullanıcı Rolleri
            </Tab>
          </Tab.List>

          <Tab.Panels className="p-6">
            <Tab.Panel>
              <RolePermissions 
                permissions={permissions}
                loading={loading}
                onCreatePermission={handleCreatePermission}
                onUpdatePermission={handleUpdatePermission}
                onDeletePermission={handleDeletePermission}
              />
            </Tab.Panel>
            <Tab.Panel>
              <UserRoles />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default PermissionSettings;
