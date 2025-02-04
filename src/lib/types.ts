export interface ExtractedItem {
  "Request Item": string;
  Amount: number;
  "Unit Price": number | null;
  Total: number | null;
}

export interface NormalizedItem {
  requestItem: string;
  quantity: number;
  unitPrice?: number;
  total?: number;
}
