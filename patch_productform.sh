#!/bin/bash
sed -i 's/import { useParams, useNavigate } from '\''react-router-dom'\'';/import { useParams, useNavigate, Link } from '\''react-router-dom'\'';/g' src/pages/admin/ProductForm.tsx
sed -i 's/import { doc, getDoc, setDoc, collection, addDoc } from '\''firebase\/firestore'\'';/import { doc, getDoc, setDoc, collection, addDoc, getDocs } from '\''firebase\/firestore'\'';/g' src/pages/admin/ProductForm.tsx
