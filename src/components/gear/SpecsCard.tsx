import { GearItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpecsCardProps {
  gear: GearItem;
}

export function SpecsCard({ gear }: SpecsCardProps) {
  const specs = (gear.specifications as Record<string, unknown>) || {};
  const entries = Object.entries(specs);

  return (
    <Card className="border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Technical Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Brand</span>
            <span className="font-semibold text-foreground">{gear.brand}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Category</span>
            <span className="font-semibold text-foreground">{gear.category?.name || "General"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Inventory Units</span>
            <span className="font-semibold text-foreground">{gear.stock} in stock</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Item Status</span>
            <span className="font-semibold text-foreground">
              {gear.isAvailable ? "Ready for Rent" : "Currently Unavailable"}
            </span>
          </div>
          {entries.map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
              <span className="font-semibold text-foreground">{String(value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
