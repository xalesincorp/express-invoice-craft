import { useCallback } from 'react';
import { InvoiceData } from '@/types/invoice';
import { useToast } from '@/hooks/use-toast';

export const usePDFGenerator = () => {
  const { toast } = useToast();

  const generatePDF = useCallback(async (invoiceData: InvoiceData, elementId: string = 'invoice-preview') => {
    try {
      const invoiceElement = document.getElementById(elementId);
      if (!invoiceElement) {
        throw new Error('Invoice preview element not found');
      }

      // Show loading toast
      toast({
        title: "Preparing print...",
        description: "Opening print dialog for invoice",
      });

      // Add print-specific styles
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body * {
            visibility: hidden;
          }
          #${elementId}, #${elementId} * {
            visibility: visible;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          #${elementId} {
            position: relative !important;
            left: auto !important;
            top: -270px !important;
            width: 450px !important;
            max-width: 450px !important;
            margin: 0 auto !important;
            padding: 8px !important;
            box-shadow: none !important;
            border: none !important;
            text-align: justify !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: none;
          }
        }
      `;
      document.head.appendChild(style);

      // Trigger print dialog
      setTimeout(() => {
        window.print();
        
        // Clean up after print
        setTimeout(() => {
          document.head.removeChild(style);
        }, 1000);
      }, 100);

      toast({
        title: "Print dialog opened",
        description: "Use your browser's print dialog to save as PDF",
      });

      return { success: true, filename: `invoice-${invoiceData.orderId || 'unknown'}.pdf` };
    } catch (error) {
      console.error('Error opening print dialog:', error);
      
      toast({
        title: "Error opening print",
        description: "Failed to open print dialog. Please try again.",
        variant: "destructive",
      });

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [toast]);

  const generateBulkPDF = useCallback(async (invoices: InvoiceData[], onProgress?: (current: number, total: number) => void) => {
    try {
      toast({
        title: "Bulk Print Mode",
        description: "Bulk printing now uses browser print dialog. Please print each invoice individually.",
      });
      
      // For bulk, we'll just generate the first one as an example
      if (invoices.length > 0) {
        await generatePDF(invoices[0]);
      }
      
      return [];
    } catch (error) {
      console.error('Error in bulk print:', error);
      
      toast({
        title: "Bulk Print Failed",
        description: "An error occurred during bulk print",
        variant: "destructive",
      });

      return [];
    }
  }, [generatePDF, toast]);

  return {
    generatePDF,
    generateBulkPDF,
  };
};