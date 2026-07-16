export interface IAllOrdersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllOrdersData;
    message: string;
    timestamp: string;
}
export interface IAllOrdersData {
    summary: Summary;
    data: IAllOrdersData1;
}
export interface Summary {
    totalRevenue: number;
    totalOrders: number;
    completedOrders: number;
    paidOrders: number;
    statusCounts: StatusCounts;
    paymentStatusCounts: PaymentStatusCounts;
}
export interface StatusCounts {
    completed: number;
}
export interface PaymentStatusCounts {
    Paid: number;
}
export interface IAllOrdersData1 {
    data?: (IAllOrdersDataEntity)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface IAllOrdersDataEntity {
    id: string;
    orderNumber: number;
    invoiceNumber: number;
    itemCount: number;
    item: string;
    paymentType: string;
    totalAmount: number;
    discountAmount: number;
    couponCode?: null;
    couponDiscount?: number | null;
    taxAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    transactionId: string;
    paidAt: string;
    createdAt: string;
    customer: Customer;
    items?: (ItemsEntity)[] | null;
}
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}
export interface ItemsEntity {
    id: string;
    type: string;
    title: string;
    quantity: number;
    price: number;
    total: number;
    legacyType: string;
}
