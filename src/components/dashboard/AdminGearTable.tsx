"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GearItem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useDeleteGear } from "@/hooks";

interface AdminGearTableProps {
  gearItems: GearItem[];
}

export function AdminGearTable({ gearItems }: AdminGearTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<GearItem | null>(null);
  const deleteMutation = useDeleteGear();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (gearItems.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
        No gear currently listed on the platform.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gearItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.imageUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-sm line-clamp-1">{item.name}</div>
                      <span className="text-xs text-muted-foreground">{item.brand}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {item.category?.name || "General"}
                </TableCell>
                <TableCell className="text-xs font-medium">
                  {item.provider?.name || item.providerId?.slice(0, 8)}
                </TableCell>
                <TableCell className="font-semibold text-sm">
                  ${item.pricePerDay}
                </TableCell>
                <TableCell className="text-sm">
                  {item.stock}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button asChild size="icon-sm" variant="ghost">
                    <Link href={`/gear/${item.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setDeleteTarget(item)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate / Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? This action is immediate.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Remove Gear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
