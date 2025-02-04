"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { NormalizedItem } from "@/lib/types";

interface CandidateMatch {
  match: string;
  score: number;
}

interface EditableVerificationTableProps {
  initialItems: NormalizedItem[];
  onConfirm: (
    updatedItems: NormalizedItem[],
    confirmedMatches: { [key: number]: string }
  ) => void;
}

const EditableVerificationTable: React.FC<EditableVerificationTableProps> = ({
  initialItems,
  onConfirm,
}) => {
  const [items, setItems] = useState<NormalizedItem[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const [candidateMatches, setCandidateMatches] = useState<{
    [key: number]: CandidateMatch[];
  }>({});
  const [loadingMatches, setLoadingMatches] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedMatches, setSelectedMatches] = useState<{
    [key: number]: string;
  }>({});

  const fetchCandidateMatches = async (
    rowIndex: number,
    requestItem: string
  ) => {
    if (!requestItem || requestItem.trim() === "") {
      setCandidateMatches((prev) => ({ ...prev, [rowIndex]: [] }));
      return;
    }
    setLoadingMatches((prev) => ({ ...prev, [rowIndex]: true }));
    try {
      const response = await axios.post("/api/match", {
        queries: [requestItem],
      });
      const matches = response.data.results[requestItem] || [];
      setCandidateMatches((prev) => ({ ...prev, [rowIndex]: matches }));
      setSelectedMatches((prev) => ({
        ...prev,
        [rowIndex]: matches.length > 0 ? matches[0].match : "",
      }));
    } catch (error) {
      console.error(`Error fetching matches for row ${rowIndex}:`, error);
      setCandidateMatches((prev) => ({ ...prev, [rowIndex]: [] }));
      setSelectedMatches((prev) => ({ ...prev, [rowIndex]: "" }));
    } finally {
      setLoadingMatches((prev) => ({ ...prev, [rowIndex]: false }));
    }
  };

  useEffect(() => {
    items.forEach((item, index) => {
      if (item.requestItem?.trim() !== "") {
        fetchCandidateMatches(index, item.requestItem);
      } else {
        setCandidateMatches((prev) => ({ ...prev, [index]: [] }));
      }
    });
  }, [items]);

  const handleFieldChange = (
    index: number,
    field: keyof NormalizedItem,
    value: string
  ) => {
    const updatedItems = [...items];

    if (["quantity", "unitPrice", "total"].includes(field)) {
      updatedItems[index][field] = value.trim() === "" ? 0 : Number(value);
    } else {
      updatedItems[index][field] = value;
    }

    setItems(updatedItems);

    if (field === "requestItem") {
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
  };

  const handleAddRow = () => {
    setItems([
      ...items,
      { requestItem: "", quantity: 0, unitPrice: 0, total: 0 },
    ]);
  };

  const handleConfirm = () => {
    onConfirm(items, selectedMatches);
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
            border: "1px solid #ccc",
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
              value={item.requestItem || ""}
              onChange={(e) =>
                handleFieldChange(index, "requestItem", e.target.value)
              }
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2">Quantity:</Typography>
            <TextField
              fullWidth
              type="number"
              value={item.quantity ?? 0}
              onChange={(e) =>
                handleFieldChange(index, "quantity", e.target.value)
              }
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
              onChange={(e) =>
                handleFieldChange(index, "unitPrice", e.target.value)
              }
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
              onChange={(e) =>
                handleFieldChange(index, "total", e.target.value)
              }
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
                value={selectedMatches[index] || ""}
                onChange={(e) =>
                  setSelectedMatches((prev) => ({
                    ...prev,
                    [index]: e.target.value,
                  }))
                }
              >
                {candidateMatches[index]?.length > 0 ? (
                  candidateMatches[index].map((matchObj, idx) => (
                    <MenuItem key={idx} value={matchObj.match}>
                      {matchObj.match} (Score: {matchObj.score})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No matches found</MenuItem>
                )}
              </Select>
            )}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <IconButton onClick={() => handleDeleteRow(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
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
