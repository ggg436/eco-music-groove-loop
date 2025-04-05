
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddMarketplaceItemForm from "./AddMarketplaceItemForm";

export default function NewItemDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-eco">
          <Plus className="mr-2 h-4 w-4" />
          Post New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Item</DialogTitle>
        </DialogHeader>
        <AddMarketplaceItemForm />
      </DialogContent>
    </Dialog>
  );
}
