/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreLayout } from './layouts/StoreLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Store Pages
import Home from './pages/store/Home';
import Shop from './pages/store/Shop';
import Categories from './pages/store/Categories';
import CategoryProducts from './pages/store/CategoryProducts';
import ProductDetails from './pages/store/ProductDetails';
import Cart from './pages/store/Cart';
import Checkout from './pages/store/Checkout';
import OrderConfirmation from './pages/store/OrderConfirmation';
import TrackOrder from './pages/store/TrackOrder';
import Login from './pages/store/Login';
import Profile from './pages/store/Profile';
import MyOrders from './pages/store/MyOrders';
import Search from './pages/store/Search';
import Wishlist from './pages/store/Wishlist';
import Contact from './pages/store/Contact';
import About from './pages/store/About';
import Terms from './pages/store/Terms';
import Privacy from './pages/store/Privacy';
import Refund from './pages/store/Refund';

// Admin Pages
import AdminRoute from './components/AdminRoute';
import Security from './pages/admin/Security';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminOrderDetails from './pages/admin/OrderDetails';
import AdminProducts from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import AdminCategories from './pages/admin/Categories';
import Branding from './pages/admin/Branding';
import PaymentSettings from './pages/admin/PaymentSettings';
import HeroBanners from './pages/admin/HeroBanners';
import AdminCustomers from './pages/admin/Customers';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';
import Homepage from './pages/admin/Homepage';
import AdminFulfillment from './pages/admin/Fulfillment';
import AdminLogin from './pages/admin/AdminLogin';

import AdminReviews from './pages/admin/Reviews';
import ProductReviewsManager from './pages/admin/ProductReviewsManager';
import Support from './pages/admin/Support';
import Shipping from './pages/admin/Shipping';
import SocialMedia from './pages/admin/SocialMedia';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Storefront */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="categories" element={<Categories />} />
            <Route path="hero-banners" element={<HeroBanners />} />
          <Route path="category/:categoryId" element={<CategoryProducts />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="search" element={<Search />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="login" element={<Login />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="refund" element={<Refund />} />
          
          {/* Account */}
          <Route path="account">
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<MyOrders />} />
          </Route>
        </Route>

        {/* Admin Panel */}
        <Route path="/owner/*" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
          <Route path="branding" element={<Branding />} />
            <Route path="payment-settings" element={<PaymentSettings />} />
            <Route path="hero-banners" element={<HeroBanners />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="support" element={<Support />} />
            <Route path="social" element={<SocialMedia />} />
                        <Route path="security" element={<Security />} />
                        <Route path="reviews" element={<AdminReviews />} />
            <Route path="reviews/:productId" element={<ProductReviewsManager />} />
                                                                        <Route path="fulfillment" element={<AdminFulfillment />} />
            <Route path="homepage" element={<Homepage />} />
                                                          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
