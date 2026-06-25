export interface IOrderPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IOrderItemEntity {
    id: string;
    type: string;
    title: string;
    quantity: number;
    price: number;
    total: number;
}

export interface IOrderCustomer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface IOrderEntity {
    id: string;
    orderNumber: number;
    invoiceNumber: number;
    itemCount: number;
    totalAmount: number;
    discountAmount: number;
    couponCode: string | null;
    couponDiscount: number | null;
    taxAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    transactionId: string;
    paidAt: string | null;
    createdAt: string;
    customer: IOrderCustomer;
    items: IOrderItemEntity[];
}

export interface IAllOrdersAPIResponseData {
    orders: IOrderEntity[];
    pagination: IOrderPagination;
}

export interface IAllOrdersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllOrdersAPIResponseData;
    message: string;
    timestamp: string;
}
