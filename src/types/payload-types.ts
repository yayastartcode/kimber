import type { ReactNode } from 'react'

// Define PayloadComponent type since we can't import it directly
type PayloadComponent<Props = any> = (props: Props) => ReactNode

export type RowLabelComponentProps<T = any> = {
  data: T
  index?: number
  path?: string
}

export type RowLabelComponent<T = any> = PayloadComponent<RowLabelComponentProps<T>>
