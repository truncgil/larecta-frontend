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
import { createCustomStore2, createLookupStore } from '../utils/apService';


const Template = () => {
  //const { user } = useAuth();

  const specificTypeStore = createCustomStore2('contents',`contents/type/${window.location.pathname.split('/').pop()}`);
  return (
    <>
      <Breadcrumb pageName="Types" />
      
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
       
              <DataGrid
                dataSource={specificTypeStore}
                showBorders={true}
                remoteOperations={false}
                height={600}
              >
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <GroupPanel visible={true} />
                <Scrolling mode="virtual" />
                <Editing
                  mode="batch"
                  allowUpdating={true}
                  allowDeleting={true}
                  allowAdding={true}
                />
                <Grouping autoExpandAll={false} />

                <Column dataField="id" caption="ID" allowEditing={false} />
                <Column dataField="title" caption="Title">
                  <RequiredRule message="Title field is required" />
                  <StringLengthRule max={255} message="Title cannot be longer than 255 characters" />
                </Column>
                <Column dataField="slug" caption="URL">
                  <RequiredRule message="URL field is required" />
                  <StringLengthRule max={255} message="URL cannot be longer than 255 characters" />
                </Column>
              
                <Column dataField="status" caption="Durum" lookup={{
                  dataSource: [
                    { id: 'draft', name: 'Draft' },
                    { id: 'published', name: 'Published' },
                    { id: 'pending', name: 'Pending' }
                  ],
                  displayExpr: 'name',
                  valueExpr: 'id'
                }}>
                  <RequiredRule message="Status field is required" />
                </Column>
                <Column dataField="parent_id" caption="Parent Content" />
                <Column dataField="order" caption="Order" dataType="number">
                  <RequiredRule message="Order field is required" />
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
