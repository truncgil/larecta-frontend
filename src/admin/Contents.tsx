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
      <Breadcrumb pageName="İçerikler" />
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
          <Column dataField="title" caption="Başlık">
            <RequiredRule message="Başlık alanı zorunludur" />
            <StringLengthRule max={255} message="Başlık 255 karakterden uzun olamaz" />
          </Column>
          <Column dataField="slug" caption="URL">
            <RequiredRule message="URL alanı zorunludur" />
            <StringLengthRule max={255} message="URL 255 karakterden uzun olamaz" />
          </Column>
          <Column dataField="type" caption="Tip" lookup={createLookupStore('types', 'name', 'slug')}>
            <RequiredRule message="Tip alanı zorunludur" />
          </Column>
          <Column dataField="status" caption="Durum" lookup={{
            dataSource: [
              { id: 'draft', name: 'Taslak' },
              { id: 'published', name: 'Yayında' },
              { id: 'pending', name: 'Beklemede' }
            ],
            displayExpr: 'name',
            valueExpr: 'id'
          }}>
            <RequiredRule message="Durum alanı zorunludur" />
          </Column>
          <Column dataField="parent_id" caption="Üst İçerik" />
          <Column dataField="order" caption="Sıra" dataType="number">
            <RequiredRule message="Sıra alanı zorunludur" />
          </Column>

          <Column
            width={110}
            caption="İşlemler"
            cellRender={(cellData: any) => {
              return (
                  <Button
                    icon="edit"
                    hint="Düzenle"
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

