import Link from "next/link";
import Image from "next/image";
import { GearItem } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface GearCardProps {
  gear: GearItem;
}

export function GearCard({ gear }: GearCardProps) {
  const price = typeof gear.pricePerDay === "number" 
    ? gear.pricePerDay 
    : parseFloat(gear.pricePerDay as string) || 0;

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all group border-muted">
      <Link href={`/gear/${gear.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-muted block">
        <Image
          src={gear.imageUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"}
          alt={gear.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized={gear.imageUrl?.startsWith("data:")}
        />
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end">
          {gear.isAvailable ? (
            <Badge className="bg-emerald-600/90 text-white font-medium hover:bg-emerald-700">
              Available
            </Badge>
          ) : (
            <Badge variant="destructive" className="font-medium">
              Booked
            </Badge>
          )}
        </div>
        {gear.category?.name && (
          <div className="absolute bottom-2.5 left-2.5">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground text-xs flex items-center gap-1 font-medium">
              <Tag className="h-3 w-3" /> {gear.category.name}
            </Badge>
          </div>
        )}
      </Link>

      <CardContent className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {gear.brand}
        </div>
        <Link href={`/gear/${gear.id}`}>
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {gear.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {gear.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-auto">
        <div className="text-sm font-semibold">
          <span className="text-base text-primary">${price}</span>
          <span className="text-xs text-muted-foreground font-normal"> / day</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Stock: <span className="font-medium text-foreground">{gear.stock}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
