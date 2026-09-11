export interface IContentListItem {
  _id: string;
  title: string;
  slug: string;
}

export interface ISeriesListAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IContentListItem[];
  message: string;
  timestamp: string;
}

export interface IBlueprintListAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IContentListItem[];
  message: string;
  timestamp: string;
}
