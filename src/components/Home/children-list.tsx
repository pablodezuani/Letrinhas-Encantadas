"use client"

import { ChildCard } from "@/components/child-card"
import { EmptyState } from "@/components/empty-state"
import type { Child } from "@/lib/types"

interface ChildrenListProps {
  children: Child[]
  onChildSelect: (child: Child) => void
  searchQuery: string
}

export function ChildrenList({ children, onChildSelect, searchQuery }: ChildrenListProps) {
  if (children.length === 0) {
    return <EmptyState searchQuery={searchQuery} />
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children.map((child) => (
          <ChildCard key={child.id} child={child} onSelect={() => onChildSelect(child)} />
        ))}
      </div>
    </div>
  )
}
