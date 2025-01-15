import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useState } from 'react';

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


const Types = () => {

  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const typeStore = createCustomStore('types');
  const typeMetaStore = createCustomStore(`types/${selectedTypeId}/metas`, 'metas');

  return (
    <>
      <Breadcrumb pageName="Types" />
      
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <DataGrid
          dataSource={typeStore}
          showBorders={true}
          remoteOperations={false}
          height={500}
          onSelectionChanged={(e) => {
            const selectedRow = e.selectedRowsData[0];
            setSelectedTypeId(selectedRow?.id || null);
          }}
          /*
          onEditorPreparing={(e) => {
            if (e.dataField === 'name') {
              e.editorOptions.onValueChanged = (args: any) => {
                if (e.row) {
                  e.row.data.name = args.value;
                  e.row.data.slug = args.value
                    .toLowerCase()
                    
                    .replace(/[ğ]/g, 'g')
                    .replace(/[ı]/g, 'i') 
                    .replace(/[ö]/g, 'o')
                    .replace(/[ş]/g, 's')
                    .replace(/[ü]/g, 'u')
                    .replace(/[ç]/g, 'c')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    
                    .replace(/[\u0300-\u036f]/g, '') // Diacritics kaldır
                    .replace(/[^a-z0-9\s-]/g, '')
                    .trim();
                }
              };
            }
              
          }}
            */
          selection={{ mode: 'single' }}
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
          <Column dataField="slug" caption="Slug" >
            </Column>
          <Column dataField="description" caption="Description">
            <StringLengthRule max={255} message="Description cannot be longer than 255 characters" />
          </Column>
          <Column dataField="icon" caption="Icon" cellRender={(cellData) => {
            console.log(cellData.value);
              return (
                <div className="flex items-center gap-2">
                  <span className="material-icons">{cellData.value}</span>
                  <span>{cellData.value}</span>
                </div>
              );
            }}>
           
          </Column>
          <Column dataField="status" caption="Status" lookup={{
            dataSource: [
              { id: 'active', name: 'Active' },
              { id: 'inactive', name: 'Inactive' },
              { id: 'pending', name: 'Pending' }
            ],
            displayExpr: 'name',
            valueExpr: 'id'
          }}>
            <RequiredRule message="Yayınlanma durumu seçilmesi zorunludur" />
          </Column>
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

        {selectedTypeId && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Type Metadata</h3>
            <DataGrid
              dataSource={typeMetaStore}
              showBorders={true}
              remoteOperations={false}
              height={500}
            >
              <FilterRow visible={true} />
              <HeaderFilter visible={true} />
              <Editing
                mode="batch"
                allowUpdating={true}
                allowDeleting={true}
                allowAdding={true}
              />

              <Column dataField="id" caption="ID" allowEditing={false} />
              <Column dataField="name" caption="Name">
                <RequiredRule message="Name alanı zorunludur" />
                <StringLengthRule max={255} message="Name 255 karakterden uzun olamaz" />
              </Column>
              
              <Column dataField="field_type" caption="Field Type" lookup={{
                dataSource: [
                  { id: 'text', name: 'Text' },
                  { id: 'textarea', name: 'Textarea' },
                  { id: 'select', name: 'Select' },
                  { id: 'checkbox', name: 'Checkbox' },
                  { id: 'radio', name: 'Radio' },
                  { id: 'file', name: 'File' },
                  { id: 'number', name: 'Number' },
                  { id: 'email', name: 'Email' },
                  { id: 'password', name: 'Password' },
                  { id: 'date', name: 'Date' },
                  { id: 'datetime', name: 'Date Time' },
                ],
                displayExpr: 'name',
                valueExpr: 'id'
              }}>
                <RequiredRule message="Field Type alanı zorunludur" />
              </Column>
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
        )}
      </div>
    </>
  );
};

export default Types;
