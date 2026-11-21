"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GearItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { Edit2, Trash2, Loader2, Plus } from "lucide-react";
import { useDeleteGear, useUpdateGear } from "@/hooks";

interface InventoryTableProps {
  gearItems: GearItem[];
}

export function ProviderInventoryTable({ gearItems }: InventoryTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<GearItem | null>(null);
  const deleteMutation = useDeleteGear();
  const updateMutation = useUpdateGear();

  const handleToggleAvailability = (gear: GearItem) => {
    updateMutation.mutate({
      id: gear.id,
      payload: {
        // Toggle availability through stock/isAvailable update
        stock: gear.stock > 0 ? 0 : 1,
      },
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (gearItems.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed rounded-xl space-y-3">
        <p className="text-sm text-muted-foreground">You haven&apos;t listed any gear items yet.</p>
        <Button asChild size="sm">
          <Link href="/dashboard/provider/new">
            <Plus className="h-4 w-4 mr-1" /> List Your First Gear
          </Link>
        </Button>
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
              <TableHead>Price/Day</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gearItems.map((gear) => (
              <TableRow key={gear.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={gear.imageUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"}
                        alt={gear.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/gear/${gear.id}`} className="font-semibold text-sm hover:underline line-clamp-1">
                        {gear.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{gear.brand}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {gear.category?.name || "General"}
                </TableCell>
                <TableCell className="font-semibold text-sm">
                  ${gear.pricePerDay}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {gear.stock}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={gear.isAvailable && gear.stock > 0}
                    onCheckedChange={() => handleToggleAvailability(gear)}
                    disabled={updateMutation.isPending}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button asChild size="icon-sm" variant="ghost">
                    <Link href={`/dashboard/provider/edit/${gear.id}`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setDeleteTarget(gear)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Equipment Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? This item will no longer appear for rentals.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
