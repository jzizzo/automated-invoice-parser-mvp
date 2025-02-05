"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

interface ConfirmedMatch {
  id: number;
  requestItem: string;
  confirmedMatch: string;
  quantity: number;
  unitPrice: number | null;
  total: number | null;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<ConfirmedMatch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMatches = async () => {
    try {
      const res = await axios.get("/api/confirmedMatches");
      setMatches(res.data.matches);
    } catch (error) {
      console.error("Error fetching confirmed matches:", error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/confirmedMatches?id=${id}`);
      fetchMatches();
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  const filteredMatches = matches.filter((match) =>
    match.requestItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search by Request Item"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Request Item</TableCell>
            <TableCell>Confirmed Match</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMatches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>{match.id}</TableCell>
              <TableCell>{match.requestItem}</TableCell>
              <TableCell>{match.confirmedMatch}</TableCell>
              <TableCell>{match.quantity}</TableCell>
              <TableCell>{match.unitPrice}</TableCell>
              <TableCell>{match.total}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleDelete(match.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
                {/* Additional actions (such as edit) could be added here */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={fetchMatches}>
          Refresh
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
