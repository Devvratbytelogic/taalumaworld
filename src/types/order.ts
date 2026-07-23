export interface IAllOrdersAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllOrdersAPIResponseData;
    message: string;
    timestamp: string;
}
export interface IAllOrdersAPIResponseData {
    summary: Summary;
    data: IAllOrdersAPIResponseDataEntityItem;
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
export interface IAllOrdersAPIResponseDataEntityItem {
    data?: (IAllOrdersAPIResponseDataEntityItemEntityItem)[] | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface IAllOrdersAPIResponseDataEntityItemEntityItem {
    id: string;
    orderId: number;
    transactionId: string;
    userName: string;
    userEmail: string;
    itemCount: number;
    type: string;
    amount: number;
    date: string;
    paymentMethod: string;
    status: string;
    items?: (IAllOrdersAPIResponseDataEntityItemEntityItemItems)[] | null;
    legacyType?: string | null;
}
export interface IAllOrdersAPIResponseDataEntityItemEntityItemItems {
    type: string;
    name: string;
    image: string;
    legacyType: string;
}





/** GET /admin/orders/:id */
export interface ISingleOrderAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IOrder;
    message: string;
    timestamp: string;
  }
  export interface IOrder {
    id: string;
    orderId: number;
    invoiceNumber: number;
    itemCount: number;
    item: string;
    type: string;
    paymentType: string;
    totalAmount: number;
    discountAmount: number;
    couponCode: string;
    couponDiscount: number;
    coupon_value: number;
    couponType: string;
    taxAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    transactionId: string;
    tax_percent: number;
    paidAt: string;
    createdAt: string;
    customer: Customer;
    items?: (IOrderItem)[] | null;
  }
  export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
  export interface IOrderItem {
    id: string;
    type: string;
    title: string;
    quantity: number;
    price: number;
    total: number;
    legacyType: string;
  }
  
