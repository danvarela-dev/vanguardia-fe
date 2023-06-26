export interface ApiResponse<T> {
  result: T;
  succeeded: boolean;
  error: any;
}
