import Link from "next/link"

import { ThemeWrapper } from "@/components/theme-wrapper"

interface SinkLayoutProps {
  children: React.ReactNode
}

export default function SinkLayout({ children }: SinkLayoutProps) {
  return (
    <div className="flex flex-col">
      <div className="container">
        <div className="flex space-x-2 px-2 py-4">
          Components list
        </div>
      </div>
      <div className="flex-1">
        <ThemeWrapper>{children}</ThemeWrapper>
      </div>
    </div>
  )
}
