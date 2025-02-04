"use client";
import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import FileUpload from "@/components/FileUpload";
import VerificationTable from "@/components/VerificationTable";
import { ExtractedItem } from "@/lib/types";

const HomePage: React.FC = () => {
  // extractedData is an array of ExtractedItem objects
  const [extractedData, setExtractedData] = useState<ExtractedItem[] | null>(
    null
  );
  // Store the URL for the PDF preview
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const handleExtractionComplete = (data: any, fileUrl: string) => {
    setExtractedData(data);
    setPdfPreviewUrl(fileUrl);
  };

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
            style={{ width: "100%", height: "500px", border: "none" }}
            title="PDF Preview"
          ></iframe>
        </Box>
      )}

      {extractedData && <VerificationTable extractedItems={extractedData} />}
    </Container>
  );
};

export default HomePage;
