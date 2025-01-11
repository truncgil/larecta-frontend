import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { Tab, TabList, TabPanel, TabPanels } from '@headlessui/react';
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
import { createStore } from 'devextreme-aspnet-data-nojquery';
import 'devextreme/dist/css/dx.light.css';

interface TemplateProps {
  pageTitle: string;
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
  dataGridConfig?: {
    apiUrl: string;
    columns: Array<{
      dataField: string;
      caption: string;
      allowEditing?: boolean;
      rules?: {
        required?: boolean;
        maxLength?: number;
      };
    }>;
  };
  requiredRole?: string;
}

const Template = ({ pageTitle, tabs, dataGridConfig, requiredRole }: TemplateProps) => {
  const [activeTab, setActiveTab] = useState(0);

  // API store yapılandırması
  const dataStore = dataGridConfig
    ? createStore({
        key: 'id',
        loadUrl: `${dataGridConfig.apiUrl}`,
        insertUrl: `${dataGridConfig.apiUrl}`,
        updateUrl: `${dataGridConfig.apiUrl}/`,
        deleteUrl: `${dataGridConfig.apiUrl}`,
        onBeforeSend: (_method, ajaxOptions) => {
          const token = localStorage.getItem('token');
          const id = ajaxOptions.data?.key;

          if (ajaxOptions.method === 'PUT' && id) {
            ajaxOptions.url = `${dataGridConfig.apiUrl}/${id}`;
          }
          if (ajaxOptions.method === 'DELETE' && id) {
            ajaxOptions.url = `${dataGridConfig.apiUrl}/${id}`;
          }

          ajaxOptions.headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          };
        },
      })
    : null;

 

  return (
    <>
      <Breadcrumb pageName={pageTitle} />
      
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <TabList className="flex border-b border-stroke px-4 dark:border-strokedark">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  `border-b-2 py-4 px-4 text-sm font-medium outline-none ${
                    selected
                      ? 'border-primary text-primary'
                      : 'border-transparent text-black hover:text-primary dark:text-white'
                  }`
                }
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>

          <Tab.Panels className="p-6">
            {tabs.map((tab, index) => (
              <Tab.Panel key={index}>
                {dataGridConfig && index === 0 ? (
                  <DataGrid
                    dataSource={dataStore}
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

                    {dataGridConfig.columns.map((column, idx) => (
                      <Column
                        key={idx}
                        dataField={column.dataField}
                        caption={column.caption}
                        allowEditing={column.allowEditing}
                      >
                        {column.rules?.required && (
                          <RequiredRule message={`${column.caption} zorunludur`} />
                        )}
                        {column.rules?.maxLength && (
                          <StringLengthRule
                            max={column.rules.maxLength}
                            message={`${column.caption} ${column.rules.maxLength} karakterden uzun olamaz`}
                          />
                        )}
                      </Column>
                    ))}

                    <Summary>
                      <TotalItem column="id" summaryType="count" />
                    </Summary>
                  </DataGrid>
                ) : (
                  tab.content
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default Template; 