import { getPayload } from 'payload'
import configPromise from './payload.config'

let cached = (global as any).payload

export const getPayloadClient = async () => {
  if (!cached) {
    cached = await getPayload({
      config: configPromise,
    })
    ;(global as any).payload = cached
  }
  return cached
}