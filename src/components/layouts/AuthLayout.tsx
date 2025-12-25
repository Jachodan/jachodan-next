'use client';

import { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <ScrollArea className="h-[calc(100dvh-var(--header-height))]">{children}</ScrollArea>;
}
