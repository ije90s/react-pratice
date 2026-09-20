const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// 401(만료·무효 토큰)을 만났을 때 실행할 함수. React 바깥의 apiFetch가 인증 상태(AuthProvider)를
// 직접 알 수 없으므로 AuthProvider가 여기에 등록한다. 등록 지점은 AuthProvider 한 곳뿐이다.
let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  token?: string | null;
  body?: unknown;
}

interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T;
}

export async function apiFetch<T>(
  path: string,
  { token, body, headers, ...rest }: ApiFetchOptions = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      // FormData(multipart)는 Content-Type을 직접 지정하면 안 된다 — 브라우저가 boundary를 붙여 자동으로 넣는다.
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    // 로그인 실패(잘못된 비밀번호)도 401이므로, 토큰을 보낸 요청일 때만 "세션 만료"로 본다.
    if (res.status === 401 && token) unauthorizedHandler?.();
    const errorBody = await res.json().catch(() => null);
    throw new ApiError(res.status, errorBody?.message ?? res.statusText);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const envelope: ApiResponseEnvelope<T> = await res.json();
  return envelope.data;
}
