import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef, 
  ICellRendererParams, 
  GridApi, 
  GridReadyEvent,
} from 'ag-grid-community';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
    
ModuleRegistry.registerModules([ AllCommunityModule ]);

interface GenericDataGridProps {
  rowData: any[];
  columnDefs: ColDef[];
  onDelete: (id: string) => void;
}

const DataGridComponent: React.FC<GenericDataGridProps> = ({ 
  rowData, 
  columnDefs,
  onDelete
}) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const navigate = useNavigate();

  const actionColumn: ColDef = {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: (params: ICellRendererParams) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => {
            console.log('Navigating to detail page ==>', params.data._id);
            navigate(`/detail/${params.data._id}`);
          }}
        >
          View
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          size="small"
          onClick={() => onDelete(params.data._id)}
        >
          Delete
        </Button>
      </div>
    ),
    sortable: false,
    filter: false,
    width: 170,
    pinned: 'right'
  };

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const exportToCsv = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  };

  console.log('columnDefs ==>', [...columnDefs, actionColumn]);

  return (
    <div className="ag-theme-material" style={{ height: 600, width: '100%' }}>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={exportToCsv} style={{ marginRight: '10px' }}>
          Export to CSV
        </Button>
      </div>
      {columnDefs.length > 0 && (
        <AgGridReact
          rowData={rowData}
          theme="legacy"
          columnDefs={[...columnDefs, actionColumn]}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          onGridReady={onGridReady}
          domLayout='autoHeight'
          suppressCellFocus={true}
          defaultColDef={{
            flex: 1,
            minWidth: 200,
            filter: true,
            sortable: true,
            resizable: true,
            floatingFilter: true,
          }}
        />
      )}
    </div>
  );
};

export default DataGridComponent;