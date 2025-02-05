"use client";
import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from '@mui/material';

interface CSVDownloadButtonProps {
  data: any[];
  filename?: string;
}

const CSVDownloadButton: React.FC<CSVDownloadButtonProps> = ({ data, filename = 'download.csv' }) => {
  return (
    <CSVLink data={data} filename={filename} style={{ textDecoration: 'none' }}>
      <Button variant="contained" color="primary">
        Download CSV
      </Button>
    </CSVLink>
  );
};

export default CSVDownloadButton;
