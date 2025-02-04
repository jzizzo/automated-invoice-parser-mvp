import React from "react";
import { CSVLink } from "react-csv";
import { Button } from "@mui/material";

interface CSVDownloadButtonProps {
  data: any[];
}

const CSVDownloadButton: React.FC<CSVDownloadButtonProps> = ({ data }) => {
  return (
    <CSVLink data={data} filename="verified_matches.csv" style={{ textDecoration: "none" }}>
      <Button variant="contained" color="primary">Download CSV</Button>
    </CSVLink>
  );
};

export default CSVDownloadButton;
