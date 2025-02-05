"use client";
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
} from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import CSVDownloadButton from '@/components/CSVDownloadButton';

interface Order {
  id: number;
  date: string;
  requestUrl: string;
  responseUrl: string;
}

const DashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data.orders);
      if (response.data.orders.length > 0) {
        const csvData = response.data.orders.map((order: Order) => ({
          ID: order.id,
          Date: order.date,
          Request: order.requestUrl,
          Response: order.responseUrl,
        }));
        setCsvData(csvData);
      } else {
        setCsvData([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setCsvData([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Purchase Orders Dashboard
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="h6">
          There are currently no orders yet.
        </Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Request</TableCell>
                <TableCell>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Link href={order.requestUrl}>
                      <Button variant="contained" size="small">
                        View Request
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={order.responseUrl}>
                      <Button variant="contained" size="small">
                        View Response
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ mt: 2 }}>
            <CSVDownloadButton data={csvData} />
          </Box>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;
