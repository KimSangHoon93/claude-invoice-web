// Notion API 공통 함수 — @notionhq/client v5.x
// 환경 변수 미설정 시 src/mocks/invoices.ts 더미 데이터 반환
import { Client } from "@notionhq/client";
import type { Invoice, InvoiceItem, InvoiceStatus } from "@/types/invoice";
import { mockInvoices } from "@/mocks/invoices";

// =========================================================
// 환경 변수 체크
// =========================================================
function isNotionConfigured(): boolean {
  return (
    !!process.env.NOTION_API_KEY?.trim() &&
    !!process.env.NOTION_INVOICES_SOURCE_ID?.trim()
  );
}

// Notion 클라이언트 (환경 변수 있을 때만 사용)
function getClient() {
  return new Client({ auth: process.env.NOTION_API_KEY });
}

// =========================================================
// Notion v5.x dataSources API 헬퍼
// =========================================================
type NotionClient = ReturnType<typeof getClient>;
type DataSourcesNs = {
  query: (...args: unknown[]) => Promise<unknown>;
  retrieve: (...args: unknown[]) => Promise<unknown>;
};

function getDataSources(notion: NotionClient): DataSourcesNs {
  return (notion as unknown as Record<string, DataSourcesNs>)["dataSources"];
}

// =========================================================
// Notion 응답 → Invoice 타입 어댑터
// =========================================================

/** Notion 페이지 properties에서 텍스트 추출 */
function extractText(
  prop: Record<string, unknown>,
  type: "title" | "rich_text"
): string {
  const arr = prop[type] as Array<{ plain_text: string }> | undefined;
  return arr?.map((t) => t.plain_text).join("") ?? "";
}

/** Notion 페이지 properties에서 숫자 추출 */
function extractNumber(prop: Record<string, unknown>): number {
  return (prop["number"] as number | null) ?? 0;
}

/** Notion 페이지 properties에서 날짜 추출 */
function extractDate(prop: Record<string, unknown>): string {
  const d = prop["date"] as { start: string } | null;
  return d?.start ?? "";
}

/** Notion 페이지 properties에서 status 추출 */
function extractStatus(prop: Record<string, unknown>): InvoiceStatus {
  const s = prop["status"] as { name: string } | null;
  const name = s?.name ?? "대기";
  if (name === "승인" || name === "거절") return name;
  return "대기";
}

/** Notion 페이지 properties에서 relation IDs 추출 */
function extractRelationIds(prop: Record<string, unknown>): string[] {
  const rel = prop["relation"] as Array<{ id: string }> | undefined;
  return rel?.map((r) => r.id) ?? [];
}

/** Notion 페이지 → InvoiceItem 변환 */
function mapPageToItem(page: Record<string, unknown>): InvoiceItem {
  const props = page["properties"] as Record<string, Record<string, unknown>>;
  const name = extractText(props["항목명"], "title");
  const unitPrice = extractNumber(props["단가"]);
  const quantity = extractNumber(props["수량"]);
  const formula = props["금액"] as Record<string, unknown> | undefined;
  const totalPrice =
    (formula?.["formula"] as Record<string, unknown> | undefined)?.[
      "number"
    ] as number ?? unitPrice * quantity;

  return {
    id: page["id"] as string,
    name,
    unitPrice,
    quantity,
    totalPrice,
  };
}

/** Notion 페이지 → Invoice 변환 (items 빈 배열로 초기화) */
function mapPageToInvoice(page: Record<string, unknown>): Invoice & { _itemIds: string[] } {
  const props = page["properties"] as Record<string, Record<string, unknown>>;
  return {
    id: page["id"] as string,
    invoiceNumber: extractText(props["견적서 번호"], "title"),
    clientName: extractText(props["클라이언트명"], "rich_text"),
    totalAmount: extractNumber(props["총금액"]),
    status: extractStatus(props["상태"]),
    issueDate: extractDate(props["방행일"]),
    validUntil: extractDate(props["유효기간"]),
    items: [],
    _itemIds: extractRelationIds(props["항목"]),
  };
}

// =========================================================
// 유틸 함수
// =========================================================

/** 발행일 기준 최신 순 정렬 */
export function sortByIssueDate(invoices: Invoice[]): Invoice[] {
  return [...invoices].sort(
    (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
  );
}

/** 상태로 필터링 */
export function filterByStatus(
  invoices: Invoice[],
  status: InvoiceStatus
): Invoice[] {
  return invoices.filter((inv) => inv.status === status);
}

/** 클라이언트명 또는 견적서 번호로 검색 */
export function searchInvoices(invoices: Invoice[], keyword: string): Invoice[] {
  const lower = keyword.toLowerCase();
  return invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(lower) ||
      inv.clientName.toLowerCase().includes(lower)
  );
}

// =========================================================
// API 함수
// =========================================================

/** 전체 청구서 목록 조회 (발행일 내림차순) */
export async function fetchInvoices(status?: InvoiceStatus): Promise<Invoice[]> {
  if (!isNotionConfigured()) {
    const list = status ? filterByStatus(mockInvoices, status) : mockInvoices;
    return sortByIssueDate(list);
  }

  try {
    const notion = getClient();
    const ds = getDataSources(notion);
    const sourceId = process.env.NOTION_INVOICES_SOURCE_ID!;

    const queryParams: Record<string, unknown> = {
      data_source_id: sourceId,
      sorts: [{ property: "방행일", direction: "descending" }],
    };

    if (status) {
      queryParams["filter"] = {
        property: "상태",
        status: { equals: status },
      };
    }

    const result = await ds.query(queryParams);
    const pages = (result as { results: Record<string, unknown>[] }).results;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const invoices = pages.map(mapPageToInvoice).map(({ _itemIds, ...inv }) => inv as Invoice);
    return invoices;
  } catch (error) {
    console.error("fetchInvoices 오류:", error);
    return [];
  }
}

/** ID로 단일 청구서 조회 (항목 포함) */
export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
  if (!isNotionConfigured()) {
    return mockInvoices.find((inv) => inv.id === id) ?? null;
  }

  try {
    const notion = getClient();
    const page = await notion.pages.retrieve({ page_id: id });
    const mapped = mapPageToInvoice(page as unknown as Record<string, unknown>);

    // 관계된 항목들을 병렬 조회
    const items = await Promise.all(
      mapped._itemIds.map((itemId) => fetchInvoiceItem(notion, itemId))
    );

    return {
      ...mapped,
      items: items.filter(Boolean) as InvoiceItem[],
    } as Invoice;
  } catch (error) {
    console.error("fetchInvoiceById 오류:", error);
    return null;
  }
}

/** 항목 단건 조회 (내부 헬퍼) */
async function fetchInvoiceItem(
  notion: NotionClient,
  itemId: string
): Promise<InvoiceItem | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: itemId });
    return mapPageToItem(page as unknown as Record<string, unknown>);
  } catch {
    return null;
  }
}

/** 청구서 상태 목록 (필터 UI용) */
export function getInvoiceStatuses(): InvoiceStatus[] {
  return ["대기", "승인", "거절"];
}

/** 금액 포맷 (₩1,000,000) */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
}
