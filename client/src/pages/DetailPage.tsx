import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchItem } from '../services/api';

const DetailPage = () => {
  console.log('🧭 DetailPage mounted');
  
  const { id } = useParams<{ id: string }>();
  console.log('📦 useParams result:', id);

  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ 打印 fetchItem 内容，确认它是不是你预期中的函数
  console.log('fetchItem content 👉', fetchItem.toString());

  useEffect(() => {
    console.log('DetailPage fetch id 👉', id);
    if (!id) {
      console.log('❗ No ID found in params');
      return;
    }

    const loadItemData = async () => {
        console.log('🚀 loadItemData running...');
        if (id) {
            setLoading(true);
            try {
                console.log('📞 Calling fetchItem now...');
                const data = await fetchItem(id);
                console.log('✅ Data fetched:', data);
                setItem(data);
            } catch (error) {
                console.error('Failed to fetch item details:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    loadItemData();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" align="center">
          Item not found
        </Typography>
        <Box mt={2} display="flex" justifyContent="center">
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back to List
          </Button>
        </Box>
      </Container>
    );
  }

  // 排除系统字段
  const { _id, __v, createdAt, updatedAt, ...displayData } = item;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to List
      </Button>
      
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            {item.Brand} {item.Model} Details
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Field</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(displayData).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </TableCell>
                    <TableCell>
                      {value === null || value === undefined
                        ? '-'
                        : typeof value === 'object'
                            ? JSON.stringify(value)
                            : value.toString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DetailPage;