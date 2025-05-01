import { getPayload } from 'payload'
import configPromise from './payload.config'

// Define a type for the global object with payload property
declare global {
  // eslint-disable-next-line no-var
  var payload: unknown;
}

// Type for the payload client
type PayloadClient = ReturnType<typeof getPayload> extends Promise<infer T> ? T : never;

// Using unknown with type assertion instead of any
let cached = global.payload as unknown as PayloadClient | undefined;

export const getPayloadClient = async () => {
  if (!cached) {
    cached = await getPayload({
      config: configPromise,
    })
    global.payload = cached
  }
  return cached
}