"use client";
import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import FileUpload from '@/components/FileUpload';
import VerificationTable from '@/components/VerificationTable';
import CSVDownloadButton from '@/components/CSVDownloadButton';
import { NormalizedItem } from '@/lib/types';
import { normalizeExtractedData } from '@/lib/normalize';

const HomePage: React.FC = () => {
  // Now we store an array of NormalizedItem objects
  const [extractedData, setExtractedData] = useState<NormalizedItem[] | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [confirmedMatches, setConfirmedMatches] = useState<{ [key: string]: string } | null>(null);

  const handleExtractionComplete = (rawData: any, fileUrl: string) => {
    const normalized = normalizeExtractedData(rawData);
    setExtractedData(normalized);
    setPdfPreviewUrl(fileUrl);
  };

  const handleVerificationConfirm = (matches: { [key: string]: string }) => {
    setConfirmedMatches(matches);
  };

  const csvData =
    confirmedMatches &&
    Object.entries(confirmedMatches).map(([requestItem, confirmedMatch]) => ({
      "Request Item": requestItem,
      "Confirmed Match": confirmedMatch,
    }));

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Document Processing MVP
      </Typography>
      <FileUpload onExtractionComplete={handleExtractionComplete} />

      {pdfPreviewUrl && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">PDF Preview:</Typography>
          <iframe
            src={pdfPreviewUrl}
            style={{ width: '100%', height: '500px', border: 'none' }}
            title="PDF Preview"
          ></iframe>
        </Box>
      )}

      {extractedData && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Verify Matches
          </Typography>
          <VerificationTable extractedItems={extractedData} onConfirm={handleVerificationConfirm} />
        </>
      )}

      {confirmedMatches && csvData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Export Verified Matches</Typography>
          <CSVDownloadButton data={csvData} />
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
