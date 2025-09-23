export * from "./ApiResponse";
export * from "./auth";
export * from "./movie";
export * from "./user";

export interface UIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}
