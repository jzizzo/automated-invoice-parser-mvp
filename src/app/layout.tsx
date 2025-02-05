import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Purchase Orders Dashboard</title>
      </head>
      <body>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Purchase Orders
            </Typography>
            <Button color="inherit" component={Link} href="/">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} href="/add-order">
              Add Order
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>{children}</Container>
      </body>
    </html>
  );
}
