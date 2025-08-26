import { useEffect, useState } from 'react';

/**
 * Hook to check if component is mounted on client side
 * Prevents hydration mismatch issues when using dynamic data
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook to safely use dynamic values that differ between server and client
 * Returns null on server-side rendering, actual value on client-side
 */
export function useClientOnly<T>(value: T): T | null {
  const isClient = useIsClient();
  return isClient ? value : null;
}

export default useIsClient;
