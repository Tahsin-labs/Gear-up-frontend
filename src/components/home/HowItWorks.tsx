import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, CalendarCheck, CreditCard, Sparkles, Shield, Clock, Award } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Discover Gear",
      description: "Search by brand, category, price, and availability dates for the equipment you need.",
      icon: Search,
    },
    {
      step: "02",
      title: "Book & Pay Securely",
      description: "Choose your dates and confirm reservations with secure SSLCommerz payment gateway.",
      icon: CalendarCheck,
    },
    {
      step: "03",
      title: "Create & Return",
      description: "Pick up the gear, shoot your masterpiece or hike the trail, then return it hassle-free.",
      icon: CreditCard,
    },
  ];

  const benefits = [
    {
      title: "Verified Community",
      desc: "Every provider and customer identity is reviewed for maximum trust.",
      icon: Shield,
    },
    {
      title: "Flexible Durations",
      desc: "Rent by the day or week without being locked into expensive purchase costs.",
      icon: Clock,
    },
    {
      title: "Quality Inspected",
      desc: "Detailed specifications, real photos, and customer feedback for every listing.",
      icon: Award,
    },
  ];

  return (
    <div className="space-y-24 py-16">
      {/* How It Works */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Simple & Transparent
          </div>
          <h2 className="text-3xl font-bold tracking-tight">How GearUp Works</h2>
          <p className="text-muted-foreground text-sm">Rent or list in three easy steps without complications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="p-8 rounded-2xl border bg-card/60 relative space-y-4">
                <span className="text-5xl font-black text-muted/30 absolute right-6 top-6">{item.step}</span>
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4">
        <div className="p-8 md:p-12 rounded-3xl border bg-muted/40">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">Why Choose GearUp?</h2>
            <p className="text-sm text-muted-foreground">The premier platform built specifically for gear creators and outdoor explorers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="flex gap-4 p-5 rounded-xl bg-background border">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">{b.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4">
        <div className="p-10 md:p-16 rounded-3xl bg-primary text-primary-foreground text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to gear up for your next production or expedition?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto text-sm md:text-base">
            Join thousands of creators, filmmakers, and campers sharing and renting gear across the country.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/gear" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "font-semibold")}>
              Browse All Listings
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10")}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
