"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/endpoints";
import { toast } from "sonner";

export function usePayNow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      return await api.payments.create(orderId);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["rentals"] });

      const url = res.data?.checkoutUrl || res.data?.gatewayUrl;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Gateway URL not provided by the payment service");
      }
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message || "Failed to initiate payment. Please try again.");
    },
  });
}
