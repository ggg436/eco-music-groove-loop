
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConversationSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'newest' | 'oldest';
  setSortBy: (sort: 'newest' | 'oldest') => void;
}

export default function ConversationSearchBar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy
}: ConversationSearchBarProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="relative flex-1 md:w-[250px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search conversations..." 
          className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Button
        variant="outline"
        size={isMobile ? "icon" : "sm"}
        onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
        title={sortBy === 'newest' ? 'Sort: Newest first' : 'Sort: Oldest first'}
      >
        <ArrowUpDown className="h-4 w-4 mr-1.5" />
        {!isMobile && (sortBy === 'newest' ? 'Newest' : 'Oldest')}
      </Button>
    </div>
  );
}
