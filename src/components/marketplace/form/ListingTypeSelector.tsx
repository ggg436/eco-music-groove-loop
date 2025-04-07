
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Package, RefreshCw, Gift } from "lucide-react";

interface ListingTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ListingTypeSelector({ value, onChange }: ListingTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Listing Type</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Offer" id="listing-offer" />
          <Label htmlFor="listing-offer" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Offer for Sale
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Exchange" id="listing-exchange" />
          <Label htmlFor="listing-exchange" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Exchange / Trade
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Donation" id="listing-donation" />
          <Label htmlFor="listing-donation" className="flex items-center">
            <Gift className="mr-2 h-4 w-4" />
            Free Donation
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
