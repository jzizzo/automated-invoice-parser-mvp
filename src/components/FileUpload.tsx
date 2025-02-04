"use client";
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Typography, Box } from '@mui/material';
import axios from 'axios';

interface FileUploadProps {
  onExtractionComplete: (extractionData: any, fileUrl: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onExtractionComplete }) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      // Create an object URL for the PDF preview
      const fileUrl = URL.createObjectURL(file);

      // Prepare the file for sending to the extraction API
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/extract', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // Pass both the extracted data and the file preview URL back to the parent
        onExtractionComplete(response.data, fileUrl);
      } catch (error) {
        console.error('Extraction failed:', error);
      }
    },
    [onExtractionComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf' });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography variant="body1">Drop the file here ...</Typography>
      ) : (
        <Typography variant="body1">
          Drag 'n' drop a PDF here, or click to select a file
        </Typography>
      )}
      <Button variant="contained" sx={{ mt: 2 }}>
        Select File
      </Button>
    </Box>
  );
};

export default FileUpload;
