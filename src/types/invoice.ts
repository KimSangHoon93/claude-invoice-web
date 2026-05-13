// 청구서 도메인 타입 정의

export type InvoiceStatus = "대기" | "거절" | "승인";

export interface InvoiceItem {
  id: string;
  name: string;       // 항목명
  unitPrice: number;  // 단가
  quantity: number;   // 수량
  totalPrice: number; // 금액 (formula: 단가 × 수량)
}

export interface Invoice {
  id: string;
  invoiceNumber: string;   // 견적서 번호
  clientName: string;      // 클라이언트명
  totalAmount: number;     // 총금액
  status: InvoiceStatus;   // 상태
  issueDate: string;       // 방행일 (ISO 8601)
  validUntil: string;      // 유효기간 (ISO 8601)
  items: InvoiceItem[];    // 항목 목록 (상세 조회 시 채워짐)
}
