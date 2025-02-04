"use client";
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import FileUpload from '@/components/FileUpload';
import EditableVerificationTable from '@/components/EditableVerificationTable';
import { NormalizedItem } from '@/lib/types';
import { normalizeExtractedData } from '@/lib/normalize';

const ProcessOrderPage: React.FC = () => {
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<NormalizedItem[] | null>(null);
  const [orderData, setOrderData] = useState<NormalizedItem[]>([]);
  const [clearSnackbarOpen, setClearSnackbarOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleExtractionComplete = (rawData: any, fileUrl: string) => {
    const normalized = normalizeExtractedData(rawData);
    setPdfPreviewUrl(fileUrl);
    setExtractedData(normalized);
    setOrderData(normalized);
    setClearSnackbarOpen(true);
  };

  const handleOrderUpdate = async (updatedItems: NormalizedItem[], confirmedMatches: { [key: number]: string }) => {
    setOrderData(updatedItems);
    try {
      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        console.log({item})
        await axios.post('/api/confirmedMatches', {
          requestItem: item.requestItem,
          confirmedMatch: confirmedMatches[i] || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        });
      }
      setSaveMessage('Order data saved successfully!');
    } catch (error) {
      console.error('Error saving order data:', error);
      setSaveMessage('Failed to save order data.');
    }
  };

  const handleClearPDF = () => {
    setPdfPreviewUrl(null);
    setExtractedData(null);
    setOrderData([]);
    setClearSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Process Order
      </Typography>
      <Grid container spacing={2}>
        {/* Left side: PDF upload/preview area (approximately 60% width) */}
        <Grid item xs={12} md={7}>
          {pdfPreviewUrl ? (
            <Box sx={{ position: 'relative' }}>
              <Typography variant="h6" gutterBottom>
                PDF Preview:
              </Typography>
              <iframe
                src={pdfPreviewUrl}
                style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
                title="PDF Preview"
              ></iframe>
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Button variant="outlined" color="error" onClick={handleClearPDF}>
                  Clear PDF
                </Button>
              </Box>
            </Box>
          ) : (
            <FileUpload onExtractionComplete={handleExtractionComplete} />
          )}
        </Grid>
        {/* Right side: Order management area (approximately 40% width) */}
        <Grid item xs={12} md={5}>
          {orderData && orderData.length > 0 ? (
            <EditableVerificationTable initialItems={orderData} onConfirm={handleOrderUpdate} />
          ) : (
            <Typography variant="h6">
              Order management will appear here once a PDF is processed.
            </Typography>
          )}
        </Grid>
      </Grid>
      <Snackbar
        open={clearSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => setClearSnackbarOpen(false)}
        message="PDF loaded. Click 'Clear PDF' to remove."
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClearPDF}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      {saveMessage && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">{saveMessage}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProcessOrderPage;
