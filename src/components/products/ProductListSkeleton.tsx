import { Skeleton } from "@/components/ui/skeleton"

interface ProductListSkeletonProps {
  count?: number
}

const ProductListSkeleton = ({ count = 10 }: ProductListSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted">
            <tr>
              {Array.from({ length: 7 }).map((_, index) => (
                <th key={index} className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: count }).map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                  </div>
                </td>
                {Array.from({ length: 6 }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-16" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductListSkeleton
