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
import { createCustomStore2, apiRequest } from '../utils/apService';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from 'devextreme-react/button';


const SpecificContents = () => {
  //const { user } = useAuth();
  const navigate = useNavigate();

  const typeName = window.location.pathname.split('/').pop();
  const [contentType, setContentType] = useState<any>(null);

  useEffect(() => {
    const fetchTypeInfo = async () => {
      const result = await apiRequest(`/admin/types/${typeName}`, 'GET');
     
      setContentType(result);
    };
    
    fetchTypeInfo();
  }, [typeName]);

  const handleEdit = (e: any) => {
    navigate(`/admin/contents/edit/${e.row.data.id}`);
  };

  const handleInitNewRow = (e: any) => {
    e.data.type = typeName;
  };

  const specificTypeStore = createCustomStore2('contents',`contents/type/${typeName}`);
  return (
    <>
      <Breadcrumb pageName={`${contentType?.name || ''}`} />
      
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
       
              <DataGrid
                dataSource={specificTypeStore}
                showBorders={true}
                remoteOperations={false}
                height={600}
                onInitNewRow={handleInitNewRow}
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
                <Column dataField="type" visible={false} />

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

export default SpecificContents;
