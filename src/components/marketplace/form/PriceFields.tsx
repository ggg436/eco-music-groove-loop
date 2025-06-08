
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceFieldsProps {
  listingType: string;
  price: string;
  onPriceChange: (value: string) => void;
}

export function PriceFields({
  listingType,
  price,
  onPriceChange,
}: PriceFieldsProps) {
  if (listingType !== "sell") {
    return null;
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="price">Price *</Label>
      <Input
        id="price"
        type="number"
        value={price}
        onChange={(e) => onPriceChange(e.target.value)}
        placeholder="Enter price"
        step="0.01"
        min="0"
      />
    </div>
  );
}
