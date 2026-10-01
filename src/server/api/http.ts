import type { ApiErrorResponse } from "@/shared/api-errors";

export function json<T>(body: T, init?: ResponseInit) {
  return Response.json(body, init);
}

export function apiError(
  status: number,
  code: ApiErrorResponse["error"]["code"],
  message: string,
  issues?: ApiErrorResponse["error"]["issues"],
) {
  return json<ApiErrorResponse>({ error: { code, message, ...(issues ? { issues } : {}) } }, { status });
}
