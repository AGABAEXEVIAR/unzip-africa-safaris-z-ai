"use client";

import { Suspense } from "react";
import { RouterProvider } from "@/lib/router";
import { LanguageProvider } from "@/lib/language";
import { SmoothScroll } from "@/components/luxury/SmoothScroll";
import { CustomCursor } from "@/components/luxury/CustomCursor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <RouterProvider>
        <LanguageProvider>
          <SmoothScroll>
            <CustomCursor />
            {children}
          </SmoothScroll>
        </LanguageProvider>
      </RouterProvider>
    </Suspense>
  );
}
