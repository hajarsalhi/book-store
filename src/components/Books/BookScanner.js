import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import Quagga from 'quagga';
import { googleBooksAPI } from '../../services/api';

const BookScanner = ({ onBookFound }) => {
  const [scanning, setScanning] = useState(false);
  const [isbn, setIsbn] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quaggaInitialized, setQuaggaInitialized] = useState(false);
  const scannerRef = useRef(null);

  // Cleanup Quagga on component unmount
  useEffect(() => {
    return () => {
      if (quaggaInitialized) {
        Quagga.stop();
        setQuaggaInitialized(false);
      }
    };
  }, [quaggaInitialized]);

  const initializeScanner = async () => {
    if (!scannerRef.current) {
      setError('Scanner container not ready');
      return;
    }

    try {
      await Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: 640,
            height: 480,
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "isbn_reader"]
        },
        locate: true
      });

      Quagga.start();
      setQuaggaInitialized(true);

      Quagga.onDetected((result) => {
        const scannedIsbn = result.codeResult.code;
        console.log('Barcode detected:', scannedIsbn);
        setIsbn(scannedIsbn);
        handleSearch(scannedIsbn);
      });

    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError('Failed to initialize scanner');
      setScanning(false);
    }
  };

  const handleStart = () => {
    setError(null);
    setScanning(true);
    initializeScanner();
  };

  const handleStop = () => {
    if (quaggaInitialized) {
      Quagga.stop();
      setQuaggaInitialized(false);
    }
    setScanning(false);
  };

  const handleSearch = async (searchIsbn = isbn) => {
    if (!searchIsbn) {
      setError('Please enter an ISBN');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookData = await googleBooksAPI.searchByISBN(searchIsbn);
      console.log('Book data found:', bookData);
      onBookFound(bookData);
      handleStop();
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Error fetching book data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<QrCodeScannerIcon />}
        onClick={handleStart}
        sx={{
          backgroundColor: '#8B4513',
          '&:hover': { backgroundColor: '#654321' },
          width: '100%',
          height: '48px'
        }}
      >
        Scan ISBN
      </Button>

      <Dialog 
        open={scanning} 
        onClose={handleStop}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Scan Book ISBN</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <Box 
              ref={scannerRef}
              sx={{ 
                width: '100%', 
                height: '300px',
                overflow: 'hidden',
                position: 'relative',
                '& video': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }
              }} 
            />
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )}
            <TextField
              label="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Enter ISBN manually or scan"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStop}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleSearch()}
            variant="contained"
            disabled={!isbn || loading}
            sx={{
              backgroundColor: '#8B4513',
              '&:hover': { backgroundColor: '#654321' }
            }}
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookScanner;
