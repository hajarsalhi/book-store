import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import { adminAPI } from '../../services/api';
import * as XLSX from 'xlsx';

const BulkUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const downloadTemplate = () => {
    const template = [
      {
        title: 'Example Book',
        author: 'Author Name',
        description: 'Book description',
        price: '29.99',
        stock: '100',
        category: 'Fiction',
        isbn: '1234567890',
        imageUrl: 'https://example.com/image.jpg'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'book_upload_template.xlsx');
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          setPreviewData(data);
          setPreviewOpen(true);
          setError(null);
        } catch (err) {
          setError('Error reading file. Please ensure it matches the template format.');
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleUpload = async () => {
    if (!previewData.length) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const totalBooks = previewData.length;
      let processed = 0;

      // Upload books in batches of 10
      for (let i = 0; i < previewData.length; i += 10) {
        const batch = previewData.slice(i, i + 10);
        await adminAPI.bulkUploadBooks(batch);
        
        processed += batch.length;
        setUploadProgress((processed / totalBooks) * 100);
      }

      setSuccess(`Successfully uploaded ${previewData.length} books`);
      setSelectedFile(null);
      setPreviewData([]);
      setPreviewOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading books');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, backgroundColor: '#FFF8DC' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2C1810' }}>
          Bulk Book Upload
        </Typography>

        <Box sx={{ my: 3 }}>
          <Button
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={downloadTemplate}
            sx={{
              color: '#8B4513',
              borderColor: '#8B4513',
              '&:hover': {
                borderColor: '#654321',
                backgroundColor: 'rgba(139, 69, 19, 0.04)'
              }
            }}
          >
            Download Template
          </Button>
        </Box>

        <Box
          sx={{
            border: '2px dashed #8B4513',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(139, 69, 19, 0.04)',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            type="file"
            id="file-input"
            hidden
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: '#8B4513', mb: 2 }} />
          <Typography variant="h6" gutterBottom sx={{ color: '#2C1810' }}>
            Click to upload or drag and drop
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported formats: XLSX, XLS, CSV
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress} 
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(139, 69, 19, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#8B4513'
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              Uploading... {Math.round(uploadProgress)}%
            </Typography>
          </Box>
        )}

        <Dialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ backgroundColor: '#FFF8DC' }}>
            Preview Books
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: '#FFF8DC' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((book, index) => (
                    <TableRow key={index}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>${book.price}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell>{book.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#FFF8DC', p: 2 }}>
            <Button 
              onClick={() => setPreviewOpen(false)}
              sx={{ color: '#8B4513' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploading}
              sx={{
                backgroundColor: '#8B4513',
                '&:hover': { backgroundColor: '#654321' }
              }}
            >
              Upload {previewData.length} Books
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default BulkUpload; 