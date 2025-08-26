import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
        title: "Generating PDF...",
        description: "Please wait while we create your invoice PDF",
      });

      // Wait a bit for any dynamic content to render
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(invoiceElement, {
        scale: 3, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: invoiceElement.scrollWidth,
        height: invoiceElement.scrollHeight,
        windowWidth: invoiceElement.scrollWidth,
        windowHeight: invoiceElement.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scale to fit width while maintaining aspect ratio
      const scale = (pdfWidth - 20) / imgWidth; // 10mm margin on each side
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      
      // Center the image horizontally
      const imgX = (pdfWidth - scaledWidth) / 2;
      const imgY = 10; // 10mm top margin
      
      // If image is too tall, scale down further
      const maxHeight = pdfHeight - 20; // 10mm margin top and bottom
      let finalWidth = scaledWidth;
      let finalHeight = scaledHeight;
      
      if (scaledHeight > maxHeight) {
        const heightScale = maxHeight / scaledHeight;
        finalWidth = scaledWidth * heightScale;
        finalHeight = maxHeight;
      }
      
      // Center the final image
      const finalX = (pdfWidth - finalWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', finalX, imgY, finalWidth, finalHeight);
      
      // Generate filename with order ID and timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `invoice-${invoiceData.orderId || 'unknown'}-${timestamp}.pdf`;
      
      pdf.save(filename);

      toast({
        title: "PDF Generated Successfully!",
        description: `Invoice saved as ${filename}`,
      });

      return { success: true, filename };
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      toast({
        title: "Error Generating PDF",
        description: "Failed to create PDF. Please try again.",
        variant: "destructive",
      });

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [toast]);

  const generateBulkPDF = useCallback(async (invoices: InvoiceData[], onProgress?: (current: number, total: number) => void) => {
    try {
      const results = [];
      
      for (let i = 0; i < invoices.length; i++) {
        onProgress?.(i + 1, invoices.length);
        
        // Generate PDF for each invoice
        const result = await generatePDF(invoices[i]);
        results.push({
          invoice: invoices[i],
          result
        });
        
        // Small delay between generations to prevent overwhelming the browser
        if (i < invoices.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const successful = results.filter(r => r.result.success).length;
      const failed = results.length - successful;

      toast({
        title: "Bulk PDF Generation Complete",
        description: `${successful} PDFs generated successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      });

      return results;
    } catch (error) {
      console.error('Error in bulk PDF generation:', error);
      
      toast({
        title: "Bulk PDF Generation Failed",
        description: "An error occurred during bulk generation",
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