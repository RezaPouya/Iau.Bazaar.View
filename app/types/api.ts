export interface ApiResponse<T> {
  data: T
  isSuccess: boolean
  statusCode: number
  message: string
}

