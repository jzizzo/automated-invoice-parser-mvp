import { NormalizedItem } from '@/lib/types';

export function normalizeExtractedData(rawData: any[]): NormalizedItem[] {
  return rawData.map(item => {
    // Map keys with fallbacks. For example:
    const requestItem = item['Request Item'] || item['Item'] || '';
    // For quantity, try multiple keys:
    const quantity = item['Amount'] || item['Quantity'] || item['Qty'] || item['qty'] || 0;
    // For unit price, try both "Unit Price" and "Unit Cost"
    let unitPrice = item['Unit Price'] || item['Unit Cost'] || 0;
    let total = item['Total'] || item['Ext Cost'] || 0;

    // Convert currency strings to numbers if needed.
    if (typeof unitPrice === 'string') {
      unitPrice = parseFloat(unitPrice.replace(/[^0-9.]/g, ''));
    }
    if (typeof total === 'string') {
      total = parseFloat(total.replace(/[^0-9.]/g, ''));
    }

    return {
      requestItem,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      total: Number(total)
    };
  });
}
