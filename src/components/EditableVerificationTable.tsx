"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { NormalizedItem } from '@/lib/types';

interface CandidateMatch {
  match: string;
  score: number;
}

interface EditableVerificationTableProps {
  initialItems: NormalizedItem[];
  onConfirm: (updatedItems: NormalizedItem[], confirmedMatches: { [key: number]: string }) => void;
}

const EditableVerificationTable: React.FC<EditableVerificationTableProps> = ({
  initialItems,
  onConfirm,
}) => {
  // Local state for the editable items. Update if initialItems change.
  const [items, setItems] = useState<NormalizedItem[]>(initialItems);
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Store candidate matches and loading states per row.
  const [candidateMatches, setCandidateMatches] = useState<{ [key: number]: CandidateMatch[] }>({});
  const [loadingMatches, setLoadingMatches] = useState<{ [key: number]: boolean }>({});
  const [selectedMatches, setSelectedMatches] = useState<{ [key: number]: string }>({});

  // States for search functionality per row.
  const [searchVisible, setSearchVisible] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState<{ [key: number]: string }>({});
  const [searchResults, setSearchResults] = useState<{ [key: number]: CandidateMatch[] }>({});

  // Fetch the top candidate matches for a row based on its requestItem.
  const fetchCandidateMatches = async (rowIndex: number, requestItem: string) => {
    if (!requestItem || requestItem.trim() === '') {
      setCandidateMatches((prev) => ({ ...prev, [rowIndex]: [] }));
      return;
    }
    setLoadingMatches((prev) => ({ ...prev, [rowIndex]: true }));
    try {
      const response = await axios.post('/api/match', { queries: [requestItem] });
      const matches = response.data.results[requestItem] || [];
      setCandidateMatches((prev) => ({ ...prev, [rowIndex]: matches }));
      if (matches.length > 0) {
        setSelectedMatches((prev) => ({ ...prev, [rowIndex]: matches[0].match }));
      } else {
        setSelectedMatches((prev) => ({ ...prev, [rowIndex]: '' }));
      }
    } catch (error) {
      console.error(`Error fetching matches for row ${rowIndex}:`, error);
      setCandidateMatches((prev) => ({ ...prev, [rowIndex]: [] }));
      setSelectedMatches((prev) => ({ ...prev, [rowIndex]: '' }));
    } finally {
      setLoadingMatches((prev) => ({ ...prev, [rowIndex]: false }));
    }
  };

  // When items update, fetch candidate matches for each row.
  useEffect(() => {
    items.forEach((item, index) => {
      if (item.requestItem && item.requestItem.trim() !== '') {
        fetchCandidateMatches(index, item.requestItem);
      } else {
        setCandidateMatches((prev) => ({ ...prev, [index]: [] }));
      }
    });
  }, [items]);

  // Handle field changes.
  const handleFieldChange = (index: number, field: keyof NormalizedItem, value: string) => {
    const updatedItems = [...items];
    if (field === 'quantity' || field === 'unitPrice' || field === 'total') {
      updatedItems[index][field] = Number(value);
    } else {
      updatedItems[index][field] = value;
    }
    setItems(updatedItems);
    if (field === 'requestItem') {
      fetchCandidateMatches(index, value);
    }
  };

  const handleDeleteRow = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    const newCandidateMatches = { ...candidateMatches };
    delete newCandidateMatches[index];
    setCandidateMatches(newCandidateMatches);
    const newSelectedMatches = { ...selectedMatches };
    delete newSelectedMatches[index];
    setSelectedMatches(newSelectedMatches);
    const newSearchVisible = { ...searchVisible };
    delete newSearchVisible[index];
    setSearchVisible(newSearchVisible);
    const newSearchTerm = { ...searchTerm };
    delete newSearchTerm[index];
    setSearchTerm(newSearchTerm);
    const newSearchResults = { ...searchResults };
    delete newSearchResults[index];
    setSearchResults(newSearchResults);
  };

  const handleAddRow = () => {
    setItems([...items, { requestItem: '', quantity: 0, unitPrice: 0, total: 0 }]);
  };

  const handleConfirm = () => {
    onConfirm(items, selectedMatches);
  };

  // Toggle search area for a row.
  const toggleSearch = (index: number) => {
    setSearchVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Handle search input changes.
  const handleSearchInputChange = (index: number, value: string) => {
    setSearchTerm((prev) => ({ ...prev, [index]: value }));
  };

  // Execute search for a row.
  const handleSearch = async (index: number) => {
    const query = searchTerm[index] || '';
    if (!query.trim()) return;
    try {
      const response = await axios.get(`/api/product-search?query=${encodeURIComponent(query)}`);
      const results = response.data.results || [];
      setSearchResults((prev) => ({ ...prev, [index]: results }));
    } catch (error) {
      console.error(`Error searching for row ${index}:`, error);
      setSearchResults((prev) => ({ ...prev, [index]: [] }));
    }
  };

  // When a search result is clicked, update the selected match for that row.
  const selectSearchResult = (index: number, match: string) => {
    setSelectedMatches((prev) => ({ ...prev, [index]: match }));
    // Optionally update candidateMatches with only the selected result.
    setCandidateMatches((prev) => ({ ...prev, [index]: [{ match, score: 100 }] }));
    // Hide search area.
    setSearchVisible((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Line Items
      </Typography>
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Item {index + 1}
          </Typography>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2">Request Item:</Typography>
            <TextField
              fullWidth
              value={item.requestItem}
              onChange={(e) => handleFieldChange(index, 'requestItem', e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2">Quantity:</Typography>
            <TextField
              fullWidth
              type="number"
              value={item.quantity}
              onChange={(e) => handleFieldChange(index, 'quantity', e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2">Unit Price:</Typography>
            <TextField
              fullWidth
              type="number"
              value={item.unitPrice ?? 0}
              onChange={(e) => handleFieldChange(index, 'unitPrice', e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2">Total:</Typography>
            <TextField
              fullWidth
              type="number"
              value={item.total ?? 0}
              onChange={(e) => handleFieldChange(index, 'total', e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2">Candidate Match:</Typography>
            {loadingMatches[index] ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                fullWidth
                size="small"
                value={selectedMatches[index] || ''}
                onChange={(e) =>
                  setSelectedMatches((prev) => ({ ...prev, [index]: e.target.value }))
                }
              >
                {candidateMatches[index] && candidateMatches[index].length > 0 ? (
                  candidateMatches[index].map((matchObj: CandidateMatch, idx: number) => (
                    <MenuItem key={idx} value={matchObj.match}>
                      {matchObj.match}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No matches found</MenuItem>
                )}
              </Select>
            )}
          </Box>
          <Box sx={{ mb: 1 }}>
            <Button variant="text" onClick={() => toggleSearch(index)}>
              {searchVisible[index] ? 'Hide Search' : 'Search Product'}
            </Button>
            {searchVisible[index] && (
              <Box sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Enter search term..."
                  value={searchTerm[index] || ''}
                  onChange={(e) => handleSearchInputChange(index, e.target.value)}
                  size="small"
                />
                <Button variant="contained" sx={{ mt: 1 }} onClick={() => handleSearch(index)}>
                  Search
                </Button>
                {searchResults[index] && searchResults[index].length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">Results:</Typography>
                    <List>
                      {searchResults[index].map((result: CandidateMatch, idx: number) => (
                        <ListItem key={idx} disablePadding>
                          <ListItemButton onClick={() => selectSearchResult(index, result.match)}>
                            <ListItemText primary={result.match} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => handleDeleteRow(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={handleAddRow}>
          Add Row
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          Confirm All Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditableVerificationTable;
