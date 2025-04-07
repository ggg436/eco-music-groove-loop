
import { Input } from "@/components/ui/input";
import { FormField } from "./FormField";

interface PriceFieldsProps {
  price: number | undefined;
  originalPrice: number | undefined;
  onPriceChange: (value: number | undefined) => void;
  onOriginalPriceChange: (value: number | undefined) => void;
}

export function PriceFields({
  price,
  originalPrice,
  onPriceChange,
  onOriginalPriceChange,
}: PriceFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField id="price" label="Price">
        <Input
          id="price"
          type="number"
          value={price === undefined ? "" : price.toString()}
          onChange={(e) => 
            onPriceChange(e.target.value === "" ? undefined : parseFloat(e.target.value))
          }
          placeholder="Selling Price"
        />
      </FormField>
      <FormField id="originalPrice" label="Original Price (Optional)">
        <Input
          id="originalPrice"
          type="number"
          value={originalPrice === undefined ? "" : originalPrice.toString()}
          onChange={(e) =>
            onOriginalPriceChange(e.target.value === "" ? undefined : parseFloat(e.target.value))
          }
          placeholder="Original Price"
        />
      </FormField>
    </div>
  );
}
