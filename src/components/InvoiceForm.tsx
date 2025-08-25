import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceData } from "@/types/invoice";
import { Settings, FileText, Download } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface InvoiceFormProps {
  data: InvoiceData;
  onDataChange: (data: InvoiceData) => void;
}

export const InvoiceForm = forwardRef(({ data, onDataChange }: InvoiceFormProps, ref) => {
  const handleInputChange = (field: keyof InvoiceData, value: string | number) => {
    onDataChange({
      ...data,
      [field]: value,
    });
  };

  useImperativeHandle(ref, () => ({
    generatePDF
  }));

  const generatePDF = () => {
    const invoiceElement = document.getElementById('invoice-preview');
    if (!invoiceElement) return;

    const opt = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    };

    html2canvas(invoiceElement, opt).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`invoice-${data.orderId}.pdf`);
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Invoice Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Customer Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Informasi Pelanggan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Nama Pelanggan</Label>
              <Input
                id="customerName"
                value={data.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Masukkan nama pelanggan"
              />
            </div>
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                value={data.orderId}
                onChange={(e) => handleInputChange('orderId', e.target.value)}
                placeholder="RB-127328-998322"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="orderDate">Tanggal Pesanan</Label>
            <Input
              id="orderDate"
              value={data.orderDate}
              onChange={(e) => handleInputChange('orderDate', e.target.value)}
              placeholder="4 Agustus 2025"
            />
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full"></span>
            Detail Perjalanan
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pickupAddress">Alamat Jemput</Label>
              <Textarea
                id="pickupAddress"
                value={data.pickupAddress}
                onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                placeholder="Masukkan alamat penjemputan lengkap"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="dropoffAddress">Alamat Tujuan</Label>
              <Textarea
                id="dropoffAddress"
                value={data.dropoffAddress}
                onChange={(e) => handleInputChange('dropoffAddress', e.target.value)}
                placeholder="Masukkan alamat tujuan lengkap"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupTime">Waktu Jemput</Label>
                <Input
                  id="pickupTime"
                  value={data.pickupTime}
                  onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                  placeholder="19:22"
                />
              </div>
              <div>
                <Label htmlFor="arrivalTime">Waktu Sampai</Label>
                <Input
                  id="arrivalTime"
                  value={data.arrivalTime}
                  onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  placeholder="20:03"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distance">Jarak</Label>
                <Input
                  id="distance"
                  value={data.distance}
                  onChange={(e) => handleInputChange('distance', e.target.value)}
                  placeholder="13.5 km"
                />
              </div>
              <div>
                <Label htmlFor="duration">Durasi</Label>
                <Input
                  id="duration"
                  value={data.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="41 menit"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-warning rounded-full"></span>
            Informasi Driver
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="driverName">Nama Driver</Label>
              <Input
                id="driverName"
                value={data.driverName}
                onChange={(e) => handleInputChange('driverName', e.target.value)}
                placeholder="RUDI"
              />
            </div>
            <div>
              <Label htmlFor="licensePlate">Plat Nomor</Label>
              <Input
                id="licensePlate"
                value={data.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                placeholder="D4882UGX"
              />
            </div>
            <div>
              <Label htmlFor="vehicleType">Jenis Kendaraan</Label>
              <Input
                id="vehicleType"
                value={data.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                placeholder="Honda BeAT"
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-info rounded-full"></span>
            Rincian Pembayaran
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseFare">Biaya Perjalanan (Rp)</Label>
              <Input
                id="baseFare"
                type="number"
                value={data.baseFare}
                onChange={(e) => handleInputChange('baseFare', parseInt(e.target.value) || 0)}
                placeholder="34500"
              />
            </div>
            <div>
              <Label htmlFor="appFee">Biaya Aplikasi (Rp)</Label>
              <Input
                id="appFee"
                type="number"
                value={data.appFee}
                onChange={(e) => handleInputChange('appFee', parseInt(e.target.value) || 0)}
                placeholder="3000"
              />
            </div>
            <div>
              <Label htmlFor="insuranceFee">Biaya Asuransi (Rp)</Label>
              <Input
                id="insuranceFee"
                type="number"
                value={data.insuranceFee}
                onChange={(e) => handleInputChange('insuranceFee', parseInt(e.target.value) || 0)}
                placeholder="1000"
              />
            </div>
            <div>
              <Label htmlFor="discount">Diskon (Rp)</Label>
              <Input
                id="discount"
                type="number"
                value={data.discount}
                onChange={(e) => handleInputChange('discount', parseInt(e.target.value) || 0)}
                placeholder="2000"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
              <Select value={data.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih metode pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GoPayLater">GoPayLater</SelectItem>
                  <SelectItem value="GoPay">GoPay</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="totalAmount">Total Pembayaran (Rp)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={data.totalAmount}
                onChange={(e) => handleInputChange('totalAmount', parseInt(e.target.value) || 0)}
                placeholder="36500"
                className="font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Catatan Tambahan</h3>
          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={data.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Masukkan catatan tambahan jika diperlukan"
              rows={3}
            />
          </div>
        </div>


      </CardContent>
    </Card>
  );
});