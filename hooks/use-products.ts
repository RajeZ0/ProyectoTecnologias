'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type ProductCategory = {
  id: number
  name: string
  slug: string
  description?: string | null
}

export type ProductWithCategory = {
  id: number
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number | null
  image: string
  isOffer: boolean
  inStock: boolean
  createdAt: string
  updatedAt: string
  category: ProductCategory | null
}

type UseProductsOptions = {
  offersOnly?: boolean
}

type UseProductsState = {
  products: ProductWithCategory[]
  categories: ProductCategory[]
  loading: boolean
  error: string | null
}

export function useProducts(options?: UseProductsOptions) {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    categories: [],
    loading: true,
    error: null,
  })

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (options?.offersOnly) {
      params.set('offersOnly', 'true')
    }
    return params.toString()
  }, [options?.offersOnly])

  const fetchProducts = useCallback(
    async (signal?: AbortSignal) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const response = await fetch(`/api/products${query ? `?${query}` : ''}`, {
          method: 'GET',
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as {
          products?: ProductWithCategory[]
          categories?: ProductCategory[]
        }

        if (signal?.aborted) {
          return
        }

        setState({
          products: data.products ?? [],
          categories: data.categories ?? [],
          loading: false,
          error: null,
        })
      } catch (error) {
        if (signal?.aborted) {
          return
        }

        console.error('Failed to fetch products', error)
        setState({
          products: [],
          categories: [],
          loading: false,
          error: 'No fue posible cargar el catalogo en este momento.',
        })
      }
    },
    [query],
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchProducts(controller.signal)
    return () => {
      controller.abort()
    }
  }, [fetchProducts])

  const reload = useCallback(async () => {
    await fetchProducts()
  }, [fetchProducts])

  return { ...state, reload }
}
