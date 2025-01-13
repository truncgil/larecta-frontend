import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

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
import CustomStore from 'devextreme/data/custom_store';


const Template = () => {
  //const { user } = useAuth();
  const token = localStorage.getItem('token');

  const typeStore = {
    store: new CustomStore({
      key: 'id',
      load: () => {
        return fetch(`${API_URL}/admin/types`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(response => response.json());
      },
      update: (key, values) => {
        return fetch(`${API_URL}/admin/types/${key}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
      },
      remove: (key) => {
        return fetch(`${API_URL}/admin/types/${key}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(() => void 0);
      },
      insert: (values) => {
        return fetch(`${API_URL}/admin/types`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
      }
    })
  };
  

  return (
    <>
      <Breadcrumb pageName="Types" />
      
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
       
              <DataGrid
                dataSource={typeStore}
                showBorders={true}
                remoteOperations={false}
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
                <Column dataField="name" caption="Name">
                  <RequiredRule message="Name field is required" />
                  <StringLengthRule max={255} message="Name cannot be longer than 255 characters" />
                </Column>
                <Column dataField="description" caption="Description">
                  <StringLengthRule max={255} message="Description cannot be longer than 255 characters" />
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

export default Template;
