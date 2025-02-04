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
  Typography,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { NormalizedItem } from '@/lib/types';

interface VerificationTableProps {
  extractedItems: NormalizedItem[];
  onConfirm: (confirmedMatches: { [key: string]: string }) => void;
}

const VerificationTable: React.FC<VerificationTableProps> = ({ extractedItems, onConfirm }) => {
  // Store candidate matches keyed by the normalized request item (string)
  const [matches, setMatches] = useState<{ [key: string]: any[] }>({});
  // Store the user-selected match for each normalized request item
  const [selectedMatches, setSelectedMatches] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    extractedItems.forEach(async (item) => {
      const queryText = item.requestItem; // Using the normalized property
      try {
        // Call the matching API with the normalized request item as query
        const response = await axios.post('/api/match', { queries: [queryText] });
        const candidateMatches = response.data.results[queryText] || [];
        setMatches((prev) => ({ ...prev, [queryText]: candidateMatches }));
        // Set default selection (first candidate) if available
        if (candidateMatches.length > 0) {
          setSelectedMatches((prev) => ({ ...prev, [queryText]: candidateMatches[0].match }));
        }
      } catch (error) {
        console.error(`Error fetching matches for "${queryText}":`, error);
      }
    });
  }, [extractedItems]);

  const handleSelectChange = (itemKey: string, value: string) => {
    setSelectedMatches((prev) => ({ ...prev, [itemKey]: value }));
  };

  const handleConfirm = () => {
    // Pass the confirmed matches back to the parent component (Home page)
    onConfirm(selectedMatches);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Verify Matches
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Request Item</TableCell>
            <TableCell>Candidate Matches</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {extractedItems.map((item, index) => {
            const key = item.requestItem;
            const candidateMatches = matches[key];
            return (
              <TableRow key={index}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {candidateMatches === undefined ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Select
                      value={selectedMatches[key] || ''}
                      onChange={(e) => handleSelectChange(key, e.target.value)}
                      fullWidth
                    >
                      {candidateMatches.length > 0 ? (
                        candidateMatches.map((matchObj: any, idx: number) => (
                          <MenuItem key={idx} value={matchObj.match}>
                            {matchObj.match} (Score: {matchObj.score})
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No matches found</MenuItem>
                      )}
                    </Select>
                  )}
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
