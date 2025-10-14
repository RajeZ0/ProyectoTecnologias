import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ProductSkeleton() {
  return (
    <Card className="bg-slate-800/50 border-slate-700 animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 bg-slate-700/50 rounded-t-lg"></div>

      <CardHeader>
        {/* Title skeleton */}
        <div className="h-6 bg-slate-700/50 rounded w-3/4 mb-2"></div>
        {/* Description skeleton */}
        <div className="h-4 bg-slate-700/50 rounded w-full mb-1"></div>
        <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
        {/* Badge skeleton */}
        <div className="h-6 bg-slate-700/50 rounded w-1/3 mt-2"></div>
      </CardHeader>

      <CardContent>
        {/* Price skeleton */}
        <div className="h-8 bg-slate-700/50 rounded w-1/2"></div>
      </CardContent>

      <CardFooter>
        {/* Button skeleton */}
        <div className="h-10 bg-slate-700/50 rounded w-full"></div>
      </CardFooter>
    </Card>
  )
}
