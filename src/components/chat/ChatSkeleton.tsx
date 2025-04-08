
import { Skeleton } from "@/components/ui/skeleton";

const ChatSkeleton = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-240px)] md:h-[calc(100vh-200px)] bg-background rounded-lg border shadow">
      <div className="p-4 border-b flex items-center">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="ml-3 flex-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32 mt-1" />
        </div>
      </div>
      <div className="p-3 bg-muted/50 border-b flex items-center">
        <Skeleton className="h-10 w-10 rounded mr-2" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${i % 2 === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20 mt-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t">
        <div className="flex items-end gap-2">
          <Skeleton className="flex-1 h-20" />
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton;
