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
import { createCustomStore } from '../utils/apService';


const Template = () => {
  //const { user } = useAuth();

  const typeStore = createCustomStore('types');

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
                  mode="batch"
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
