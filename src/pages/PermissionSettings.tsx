import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { Tab, TabList, TabPanel, TabPanels } from '@headlessui/react';
//import UserRoles from './Settings/RoleModal';
import { useAuth } from '../contexts/AuthContext';
// DevExtreme importları
import DataGrid, {
  Column,
  Editing,
  FilterRow,
  HeaderFilter,
  GroupPanel,
  Scrolling,
  Grouping,
  Summary,
  RequiredRule,
  StringLengthRule,
  TotalItem,
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import 'devextreme/data/odata/store';
import { createStore } from 'devextreme-aspnet-data-nojquery';


const PermissionSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // API store yapılandırması
  const permissionsStore = createStore({
    key: 'id',
    loadUrl: `${API_URL}/permissions`,
    insertUrl: `${API_URL}/permissions`,
    updateUrl: `${API_URL}/permissions/`,
    deleteUrl: `${API_URL}/permissions`,
    onBeforeSend: (method, ajaxOptions) => {
      const token = localStorage.getItem('token');

      const id = ajaxOptions.data?.key; // Güncellenen veya silinen kaydın ID'si

      console.log(ajaxOptions);
      // Update veya Delete için ID'yi URL'ye ekle
      if (ajaxOptions.method === 'PUT' && id) {
        ajaxOptions.url = `${API_URL}/permissions/${id}`;
      }
      if (ajaxOptions.method === 'DELETE' && id) {
        ajaxOptions.url = `${API_URL}/permissions/${id}`;
      }
      console.log(ajaxOptions);

      ajaxOptions.headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    },
  });

  // Erişim kontrolü
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
          <TabList className="flex border-b border-stroke px-4 dark:border-strokedark">
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
          </TabList>

          <Tab.Panels className="p-6">
            <Tab.Panel>
              <DataGrid
                dataSource={permissionsStore}
                showBorders={true}
                remoteOperations={true}
                height={600}
              >
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <GroupPanel visible={true} />
                <Scrolling mode="virtual" />
                <Editing
                  mode="popup"
                  allowUpdating={true}
                  allowDeleting={true}
                  allowAdding={true}
                />
                <Grouping autoExpandAll={false} />

                <Column dataField="id" caption="ID" allowEditing={false} />
                <Column dataField="name" caption="İzin Adı">
                  <RequiredRule message="İzin adı zorunludur" />
                  <StringLengthRule max={50} message="İzin adı 50 karakterden uzun olamaz" />
                </Column>
                <Column dataField="description" caption="Açıklama">
                  <StringLengthRule max={200} message="Açıklama 200 karakterden uzun olamaz" />
                </Column>
                <Column dataField="type" caption="Tür">
                  <RequiredRule message="Tür alanı zorunludur" />
                </Column>
                <Column dataField="status" caption="Durum">
                  <RequiredRule message="Durum alanı zorunludur" />
                </Column>

                <Summary>
                  <TotalItem
                    column="id"
                    summaryType="count"
                  />
                </Summary>
              </DataGrid>
            </Tab.Panel>
            <Tab.Panel>
      
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default PermissionSettings;
