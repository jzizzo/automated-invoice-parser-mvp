"use client";
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  Box,
  Typography
} from '@mui/material';
import axios from 'axios';
import { ExtractedItem } from '@/lib/types';

interface VerificationTableProps {
  extractedItems: ExtractedItem[];
}

const VerificationTable: React.FC<VerificationTableProps> = ({ extractedItems }) => {
  // Store candidate matches for each extracted item keyed by its "Request Item"
  const [matches, setMatches] = useState<{ [key: string]: any[] }>({});
  // Store user-selected match for each extracted item
  const [selectedMatches, setSelectedMatches] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // For every extracted item, call the matching API route using the "Request Item" as query
    extractedItems.forEach(async (item) => {
      const queryText = item["Request Item"];
      try {
        // Call our matching API; here, we send a single-item batch for simplicity
        const response = await axios.post('/api/match', { queries: [queryText] });
        // The API is expected to return results keyed by the query text
        const candidateMatches = response.data.results[queryText] || [];
        setMatches((prev) => ({ ...prev, [queryText]: candidateMatches }));
        // Set default selection if matches exist
        if (candidateMatches.length > 0) {
          setSelectedMatches((prev) => ({ ...prev, [queryText]: candidateMatches[0].match }));
        }
      } catch (error) {
        console.error(`Matching API error for item "${queryText}":`, error);
      }
    });
  }, [extractedItems]);

  const handleSelectChange = (itemKey: string, value: string) => {
    setSelectedMatches((prev) => ({ ...prev, [itemKey]: value }));
  };

  const handleConfirm = () => {
    console.log('Confirmed Matches:', selectedMatches);
    // Future step: trigger CSV export or further processing.
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Verify Matches
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Extracted Item</TableCell>
            <TableCell>Candidate Matches</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {extractedItems.map((item, index) => {
            const key = item["Request Item"];
            return (
              <TableRow key={index}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  <Select
                    value={selectedMatches[key] || ''}
                    onChange={(e) => handleSelectChange(key, e.target.value)}
                    fullWidth
                  >
                    {matches[key] && matches[key].length > 0 ? (
                      matches[key].map((matchObj: any, idx: number) => (
                        <MenuItem key={idx} value={matchObj.match}>
                          {matchObj.match} (Score: {matchObj.score})
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No matches found</MenuItem>
                    )}
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button variant="contained" onClick={handleConfirm} sx={{ mt: 2 }}>
        Confirm Selections
      </Button>
    </Box>
  );
};

export default VerificationTable;
