import { useState, useRef, useEffect } from "react";
import { InvoiceData, defaultInvoiceData } from "@/types/invoice";
import { InvoicePreview } from "@/components/InvoicePreview";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoiceManager } from "@/components/InvoiceManager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useInvoiceStorage } from "@/hooks/useInvoiceStorage";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { FileText, Settings, Eye, Archive, Plus } from "lucide-react";
import gorideIcon from "@/assets/goride-icon.png";

const Index = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);
  const [activeTab, setActiveTab] = useState("form");
  const { toast } = useToast();
  const invoiceFormRef = useRef<{ generatePDF: () => void }>(null);
  
  const { 
    currentInvoice, 
    saveCurrentInvoice, 
    saveInvoice,
    savedInvoices 
  } = useInvoiceStorage();
  
  const { generatePDF } = usePDFGenerator();

  // Load current invoice on mount
  useEffect(() => {
    if (currentInvoice && Object.keys(currentInvoice).length > 0) {
      setInvoiceData(currentInvoice);
    }
  }, [currentInvoice]);

  // Auto-save current invoice when data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCurrentInvoice(invoiceData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [invoiceData, saveCurrentInvoice]);

  const handleGeneratePDF = async () => {
    await generatePDF(invoiceData);
  };

  const handleSaveInvoice = () => {
    try {
      const savedInvoice = saveInvoice(invoiceData);
      toast({
        title: "Invoice saved successfully!",
        description: `Invoice ${savedInvoice.orderId} has been saved`,
      });
      setActiveTab("manager");
    } catch (error) {
      toast({
        title: "Error saving invoice",
        description: "Failed to save invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditInvoice = (invoice: InvoiceData) => {
    setInvoiceData(invoice);
    setActiveTab("form");
    toast({
      title: "Invoice loaded",
      description: "Invoice data loaded for editing",
    });
  };

  const handleViewInvoice = (invoice: InvoiceData) => {
    setInvoiceData(invoice);
    setActiveTab("preview");
  };

  const handleNewInvoice = () => {
    setInvoiceData(defaultInvoiceData);
    setActiveTab("form");
    toast({
      title: "New invoice created",
      description: "Ready to create a new invoice",
    });
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={gorideIcon} alt="GoRide Icon" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold">GoRide Invoice Generator</h1>
                <p className="text-sm text-muted-foreground">
                  Generate professional ride invoices • {savedInvoices.length} saved
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleNewInvoice}
                variant="outline"
                className="hidden sm:flex"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
              <Button 
                onClick={handleGeneratePDF}
                className="hidden md:flex"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
            <TabsTrigger value="manager" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              <span className="hidden sm:inline">Manager</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Atur Data Invoice</h2>
                <p className="text-muted-foreground">
                  Lengkapi informasi perjalanan untuk menggenerate invoice GoRide
                </p>
              </div>
              <InvoiceForm
                ref={invoiceFormRef}
                data={invoiceData}
                onDataChange={setInvoiceData}
                onSaveInvoice={handleSaveInvoice}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Preview Invoice</h2>
              <p className="text-muted-foreground">
                Lihat tampilan invoice yang akan digenerate
              </p>
            </div>
            <div className="flex justify-center">
              <InvoicePreview data={invoiceData} />
            </div>

          </TabsContent>

          <TabsContent value="manager" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Invoice Manager</h2>
              <p className="text-muted-foreground">
                Manage, edit, and download your saved invoices
              </p>
            </div>
            <InvoiceManager
              onEditInvoice={handleEditInvoice}
              onViewInvoice={handleViewInvoice}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Phase Info */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-3">🚀 Development Phases</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-success mb-2">✅ Phase 1 (Completed)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Invoice template UI (GoRide style)</li>
                    <li>• Settings form untuk input data</li>
                    <li>• Preview functionality</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-success mb-2">✅ Phase 2 (Completed)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• ✅ Enhanced PDF generation & download</li>
                    <li>• ✅ Data persistence & auto-save</li>
                    <li>• ✅ Invoice management system</li>
                    <li>• ✅ Bulk operations & search</li>
                    <li>• ✅ Auto-calculation features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;