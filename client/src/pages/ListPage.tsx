import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataGridComponent from '../components/DataGridComponent';
import CSVUploader from '../components/CSVUploader';
import { 
  TextField, 
  Container, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Button,
  Typography,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { fetchData, searchData, filterData, getColumns, deleteDataItem } from '../services/api';

const ListPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  //const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  
  // filter
  //const [filterColumn, setFilterColumn] = useState('');
  //const [filterOperator, setFilterOperator] = useState('contains');
  //const [filterValue, setFilterValue] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const columnsResponse = await getColumns();

      console.log('Fetched columns:', columnsResponse);

      setColumns(columnsResponse);
      
      const result = await fetchData();

      console.log('Fetched row data:', result);

      setData(result);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // dynamically generate column definitions
  const columnDefs = useMemo(() => {
    return columns.map(column => ({
      headerName: column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      field: column,
      filter: 'agTextColumnFilter',
      minWidth: 150
    }));
  }, [columns]);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const result = await searchData(searchTerm);
        setData(result);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      loadData();
    }
  };

  /** 
   * const handleFilter = async () => {
    if (!filterColumn) return;
    
    setLoading(true);
    try {
      const result = await filterData(filterColumn, filterOperator, filterValue);
      setData(result);
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
      setFilterAnchorEl(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterColumn('');
    setFilterOperator('contains');
    setFilterValue('');
    loadData();
  };
   * 
  */

  const handleDelete = async (id: string) => {
    try {
      await deleteDataItem(id);
      setData(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generic DataGrid
      </Typography>

      {/* CSV upload */}
      <CSVUploader onUploadSuccess={loadData} />

      {/* search and filter panel */}
      <Box sx={{ 
        mb: 3,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        maxHeight: '100px',
      }}>
        <Grid container spacing={2} alignItems="center">
            {/* 搜索框 */}
            <Grid size={{ xs: 12, md: 10 }}>
            <TextField
                label="Search all data..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                fullWidth
                size="small"
            />
            </Grid>

            {/* 按钮 */}
            <Grid size={{ xs: 12, md: 2 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                fullWidth
                sx={{ height: '40px' }} // 明确指定高度，与输入框一致
            >
                Search
            </Button>
            </Grid>
  </Grid>
      </Box>
      
      {/* DataGrid */}
      {loading ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="400px"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading data...
          </Typography>
        </Box>
      ) : (
        <DataGridComponent
          rowData={data}
          columnDefs={columnDefs}
          onDelete={handleDelete}
        />
      )}
    </Container>
  );
};

export default ListPage;