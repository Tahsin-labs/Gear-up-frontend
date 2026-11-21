"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gearFormSchema, GearFormData } from "@/lib/validations/gear";
import { useCategories } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface GearFormProps {
  initialData?: Partial<GearFormData>;
  onSubmit: (data: GearFormData) => Promise<void>;
  title: string;
  description: string;
  isSubmitting?: boolean;
}

export function GearForm({
  initialData,
  onSubmit,
  title,
  description,
  isSubmitting = false,
}: GearFormProps) {
  const router = useRouter();
  const { data: categoryData } = useCategories();
  const categories = categoryData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GearFormData>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      brand: initialData?.brand || "",
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || "",
      pricePerDay: initialData?.pricePerDay || 10,
      stock: initialData?.stock || 1,
      images: initialData?.images || [],
    },
  });

  return (
    <Card className="max-w-3xl mx-auto shadow-md border-muted">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Images Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Equipment Photos</Label>
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  maxFiles={4}
                />
              )}
            />
            {errors.images && (
              <p className="text-xs font-medium text-destructive">{errors.images.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title / Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">Equipment Name</Label>
              <Input id="name" placeholder="Sony FX3 Cinema Camera" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <Label htmlFor="brand" className="text-xs font-semibold">Brand / Manufacturer</Label>
              <Input id="brand" placeholder="Sony, Canon, Blackmagic..." {...register("brand")} />
              {errors.brand && (
                <p className="text-xs text-destructive">{errors.brand.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Category</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-xs text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">Description & Features</Label>
            <Textarea
              id="description"
              placeholder="Detail item condition, included accessories, batteries, lenses, etc."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Per Day */}
            <div className="space-y-1.5">
              <Label htmlFor="pricePerDay" className="text-xs font-semibold">Daily Rate ($)</Label>
              <Input
                id="pricePerDay"
                type="number"
                step="0.01"
                placeholder="45"
                {...register("pricePerDay", { valueAsNumber: true })}
              />
              {errors.pricePerDay && (
                <p className="text-xs text-destructive">{errors.pricePerDay.message}</p>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <Label htmlFor="stock" className="text-xs font-semibold">Units Available</Label>
              <Input
                id="stock"
                type="number"
                placeholder="1"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="text-xs text-destructive">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/provider")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Save Equipment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
