import { Card } from "@/components/ui/card";
import { InvoiceData } from "@/types/invoice";
import { User } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebookF, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import gorideLogoWhite from "@/assets/goride-logo-white.png";
import { MopedIcon } from "./MopedIcon";

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview = ({ data }: InvoicePreviewProps) => {
  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  const parseAddress = (fullAddress: string) => {
    const kelurahanMatch = fullAddress.match(/,\s*([^,]+),\s*Kec\.\s*([^,]+)/);
    if (kelurahanMatch) {
      const kelurahan = kelurahanMatch[1].trim();
      const kecamatan = kelurahanMatch[2].trim();
      return {
        detail: `${kelurahan}, Kec. ${kecamatan}`,
        point: fullAddress.trim()
      };
    }
    
    // Fallback jika tidak menemukan pattern yang sesuai
    const parts = fullAddress.split(',');
    if (parts.length >= 3) {
      const lastTwoParts = parts.slice(-3, -1).map(p => p.trim());
      return {
        detail: lastTwoParts.join(', '),
        point: fullAddress.trim()
      };
    }
    
    return {
      detail: fullAddress.trim(),
      point: fullAddress.trim()
    };
  };

  return (
    <div id="invoice-preview" className="max-w-md mx-auto">
      <Card className="bg-card border-0 shadow-lg overflow-hidden">
        {/* Header */}
        <div 
          className="px-6 py-4" 
          style={{
            background: '#00860d',
            color: '#fff',
            display: 'flex',
            alignItems: 'stretch', // Ubah dari 'flex-end' ke 'center'
            justifyContent: 'space-between',
            minHeight: '60px' // Tambahkan min-height untuk konsistensi
          }}
        >
          <div style={{ display: 'flex', alignItems: 'stretch', gap: '8px' }}>
            <img 
              src="/lovable-uploads/f36b63fc-4651-413b-a401-23854372b191.png" 
              alt="GoRide Logo" 
              style={{ height: '40px' }}
            />
            <span 
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#fff',
                lineHeight: '1',
                marginLeft: '4px'
              }}
            >
              goride
            </span>
          </div>
          
          <div 
            style={{
              fontSize: '14px',
              color: '#fff',
              textAlign: 'right',
              opacity: '0.9'
            }}
          >
            {data.orderDate} ID<br />
            pesanan: {data.orderId}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Greeting */}
          <div>
            <p className="text-sm text-muted-foreground">Hai {data.customerName},</p>
            <p className="text-lg font-semibold">Makasih udah pesan GoRide</p>
          </div>

          {/* Total Amount */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total dibayar</span>
              <span className="text-lg font-bold text-success">{formatCurrency(data.totalAmount)}</span>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div>
            <h3 className="font-semibold mb-3">Rincian pembayaran</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Biaya perjalanan</span>
                <span>{formatCurrency(data.baseFare)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya jasa aplikasi</span>
                <span>{formatCurrency(data.appFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya PerjalananAman+</span>
                <span>{formatCurrency(data.insuranceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon</span>
                <span className="text-destructive">-{formatCurrency(data.discount)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total pembayaran</span>
                  <span>{formatCurrency(data.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Dibayar pakai {data.paymentMethod}</span>
                  <span>{formatCurrency(data.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div>
            <h3 className="font-semibold mb-3">Detail perjalanan</h3>
            
            {/* Trip Details Card */}
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Driver & Trip Info */}
                <div className="space-y-4">
                  {/* Driver Info */}
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">{data.driverName}</p>
                      <p className="text-sm text-muted-foreground">{data.licensePlate} • {data.vehicleType}</p>
                    </div>
                  </div>

                  {/* Trip Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Jarak {data.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Waktu perjalanan {data.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Route Details */}
                <div className="space-y-4">
                  {/* Pickup */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <div className="w-px h-12 bg-border"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dijemput {data.orderDate} jam {data.pickupTime} dari</p>
                      <p className="text-sm font-semibold">{parseAddress(data.pickupAddress).detail}</p>
                      <p className="text-xs text-muted-foreground">
                        {parseAddress(data.pickupAddress).point}
                      </p>
                    </div>
                  </div>

                  {/* Dropoff */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <div className="w-px h-12 bg-border"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sampai {data.orderDate} jam {data.arrivalTime} di</p>
                      <p className="text-sm font-semibold">{parseAddress(data.dropoffAddress).detail}</p>
                      <p className="text-xs text-muted-foreground">
                        {parseAddress(data.dropoffAddress).point}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Links */}
          <div>
            <div className="flex justify-center gap-6 text-sm">
              <button className="text-primary hover:underline">Bantuan</button>
              <button className="text-primary hover:underline">Laporkan masalah</button>
              <button className="text-primary hover:underline">Tentang GoRide</button>
            </div>
          </div>

          {/* Footer Note */}
          {data.notes && (
            <div className="text-xs text-muted-foreground text-center leading-relaxed">
              {data.notes}
            </div>
          )}

          {/* Social Links */}
          <div className="text-center">
            <p className="text-sm font-medium mb-3">Kontak Gojek lewat</p>
            <div className="flex justify-center gap-4">
              {/* Instagram */}
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faInstagram} className="text-primary" size="sm" />
              </div>
              {/* Twitter */}
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faTwitter} className="text-primary" size="sm" />
              </div>
              {/* Facebook */}
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faFacebookF} className="text-primary" size="sm" />
              </div>
              {/* YouTube */}
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faYoutube} className="text-primary" size="sm" />
              </div>
              {/* LinkedIn */}
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faLinkedinIn} className="text-primary" size="sm" />
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <MopedIcon size={32} />

            </div>
            <p className="text-xs text-muted-foreground">
              Pasaraya Blok M GD B, 7th Floor, Kebayoran<br />
              Baru, DKI Jakarta Indonesia 12160
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};