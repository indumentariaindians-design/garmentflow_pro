import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminPanel from './pages/admin-panel';
import InventoryControl from './pages/inventory-control';
import Dashboard from './pages/dashboard';
import StationInterface from './pages/station-interface';
import OrderDetailsPage from './pages/order-details';
import StationHub from './pages/station-hub';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/inventory-control" element={<InventoryControl />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/station-interface" element={<StationInterface />} />
        <Route path="/order-details" element={<OrderDetailsPage />} />
        <Route path="/station-hub" element={<StationHub />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
