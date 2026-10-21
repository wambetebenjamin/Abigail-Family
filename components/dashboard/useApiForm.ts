'use client'

import { useCallback, useRef, useState } from 'react'
import { useRecaptcha } from '@/components/site/Recaptcha'
import { postJson, type ApiFieldErrors, type ApiResult } from '@/lib/client-api'

export function useApiForm<T extends Record<string, unknown>>(endpoint: string, action: string) {
  const { execute } = useRecaptcha()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({})
  const [requiresV2, setRequiresV2] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const lastPayload = useRef<Record<string, unknown> | null>(null)

  const submit = useCallback(
    async (payload: Record<string, unknown>): Promise<ApiResult<T> | null> => {
      setLoading(true)
      setError(null)
      setSuccess(null)
      setRequiresV2(false)
      setFieldErrors({})
      lastPayload.current = payload
      try {
        const recaptchaToken = await execute(action)
        const result = await postJson<T>(endpoint, { ...payload, recaptchaToken })
        if (!result.ok) {
          setError(result.error || 'That did not save. Please check the form and try again.')
          setFieldErrors(result.fieldErrors || {})
          setRequiresV2(Boolean(result.requiresV2))
          return result
        }
        setSuccess('Saved')
        return result
      } finally {
        setLoading(false)
      }
    },
    [action, endpoint, execute],
  )

  const retry = useCallback(() => {
    if (lastPayload.current) return submit(lastPayload.current)
    return undefined
  }, [submit])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
    setRequiresV2(false)
    setFieldErrors({})
  }, [])

  return {
    submit,
    retry,
    loading,
    error,
    fieldErrors,
    requiresV2,
    success,
    setSuccess,
    clearMessages,
  }
}
