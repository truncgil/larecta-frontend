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
import { createCustomStore, createLookupStore } from '../utils/apService';
import { useNavigate } from 'react-router-dom';
import { Button } from 'devextreme-react/button';


const Contents = () => {
  const navigate = useNavigate();
  const contentsStore = createCustomStore(`contents`);

  const handleEdit = (e: any) => {
    navigate(`/admin/contents/edit/${e.row.data.id}`);
  };

  return (
    <>
      <Breadcrumb pageName="Contents" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <DataGrid
          dataSource={contentsStore}
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
          <Column dataField="type" caption="Type" lookup={createLookupStore('types', 'name', 'slug')}>
            <RequiredRule message="Type is required" />
          </Column>
          <Column dataField="status" caption="Status" lookup={{
            dataSource: [
              { id: 'draft', name: 'Draft' },
              { id: 'published', name: 'Published' },
              { id: 'archived', name: 'Archived' }
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

          <Column
            width={110}
            caption="Actions"
            cellRender={(cellData: any) => {
              return (
                  <Button
                    icon="edit"
                    hint="Edit"
                    onClick={() => handleEdit({ row: { data: cellData.data } })}
                  />
                 
              );
            }}
          />

          <Summary>
            <TotalItem column="id" summaryType="count" />
          </Summary>
        </DataGrid>
      </div>
    </>
  );
};

export default Contents;
