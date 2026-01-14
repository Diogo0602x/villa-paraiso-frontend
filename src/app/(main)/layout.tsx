import { MainLayout } from "@/shared/layout"
import type { ReactNode } from "react"

export default function MainGroupLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}
