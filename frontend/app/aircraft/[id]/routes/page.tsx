'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoutesPage() {
  const router = useRouter();

  // Redirecionar para a nova página de rotas (independente de aeronave)
  useEffect(() => {
    router.replace('/routes');
  }, [router]);

  return null;
}
