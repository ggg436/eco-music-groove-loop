
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ListingTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ListingTypeSelector({ value, onChange }: ListingTypeSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="listingType">Listing Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select listing type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Offer">Offer (Selling)</SelectItem>
          <SelectItem value="Request">Request (Donation)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
