"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/gear?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/gear");
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-4 text-center bg-gradient-to-b from-primary/5 via-muted/40 to-background border-b">
      <div className="container mx-auto max-w-4xl space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Compass className="h-3.5 w-3.5" /> Peer-to-Peer Gear Sharing & Rental
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Rent High-End Outdoor & Tech Gear <br />
          <span className="text-primary">For Your Next Big Adventure</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Access cameras, drones, camping gear, studio equipment, and premium tools on demand. Rent locally from trusted creators and outdoor enthusiasts.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2 p-1.5 bg-background border rounded-xl shadow-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cameras, tents, audio, drones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" className="rounded-lg px-5">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/gear" className={cn(buttonVariants({ size: "lg" }))}>
            Explore All Gear <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
            Become a Provider
          </Link>
        </div>
      </div>
    </section>
  );
}
