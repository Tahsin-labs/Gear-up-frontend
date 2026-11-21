"use client";

import { useState } from "react";
import { Rental } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Loader2 } from "lucide-react";
import { api } from "@/lib/api/endpoints";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewModalProps {
  rental: Rental;
  onClose: () => void;
}

export function ReviewModal({ rental, onClose }: ReviewModalProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please provide a short feedback comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.reviews.create({
        rentalId: rental.id,
        rating,
        comment: comment.trim(),
      });
      toast.success("Thank you for reviewing your rental experience!");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      onClose();
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your feedback for <span className="font-semibold text-foreground">{rental.gear?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2 text-center">
              <Label className="text-xs font-semibold">Your Rating</Label>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment" className="text-xs font-semibold">
                Your Feedback
              </Label>
              <Textarea
                id="comment"
                placeholder="How was the equipment condition and provider communication?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
