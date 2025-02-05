"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Typography, Box, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import EditableVerificationTable from '@/components/EditableVerificationTable';
import CSVDownloadButton from '@/components/CSVDownloadButton';
import { NormalizedItem } from '@/lib/types';

const EditOrderPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<NormalizedItem[]>([]);
  const [order, setOrder] = useState<any>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${params.id}`);
        setOrder(res.data);
        setOrderData(res.data.orderItems);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    fetchOrder();
  }, [params.id]);

  const handleOrderUpdate = async (updatedItems: NormalizedItem[], confirmedMatches: { [key: number]: string }) => {
    const orderItems = updatedItems.map((item, index) => ({
      requestItem: item.requestItem,
      confirmedMatch: confirmedMatches[index] || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    }));
    try {
      await axios.put(`/api/orders/${params.id}`, {
        orderItems,
        requestUrl: order.requestUrl,
        responseUrl: order.responseUrl,
      });
      setSaveMessage('Order updated successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error updating order:', error);
      setSaveMessage('Failed to update order.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Order #{params.id}
      </Typography>
      {orderData && orderData.length > 0 ? (
        <>
          <EditableVerificationTable initialItems={orderData} onConfirm={handleOrderUpdate} />
          <Box sx={{ mt: 2 }}>
            <CSVDownloadButton
              data={orderData.map((item) => ({
                "Request Item": item.requestItem,
                "Quantity": item.quantity,
                "Unit Price": item.unitPrice,
                "Total": item.total,
                "Confirmed Match": item.confirmedMatch || '',
              }))}
              filename={`order-${params.id}.csv`}
            />
          </Box>
        </>
      ) : (
        <Typography variant="h6">Loading order details...</Typography>
      )}
      <Snackbar
        open={Boolean(saveMessage)}
        autoHideDuration={5000}
        onClose={() => setSaveMessage(null)}
        message={saveMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSaveMessage(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default EditOrderPage;
