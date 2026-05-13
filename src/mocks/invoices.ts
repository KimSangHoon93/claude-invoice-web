// 청구서 더미 데이터 — Phase 2 UI 개발 및 API 미연동 시 사용
import type { Invoice } from "@/types/invoice";

export const mockInvoices: Invoice[] = [
  {
    id: "mock-001",
    invoiceNumber: "INV-2026-001",
    clientName: "ABC 회사",
    totalAmount: 5000000,
    status: "대기",
    issueDate: "2026-05-07",
    validUntil: "2027-05-07",
    items: [
      { id: "item-001", name: "웹사이트 디자인", unitPrice: 3000000, quantity: 1, totalPrice: 3000000 },
      { id: "item-002", name: "반응형 퍼블리싱", unitPrice: 1000000, quantity: 1, totalPrice: 1000000 },
      { id: "item-003", name: "유지보수 (월)", unitPrice: 500000, quantity: 2, totalPrice: 1000000 },
    ],
  },
  {
    id: "mock-002",
    invoiceNumber: "INV-2026-002",
    clientName: "XYZ 스타트업",
    totalAmount: 8500000,
    status: "승인",
    issueDate: "2026-04-15",
    validUntil: "2026-10-15",
    items: [
      { id: "item-004", name: "모바일 앱 기획", unitPrice: 2000000, quantity: 1, totalPrice: 2000000 },
      { id: "item-005", name: "UI/UX 디자인", unitPrice: 3000000, quantity: 1, totalPrice: 3000000 },
      { id: "item-006", name: "프론트엔드 개발", unitPrice: 3500000, quantity: 1, totalPrice: 3500000 },
    ],
  },
  {
    id: "mock-003",
    invoiceNumber: "INV-2026-003",
    clientName: "베타 코퍼레이션",
    totalAmount: 1200000,
    status: "거절",
    issueDate: "2026-03-20",
    validUntil: "2026-09-20",
    items: [
      { id: "item-007", name: "로고 디자인", unitPrice: 600000, quantity: 1, totalPrice: 600000 },
      { id: "item-008", name: "명함 디자인", unitPrice: 200000, quantity: 3, totalPrice: 600000 },
    ],
  },
  {
    id: "mock-004",
    invoiceNumber: "INV-2026-004",
    clientName: "델타 인터내셔널",
    totalAmount: 15000000,
    status: "승인",
    issueDate: "2026-05-01",
    validUntil: "2026-11-01",
    items: [
      { id: "item-009", name: "ERP 시스템 개발", unitPrice: 10000000, quantity: 1, totalPrice: 10000000 },
      { id: "item-010", name: "서버 구축", unitPrice: 3000000, quantity: 1, totalPrice: 3000000 },
      { id: "item-011", name: "교육 및 인수인계", unitPrice: 2000000, quantity: 1, totalPrice: 2000000 },
    ],
  },
  {
    id: "mock-005",
    invoiceNumber: "INV-2026-005",
    clientName: "이노베이션 랩",
    totalAmount: 3300000,
    status: "대기",
    issueDate: "2026-05-10",
    validUntil: "2026-11-10",
    items: [
      { id: "item-012", name: "랜딩페이지 제작", unitPrice: 2000000, quantity: 1, totalPrice: 2000000 },
      { id: "item-013", name: "SEO 최적화", unitPrice: 650000, quantity: 2, totalPrice: 1300000 },
    ],
  },
];
