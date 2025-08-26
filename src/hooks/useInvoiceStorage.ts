import { useState, useEffect } from 'react';
import { InvoiceData, defaultInvoiceData } from '@/types/invoice';

const STORAGE_KEY = 'goride_invoices';
const CURRENT_INVOICE_KEY = 'goride_current_invoice';

export interface SavedInvoice extends InvoiceData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const useInvoiceStorage = () => {
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>(defaultInvoiceData);

  // Load data on mount
  useEffect(() => {
    loadSavedInvoices();
    loadCurrentInvoice();
  }, []);

  const loadSavedInvoices = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const invoices = JSON.parse(stored) as SavedInvoice[];
        setSavedInvoices(invoices);
      }
    } catch (error) {
      console.error('Error loading saved invoices:', error);
    }
  };

  const loadCurrentInvoice = () => {
    try {
      const stored = localStorage.getItem(CURRENT_INVOICE_KEY);
      if (stored) {
        const invoice = JSON.parse(stored) as InvoiceData;
        setCurrentInvoice(invoice);
      }
    } catch (error) {
      console.error('Error loading current invoice:', error);
    }
  };

  const saveCurrentInvoice = (invoiceData: InvoiceData) => {
    try {
      setCurrentInvoice(invoiceData);
      localStorage.setItem(CURRENT_INVOICE_KEY, JSON.stringify(invoiceData));
    } catch (error) {
      console.error('Error saving current invoice:', error);
    }
  };

  const saveInvoice = (invoiceData: InvoiceData): SavedInvoice => {
    try {
      const newInvoice: SavedInvoice = {
        ...invoiceData,
        id: generateInvoiceId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedInvoices = [newInvoice, ...savedInvoices];
      setSavedInvoices(updatedInvoices);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
      
      return newInvoice;
    } catch (error) {
      console.error('Error saving invoice:', error);
      throw error;
    }
  };

  const updateInvoice = (id: string, invoiceData: InvoiceData): SavedInvoice => {
    try {
      const updatedInvoices = savedInvoices.map(invoice => 
        invoice.id === id 
          ? { ...invoice, ...invoiceData, updatedAt: new Date().toISOString() }
          : invoice
      );
      
      setSavedInvoices(updatedInvoices);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
      
      const updatedInvoice = updatedInvoices.find(inv => inv.id === id);
      if (!updatedInvoice) throw new Error('Invoice not found after update');
      
      return updatedInvoice;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  };

  const deleteInvoice = (id: string) => {
    try {
      const updatedInvoices = savedInvoices.filter(invoice => invoice.id !== id);
      setSavedInvoices(updatedInvoices);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  };

  const loadInvoice = (id: string): SavedInvoice | null => {
    return savedInvoices.find(invoice => invoice.id === id) || null;
  };

  const clearAllInvoices = () => {
    try {
      setSavedInvoices([]);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing invoices:', error);
    }
  };

  const generateInvoiceId = (): string => {
    return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  return {
    savedInvoices,
    currentInvoice,
    saveCurrentInvoice,
    saveInvoice,
    updateInvoice,
    deleteInvoice,
    loadInvoice,
    clearAllInvoices,
    loadSavedInvoices,
  };
};