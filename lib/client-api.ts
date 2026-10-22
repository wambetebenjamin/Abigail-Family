export type ApiFieldErrors = Record<string, string[] | undefined>

export type ApiResult<T> = {
  ok: boolean
  error?: string
  fieldErrors?: ApiFieldErrors
  requiresV2?: boolean
  storageConfigured?: boolean
} & Partial<T>

export async function postJson<T extends Record<string, unknown>>(
  url: string,
  payload: Record<string, unknown>,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = (await response.json()) as ApiResult<T>
    return data
  } catch {
    return {
      ok: false,
      error: 'We could not reach the server. Check your connection and try again.',
    } as ApiResult<T>
  }
}

export async function uploadFile(
  file: File,
  intent: 'document' | 'receipt' | 'handover-photo',
  extra: Record<string, string> = {},
): Promise<ApiResult<{ url: string }>> {
  try {
    const body = new FormData()
    body.append('file', file)
    body.append('intent', intent)
    Object.entries(extra).forEach(([key, value]) => body.append(key, value))

    const response = await fetch('/api/documents/upload', { method: 'POST', body })
    return (await response.json()) as ApiResult<{ url: string }>
  } catch {
    return { ok: false, error: 'The upload did not finish. Please try again.' } as ApiResult<{
      url: string
    }>
  }
}
