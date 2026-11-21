import { Review, User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ShieldCheck, User as UserIcon } from "lucide-react";
import { format } from "date-fns";

interface ProviderReviewsProps {
  provider?: {
    id: string;
    name: string;
    email?: string;
  };
  reviews?: Review[];
}

export function ProviderReviewsCard({ provider, reviews = [] }: ProviderReviewsProps) {
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "No ratings yet";

  return (
    <div className="space-y-6">
      {/* Provider Details Card */}
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Gear Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {provider?.name?.charAt(0).toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-base flex items-center gap-1.5">
                {provider?.name || "Verified Gear Owner"}
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </h4>
              <p className="text-xs text-muted-foreground">Community Provider • Verified Identity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card className="border-muted">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Customer Reviews</CardTitle>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{averageRating}</span>
            {reviews.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
              No reviews for this gear yet. Be the first to rent and share your thoughts!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="pb-4 border-b last:border-b-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs bg-muted">
                          {r.customer?.name?.charAt(0).toUpperCase() || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold">{r.customer?.name || "Customer"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.comment}</p>
                  {r.createdAt && (
                    <span className="text-[10px] text-muted-foreground/70 block">
                      {format(new Date(r.createdAt), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
