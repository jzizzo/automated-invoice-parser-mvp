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
  orderItems: any; // Expected to be an array stored as JSON
}

const DashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>View Order</TableCell>
              <TableCell>Download CSV</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              // Create CSV data from orderItems if orderItems is an array
              const csvData = Array.isArray(order.orderItems)
                ? order.orderItems.map((item: any) => ({
                    "Request Item": item.requestItem,
                    "Quantity": item.quantity,
                    "Unit Price": item.unitPrice,
                    "Total": item.total,
                    "Confirmed Match": item.confirmedMatch,
                  }))
                : [];
              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Link href={`/order/${order.id}`}>
                      <Button variant="contained" size="small">
                        View Order
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {csvData.length > 0 ? (
                      <CSVDownloadButton data={csvData} filename={`order-${order.id}.csv`} />
                    ) : (
                      <Typography variant="caption">No items</Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default DashboardPage;
