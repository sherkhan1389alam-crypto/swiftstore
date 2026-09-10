#!/bin/bash
sed -i 's/const compressed = await compressImage(file, 1024, 1024, 0.8);/const compressed = await compressImage(file);/g' src/pages/admin/ProductForm.tsx
