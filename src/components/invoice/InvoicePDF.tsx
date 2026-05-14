// PDF 전용 청구서 템플릿 컴포넌트
// @react-pdf/renderer 고유 컴포넌트 사용 — 일반 JSX(div, Card 등) 불가
// 한국어 렌더링을 위해 NotoSansKR 폰트를 반드시 등록해야 함

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice";

// =========================================================
// 한국어 폰트 등록
// Variable font를 normal/bold 두 가지로 등록
// =========================================================
Font.register({
  family: "NotoSansKR",
  fonts: [
    {
      src: "/fonts/NotoSansKR-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/NotoSansKR-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

// =========================================================
// 금액 포맷 유틸 — Intl.NumberFormat (서버/브라우저 양쪽 사용 가능)
// =========================================================
function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: 0,
  }).format(amount);
}

// =========================================================
// 날짜 포맷 유틸 — YYYY년 M월 D일
// =========================================================
function formatDate(isoDate: string): string {
  if (!isoDate) return "–";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

// =========================================================
// PDF 스타일 정의
// 모든 스타일에 fontFamily: 'NotoSansKR' 지정 (한국어 필수)
// =========================================================
const styles = StyleSheet.create({
  // A4 페이지 기본 설정
  page: {
    fontFamily: "NotoSansKR",
    fontSize: 10,
    color: "#1a1a1a",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    backgroundColor: "#ffffff",
  },

  // 헤더 섹션 (브랜드명 + 견적서 번호)
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#e2e8f0",
  },
  brandName: {
    fontFamily: "NotoSansKR",
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  invoiceNumber: {
    fontFamily: "NotoSansKR",
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 6,
  },

  // 상태 배지
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  statusText: {
    fontFamily: "NotoSansKR",
    fontSize: 9,
    fontWeight: "bold",
  },

  // 청구서 기본 정보 섹션 (회색 배경 박스)
  infoSection: {
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
  },
  infoSectionTitle: {
    fontFamily: "NotoSansKR",
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoItem: {
    width: "47%",
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: "NotoSansKR",
    fontSize: 8,
    color: "#94a3b8",
    marginBottom: 3,
  },
  infoValue: {
    fontFamily: "NotoSansKR",
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
  },
  infoValueNormal: {
    fontFamily: "NotoSansKR",
    fontSize: 10,
    color: "#334155",
  },
  totalAmount: {
    fontFamily: "NotoSansKR",
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a",
  },

  // 테이블 섹션
  tableTitle: {
    fontFamily: "NotoSansKR",
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  table: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 20,
  },
  // 테이블 헤더 행 (회색 배경)
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  // 테이블 데이터 행
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableRowLast: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  // 합계 행
  tableSumRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderTopWidth: 2,
    borderTopColor: "#e2e8f0",
  },

  // 테이블 컬럼 너비 정의
  colName: {
    fontFamily: "NotoSansKR",
    flex: 3,
    fontSize: 9,
  },
  colUnitPrice: {
    fontFamily: "NotoSansKR",
    flex: 2,
    fontSize: 9,
    textAlign: "right",
  },
  colQty: {
    fontFamily: "NotoSansKR",
    flex: 1,
    fontSize: 9,
    textAlign: "center",
  },
  colTotal: {
    fontFamily: "NotoSansKR",
    flex: 2,
    fontSize: 9,
    textAlign: "right",
  },

  // 헤더 셀 텍스트
  headerCellText: {
    fontFamily: "NotoSansKR",
    fontWeight: "bold",
    color: "#475569",
    fontSize: 9,
  },
  // 데이터 셀 텍스트
  dataCellText: {
    fontFamily: "NotoSansKR",
    color: "#334155",
    fontSize: 9,
  },
  // 합계 셀 텍스트
  sumCellText: {
    fontFamily: "NotoSansKR",
    fontWeight: "bold",
    color: "#0f172a",
    fontSize: 10,
  },

  // 하단 섹션
  footer: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontFamily: "NotoSansKR",
    fontSize: 8,
    color: "#94a3b8",
  },
});

// =========================================================
// 상태별 배지 색상 설정
// =========================================================
function getStatusStyle(status: string): {
  badgeColor: string;
  textColor: string;
  label: string;
} {
  switch (status) {
    case "승인":
      return { badgeColor: "#dcfce7", textColor: "#166534", label: "승인" };
    case "거절":
      return { badgeColor: "#fee2e2", textColor: "#991b1b", label: "거절" };
    default:
      return { badgeColor: "#fef9c3", textColor: "#854d0e", label: "대기" };
  }
}

// =========================================================
// PDF 문서 컴포넌트
// =========================================================
interface InvoicePDFProps {
  invoice: Invoice;
}

export function InvoicePDF({ invoice }: InvoicePDFProps) {
  const statusStyle = getStatusStyle(invoice.status);

  return (
    <Document
      title={`${invoice.invoiceNumber} — ${invoice.clientName}`}
      author="InvoiceHub"
      subject="청구서"
      language="ko"
    >
      <Page size="A4" style={styles.page}>
        {/* ── 헤더 섹션: 브랜드명 + 견적서 번호 + 상태 ── */}
        <View style={styles.header}>
          {/* 왼쪽: 브랜드명 */}
          <Text style={styles.brandName}>InvoiceHub</Text>

          {/* 오른쪽: 견적서 번호 + 상태 배지 */}
          <View style={styles.headerRight}>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusStyle.badgeColor },
              ]}
            >
              <Text
                style={[styles.statusText, { color: statusStyle.textColor }]}
              >
                {statusStyle.label}
              </Text>
            </View>
          </View>
        </View>

        {/* ── 청구서 기본 정보 섹션 ── */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>청구서 정보</Text>
          <View style={styles.infoGrid}>
            {/* 클라이언트명 */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>클라이언트</Text>
              <Text style={styles.infoValue}>{invoice.clientName}</Text>
            </View>

            {/* 총금액 */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>총금액</Text>
              <Text style={styles.totalAmount}>
                {formatAmount(invoice.totalAmount)}
              </Text>
            </View>

            {/* 발행일 */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>발행일</Text>
              <Text style={styles.infoValueNormal}>
                {formatDate(invoice.issueDate)}
              </Text>
            </View>

            {/* 유효기간 */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>유효기간</Text>
              <Text style={styles.infoValueNormal}>
                {formatDate(invoice.validUntil)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── 청구 항목 테이블 ── */}
        <Text style={styles.tableTitle}>청구 항목</Text>
        <View style={styles.table}>
          {/* 테이블 헤더 */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colName, styles.headerCellText]}>항목명</Text>
            <Text style={[styles.colUnitPrice, styles.headerCellText]}>
              단가
            </Text>
            <Text style={[styles.colQty, styles.headerCellText]}>수량</Text>
            <Text style={[styles.colTotal, styles.headerCellText]}>금액</Text>
          </View>

          {/* 데이터 행 */}
          {invoice.items.length === 0 ? (
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.dataCellText,
                  { flex: 1, color: "#94a3b8", textAlign: "center" },
                ]}
              >
                등록된 항목이 없습니다.
              </Text>
            </View>
          ) : (
            invoice.items.map((item, index) => {
              const isLast = index === invoice.items.length - 1;
              return (
                <View
                  key={item.id}
                  style={isLast ? styles.tableRowLast : styles.tableRow}
                >
                  <Text style={[styles.colName, styles.dataCellText]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.colUnitPrice, styles.dataCellText]}>
                    {formatAmount(item.unitPrice)}
                  </Text>
                  <Text style={[styles.colQty, styles.dataCellText]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.colTotal, styles.dataCellText]}>
                    {formatAmount(item.totalPrice)}
                  </Text>
                </View>
              );
            })
          )}

          {/* 합계 행 */}
          {invoice.items.length > 0 && (
            <View style={styles.tableSumRow}>
              <Text style={[styles.colName, styles.sumCellText]}>합계</Text>
              <Text style={[styles.colUnitPrice, styles.sumCellText]}></Text>
              <Text style={[styles.colQty, styles.sumCellText]}></Text>
              <Text style={[styles.colTotal, styles.sumCellText]}>
                {formatAmount(invoice.totalAmount)}
              </Text>
            </View>
          )}
        </View>

        {/* ── 하단: 발행일 기준 날짜 ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>InvoiceHub</Text>
          <Text style={styles.footerText}>
            발행일: {formatDate(invoice.issueDate)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
