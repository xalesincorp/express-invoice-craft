export interface InvoiceData {
  // Customer and order info
  customerName: string;
  orderId: string;
  orderDate: string;
  totalAmount: number;

  // Trip details
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  arrivalTime: string;
  distance: string;
  duration: string;

  // Driver info
  driverName: string;
  licensePlate: string;
  vehicleType: string;

  // Payment breakdown
  baseFare: number;
  appFee: number;
  insuranceFee: number;
  discount: number;
  paymentMethod: string;

  // Additional info
  notes?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export const defaultInvoiceData: InvoiceData = {
  customerName: "Andry",
  orderId: "RB-127328-998322",
  orderDate: "4 Agustus 2025",
  totalAmount: 36500,
  pickupAddress: "Bojongkoneng Atas, Jalan Pager Sari, Cimenyan",
  dropoffAddress: "Bojongkoneng Atas, Jalan Pager Sari, Cimenyan",
  pickupTime: "19:22",
  arrivalTime: "20:03",
  distance: "13.5 km",
  duration: "41 menit",
  driverName: "RUDI",
  licensePlate: "D4882UGX",
  vehicleType: "Honda BeAT",
  baseFare: 34500,
  appFee: 3000,
  insuranceFee: 1000,
  discount: 2000,
  paymentMethod: "GoPayLater",
  notes: "Perjalanan ini dijamin asuransi. Total yang tercantum adalah harga yang dibayarkan ketika pesanan selesai.",
  status: 'completed'
};