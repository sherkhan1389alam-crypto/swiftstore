#!/bin/bash
cat src/pages/store/TrackOrder.tsx | tail -n +45 > track_tail.tmp
cat << 'HEAD_EOF' > src/pages/store/TrackOrder.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../lib/types';
import { Search, Package, Truck, CheckCircle, Clock, Check, MessageSquareText, FileText, AlertTriangle } from 'lucide-react';
import { useSettings } from '../../lib/settingsContext';
import { format } from 'date-fns';

export default function TrackOrder() {
  const { settings } = useSettings();
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id') || params.get('orderId');
    if (idParam) {
      setOrderNumber(idParam);
      trackOrderById(idParam);
    }
  }, [location]);

  const trackOrderById = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      let orderData: Order | null = null;
      try {
         const directDoc = await getDoc(doc(db, 'orders', id.trim()));
         if (directDoc.exists()) {
           orderData = { id: directDoc.id, ...directDoc.data() } as Order;
         }
      } catch (e) {}

      if (!orderData) {
        const q = query(collection(db, 'orders'), where('orderNumber', '==', id.trim()));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          orderData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Order;
        }
      }

      if (orderData) {
        setOrder(orderData);
      } else {
        setError('Order not found. Please check the order number and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while tracking your order.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    trackOrderById(orderNumber);
  };
HEAD_EOF
cat track_tail.tmp >> src/pages/store/TrackOrder.tsx
rm track_tail.tmp
