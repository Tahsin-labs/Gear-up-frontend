"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvailabilityDateFilter } from "@/components/gear/AvailabilityDateFilter";
import { Search, RotateCcw } from "lucide-react";

export function GearFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "ALL");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const { data: categoryData } = useCategories();
  const categories = categoryData?.data || [];

  // Sync state when URL params change
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategoryId(searchParams.get("categoryId") || "ALL");
    setBrand(searchParams.get("brand") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  // Debounced search sync to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentParam = searchParams.get("search") || "";
      if (search !== currentParam) {
        applyFilters({ search });
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  const applyFilters = (overrides: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // reset to page 1 on filter changes

    const updated = {
      search,
      categoryId: categoryId === "ALL" ? "" : categoryId,
      brand,
      minPrice,
      maxPrice,
      ...overrides,
    };

    Object.entries(updated).forEach(([k, v]) => {
      if (v && v.trim()) {
        params.set(k, v.trim());
      } else {
        params.delete(k);
      }
    });

    router.push(`/gear?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setCategoryId("ALL");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/gear");
  };

  return (
    <div className="p-5 rounded-2xl border bg-card/60 space-y-5">
      <div className="flex items-center justify-between pb-2 border-b">
        <h3 className="font-semibold text-base">Filter Equipment</h3>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-muted-foreground">
          <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
        </Button>
      </div>

      {/* Search */}
      <div className="space-y-1.5">
        <Label htmlFor="search" className="text-xs font-medium">Search Keyword</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search title, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Category</Label>
        <Select
          value={categoryId}
          onValueChange={(val) => {
            const cleanVal = val || "ALL";
            setCategoryId(cleanVal);
            applyFilters({ categoryId: cleanVal === "ALL" ? "" : cleanVal });
          }}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="space-y-1.5">
        <Label htmlFor="brand" className="text-xs font-medium">Brand</Label>
        <Input
          id="brand"
          placeholder="e.g. Sony, Canon, DJI..."
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          className="h-9 text-sm"
        />
      </div>

      {/* Date Filter */}
      <AvailabilityDateFilter />

      {/* Price Range */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Price per day ($)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="h-9 text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <Button onClick={() => applyFilters()} className="w-full h-9 text-sm">
        Apply Filters
      </Button>
    </div>
  );
}
