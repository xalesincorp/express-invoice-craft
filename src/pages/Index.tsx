import { useState } from "react";
import { InvoiceData, defaultInvoiceData } from "@/types/invoice";
import { InvoicePreview } from "@/components/InvoicePreview";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Settings, Eye } from "lucide-react";
import gorideIcon from "@/assets/goride-icon.png";

const Index = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData);
  const [activeTab, setActiveTab] = useState("form");
  const { toast } = useToast();

  const handleGeneratePDF = () => {
    // This will be implemented in Phase 2
    toast({
      title: "PDF Generation",
      description: "PDF generation akan diimplementasikan di Phase 2. Untuk saat ini, Anda bisa melihat preview invoice.",
      duration: 5000,
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
                <p className="text-sm text-muted-foreground">Generate professional ride invoices</p>
              </div>
            </div>
            <Button 
              onClick={handleGeneratePDF}
              className="hidden md:flex"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
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
                data={invoiceData}
                onDataChange={setInvoiceData}
                onGeneratePDF={handleGeneratePDF}
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
            <div className="flex justify-center">
              <Button 
                onClick={handleGeneratePDF}
                size="lg"
                className="min-w-[200px]"
              >
                <FileText className="h-5 w-5 mr-2" />
                Generate PDF
              </Button>
            </div>
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
                  <h4 className="font-medium text-success mb-2">✅ Phase 1 (Current)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Invoice template UI (GoRide style)</li>
                    <li>• Settings form untuk input data</li>
                    <li>• Preview functionality</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-warning mb-2">🔄 Phase 2 (Next)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• PDF generation & download</li>
                    <li>• Data persistence & management</li>
                    <li>• Bulk operations</li>
                    <li>• Custom templates</li>
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