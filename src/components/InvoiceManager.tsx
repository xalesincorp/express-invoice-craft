import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useInvoiceStorage, SavedInvoice } from '@/hooks/useInvoiceStorage';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { useToast } from '@/hooks/use-toast';
import { 
  Archive,
  Download,
  Edit,
  Eye,
  FileText,
  Search,
  Trash2,
  Calendar,
  User,
  DollarSign,
  DownloadCloud
} from 'lucide-react';
import { InvoiceData } from '@/types/invoice';

interface InvoiceManagerProps {
  onEditInvoice: (invoice: InvoiceData) => void;
  onViewInvoice: (invoice: InvoiceData) => void;
}

export const InvoiceManager = ({ onEditInvoice, onViewInvoice }: InvoiceManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const { savedInvoices, deleteInvoice, clearAllInvoices } = useInvoiceStorage();
  const { generatePDF, generateBulkPDF } = usePDFGenerator();
  const { toast } = useToast();

  const filteredInvoices = savedInvoices.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadPDF = async (invoice: SavedInvoice) => {
    // Set the invoice as current for PDF generation
    onViewInvoice(invoice);
    
    // Wait a bit for the preview to update
    setTimeout(async () => {
      await generatePDF(invoice);
    }, 100);
  };

  const handleBulkDownload = async () => {
    if (selectedInvoices.length === 0) {
      toast({
        title: "No invoices selected",
        description: "Please select invoices to download",
        variant: "destructive",
      });
      return;
    }

    const invoicesToDownload = savedInvoices.filter(inv => 
      selectedInvoices.includes(inv.id)
    );

    await generateBulkPDF(invoicesToDownload, (current, total) => {
      toast({
        title: "Generating PDFs...",
        description: `Processing ${current} of ${total} invoices`,
      });
    });

    setSelectedInvoices([]);
  };

  const handleDeleteInvoice = (id: string) => {
    deleteInvoice(id);
    setSelectedInvoices(prev => prev.filter(selectedId => selectedId !== id));
    toast({
      title: "Invoice deleted",
      description: "Invoice has been removed from storage",
    });
  };

  const handleSelectInvoice = (id: string) => {
    setSelectedInvoices(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          Invoice Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name, order ID, or driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {selectedInvoices.length > 0 && (
              <>
                <Button
                  onClick={handleBulkDownload}
                  variant="outline"
                  size="sm"
                >
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Download ({selectedInvoices.length})
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedInvoices.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Invoices</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedInvoices.length} selected invoice(s)? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          selectedInvoices.forEach(handleDeleteInvoice);
                          setSelectedInvoices([]);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <FileText className="h-4 w-4" />
              Total Invoices
            </div>
            <div className="text-2xl font-bold">{savedInvoices.length}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(savedInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0))}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <User className="h-4 w-4" />
              Unique Customers
            </div>
            <div className="text-2xl font-bold">
              {new Set(savedInvoices.map(inv => inv.customerName)).size}
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first invoice to get started'}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === filteredInvoices.length}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.paymentMethod}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{invoice.orderId}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{invoice.orderDate}</div>
                        <div className="text-muted-foreground">
                          {formatDate(invoice.createdAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{invoice.driverName}</div>
                        <div className="text-muted-foreground">{invoice.licensePlate}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditInvoice(invoice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(invoice)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this invoice for {invoice.customerName}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteInvoice(invoice.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};