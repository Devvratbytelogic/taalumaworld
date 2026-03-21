export interface IAllTestimonialsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (ITestimonialsDataEntity)[] | null;
    message: string;
    timestamp: string;
  }
  export interface ITestimonialsDataEntity {
    _id: string;
    name: string;
    rating: number;
    title: string;
    message: string;
    photo?: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    __v: number;
  }
  