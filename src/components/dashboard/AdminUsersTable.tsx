"use client";

import { useState } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { useUpdateUserStatus } from "@/hooks";

interface AdminUsersTableProps {
  users: User[];
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const statusMutation = useUpdateUserStatus();

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  const handleToggleStatus = async () => {
    if (!targetUser) return;
    const nextStatus = targetUser.activeStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    await statusMutation.mutateAsync({
      id: targetUser.id,
      status: nextStatus,
    });
    setTargetUser(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} accounts
        </span>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
                  No accounts match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-semibold text-sm">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-semibold uppercase">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.activeStatus === "ACTIVE" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {user.activeStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role !== "ADMIN" && (
                      <Button
                        size="sm"
                        variant={user.activeStatus === "ACTIVE" ? "outline" : "default"}
                        onClick={() => setTargetUser(user)}
                        className={`h-8 text-xs ${
                          user.activeStatus === "ACTIVE"
                            ? "text-destructive hover:bg-destructive/10"
                            : ""
                        }`}
                      >
                        {user.activeStatus === "ACTIVE" ? (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5 mr-1" /> Suspend
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Activate
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirm Suspend/Activate Modal */}
      <Dialog open={Boolean(targetUser)} onOpenChange={(open) => !open && setTargetUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {targetUser?.activeStatus === "ACTIVE" ? "Suspend Account" : "Activate Account"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {targetUser?.activeStatus === "ACTIVE" ? "block" : "unblock"}{" "}
              <span className="font-semibold text-foreground">{targetUser?.name}</span> ({targetUser?.email})?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTargetUser(null)} disabled={statusMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant={targetUser?.activeStatus === "ACTIVE" ? "destructive" : "default"}
              onClick={handleToggleStatus}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
