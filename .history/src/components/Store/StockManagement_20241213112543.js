import { 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Button
  } from '@mui/material';
  
  function StockManagement() {
    return (
      <div>
        <Typography variant="h4" sx={{ mb: 4 }}>Stock Management</Typography>
        <Button variant="contained" sx={{ mb: 3 }}>Add New Book</Button>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((book) => (
                <TableRow key={book}>
                  <TableCell>Book {book}</TableCell>
                  <TableCell>Author {book}</TableCell>
                  <TableCell>$19.99</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>
                    <Button size="small">Edit</Button>
                    <Button size="small" color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
  
  export default StockManagement;