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
  Lookup,
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
    loadUrl: `${API_URL}/admin/contents`,
    insertUrl: `${API_URL}/admin/contents`,
    updateUrl: `${API_URL}/admin/contents/`,
    deleteUrl: `${API_URL}/admin/contents`,
    onBeforeSend: (_method: any, ajaxOptions) => {
      const token = localStorage.getItem('token');

      const id = ajaxOptions.data?.key; // Güncellenen veya silinen kaydın ID'si

      console.log(ajaxOptions);
      // Update veya Delete için ID'yi URL'ye ekle
      if (ajaxOptions.method === 'PUT' && id) {
        ajaxOptions.url = `${API_URL}/admin/contents/${id}`;
      }
      if (ajaxOptions.method === 'DELETE' && id) {
        ajaxOptions.url = `${API_URL}/admin/contents/${id}`;
      }
      console.log(ajaxOptions);

      ajaxOptions.headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    },
  });



  return (
    <>
      <Breadcrumb pageName="Template" />
      
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
       
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
                <Column dataField="type" caption="İçerik Türü">
                  <StringLengthRule max={255} message="İçerik türü 255 karakterden uzun olamaz" />
                </Column>
                <Column dataField="title" caption="Başlık">
                  <RequiredRule message="Başlık alanı zorunludur" />
                  <StringLengthRule max={255} message="Başlık 255 karakterden uzun olamaz" />
                </Column>
                <Column dataField="slug" caption="URL">
                  <RequiredRule message="URL alanı zorunludur" />
                  <StringLengthRule max={255} message="URL 255 karakterden uzun olamaz" />
                </Column>
                <Column dataField="content" caption="İçerik" cellTemplate="contentTemplate">
                  <StringLengthRule max={2000} message="İçerik 2000 karakterden uzun olamaz" />
                </Column>
                <Column dataField="meta" caption="Meta Veriler" cellTemplate="metaTemplate" />
                <Column dataField="status" caption="Durum">
                  <RequiredRule message="Durum alanı zorunludur" />
                  <Lookup
                    dataSource={[
                      { id: 'draft', text: 'Taslak' },
                      { id: 'published', text: 'Yayında' },
                      { id: 'archived', text: 'Arşivlenmiş' }
                    ]}
                    valueExpr="id"
                    displayExpr="text"
                  />
                </Column>

                <Summary>
                  <TotalItem
                    column="id"
                    summaryType="count"
                  />
                </Summary>
              </DataGrid>
            
      </div>
    </>
  );
};

export default PermissionSettings;
