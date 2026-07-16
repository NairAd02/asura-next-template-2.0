import { Skeleton } from "@/components/ui/skeleton";

export default function SuppliersListLoadingSkeleton() {
  return <div className="space-y-3">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-16 w-full rounded-md" />)}</div>;
}
