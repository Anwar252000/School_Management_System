export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  errors: string[];
  message: string;
}
