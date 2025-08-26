import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { InvoiceData } from "@/types/invoice";
import { Settings, FileText, Download, Save, Calculator } from "lucide-react";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { useToast } from "@/hooks/use-toast";

interface InvoiceFormProps {
  data: InvoiceData;
  onDataChange: (data: InvoiceData) => void;
  onSaveInvoice?: () => void;
}

export const InvoiceForm = forwardRef(({ data, onDataChange, onSaveInvoice }: InvoiceFormProps, ref) => {
  const { generatePDF } = usePDFGenerator();
  const { toast } = useToast();

  // Helper function to calculate arrival time based on pickup time and duration
  const calculateArrivalTime = (pickupTime: string, duration: string): string => {
    if (!pickupTime || !duration) return "";
    
    // Parse pickup time
    const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
    
    // Parse duration (format: "XX menit")
    const durationMatch = duration.match(/(\d+)\s*menit/);
    if (!durationMatch) return "";
    
    const durationMinutes = parseInt(durationMatch[1]);
    
    // Calculate total minutes
    const totalMinutes = pickupHour * 60 + pickupMinute + durationMinutes;
    
    // Handle overflow (next day)
    const finalHour = Math.floor(totalMinutes / 60) % 24;
    const finalMinute = totalMinutes % 60;
    
    // Format as HH:MM
    return `${finalHour.toString().padStart(2, '0')}:${finalMinute.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (field: keyof InvoiceData, value: string | number) => {
    const updatedData = {
      ...data,
      [field]: value,
    };
    
    // Auto-calculate based on distance
    if (field === 'distance') {
      const distanceValue = Number(value);
      if (distanceValue > 0) {
        // Format distance with "km"
        updatedData.distance = `${distanceValue} km`;
        
        // Calculate trip cost: 1 km = 2500 IDR
        const calculatedBaseFare = distanceValue * 2500;
        updatedData.baseFare = calculatedBaseFare;
        
        // Calculate duration: 1 km = 3-4 minutes (random)
        const minutesPerKm = 3 + Math.random(); // Random between 3-4
        const calculatedDuration = Math.round(distanceValue * minutesPerKm);
        updatedData.duration = `${calculatedDuration} menit`;
        
        // Auto-calculate arrival time based on pickup time and duration
        const calculatedArrivalTime = calculateArrivalTime(updatedData.pickupTime, updatedData.duration);
        if (calculatedArrivalTime) {
          updatedData.arrivalTime = calculatedArrivalTime;
        }
        
        // Auto-calculate total
        const calculatedTotal = calculatedBaseFare + data.appFee + data.insuranceFee - data.discount;
        updatedData.totalAmount = Math.max(0, calculatedTotal);
      }
    }
    
    // Auto-calculate arrival time when pickup time changes
    if (field === 'pickupTime') {
      const calculatedArrivalTime = calculateArrivalTime(value as string, data.duration);
      if (calculatedArrivalTime) {
        updatedData.arrivalTime = calculatedArrivalTime;
      }
    }
    
    // Auto-calculate arrival time when duration changes
    if (field === 'duration') {
      const calculatedArrivalTime = calculateArrivalTime(data.pickupTime, value as string);
      if (calculatedArrivalTime) {
        updatedData.arrivalTime = calculatedArrivalTime;
      }
    }
    
    // Auto-calculate total if payment fields change
    if (['baseFare', 'appFee', 'insuranceFee', 'discount'].includes(field)) {
      const baseFare = field === 'baseFare' ? Number(value) : data.baseFare;
      const appFee = field === 'appFee' ? Number(value) : data.appFee;
      const insuranceFee = field === 'insuranceFee' ? Number(value) : data.insuranceFee;
      const discount = field === 'discount' ? Number(value) : data.discount;
      
      const calculatedTotal = baseFare + appFee + insuranceFee - discount;
      updatedData.totalAmount = Math.max(0, calculatedTotal);
    }
    
    onDataChange(updatedData);
  };

  useImperativeHandle(ref, () => ({
    generatePDF: () => generatePDF(data)
  }));

  const handleCalculateTotal = () => {
    const total = data.baseFare + data.appFee + data.insuranceFee - data.discount;
    handleInputChange('totalAmount', Math.max(0, total));
    
    toast({
      title: "Total calculated",
      description: `Total amount updated to Rp${Math.max(0, total).toLocaleString('id-ID')}`,
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
              <TimePicker
                value={data.pickupTime}
                onChange={(value) => handleInputChange('pickupTime', value)}
                placeholder="Pilih waktu jemput"
              />
            </div>
              <div>
                  <Label htmlFor="arrivalTime">Waktu Sampai</Label>
                  <TimePicker
                    value={data.arrivalTime}
                    onChange={(value) => handleInputChange('arrivalTime', value)}
                    placeholder="Otomatis dihitung"
                    disabled
                  />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distance">Jarak (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  min="1"
                  step="1"
                  value={data.distance.replace(' km', '')}
                  onChange={(e) => handleInputChange('distance', parseInt(e.target.value) || 0)}
                  placeholder="13"
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
              <div className="flex gap-2">
                <Input
                  id="totalAmount"
                  type="number"
                  value={data.totalAmount}
                  onChange={(e) => handleInputChange('totalAmount', parseInt(e.target.value) || 0)}
                  placeholder="36500"
                  className="font-semibold"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCalculateTotal}
                  title="Auto-calculate total"
                >
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
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

        {/* Quick Actions */}
        <div className="flex gap-3 pt-4 border-t">
          {onSaveInvoice && (
            <Button
              onClick={onSaveInvoice}
              variant="outline"
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Invoice
            </Button>
          )}
          <Button
            onClick={() => generatePDF(data)}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate PDF
          </Button>
        </div>

      </CardContent>
    </Card>
  );
});