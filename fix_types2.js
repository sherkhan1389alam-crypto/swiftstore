import fs from 'fs';
let code = fs.readFileSync('src/lib/types.ts', 'utf8');

if (!code.includes('export interface OrderStatusHistory')) {
  code = code.replace(
    /export interface Order \{/,
    `export interface OrderStatusHistory {
  status: OrderStatus;
  date: number;
  note?: string;
}

export interface Order {`
  );
}

if (!code.includes('statusHistory?: OrderStatusHistory[];')) {
  code = code.replace(
    /status: OrderStatus;/,
    `status: OrderStatus;\n  statusHistory?: OrderStatusHistory[];\n  expectedDeliveryDate?: number;\n  courierName?: string;\n  shippingCharge?: number;\n  codCharge?: number;`
  );
}

fs.writeFileSync('src/lib/types.ts', code);
