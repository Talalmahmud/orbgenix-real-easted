"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

import { z } from "zod";

export const userSchema = z.object({
  username: z.string("Invalid email"),
  phone_number: z.string().min(10, "Phone number is too short"),
  password: z.string().min(8, "Password too short"),
  role: z.number().min(1),
  is_verified: z.boolean(),
  profile: z.object({
    gender: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    postal_code: z.string(),
    website: z.string().url(),
    linkedin: z.string().url(),
    facebook: z.string().url(),
    twitter: z.string().url(),
    instagram: z.string().url(),
  }),
});

export type UserFormValues = z.infer<typeof userSchema>;


type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormValues) => Promise<void>;
  initialData?: UserFormValues | null;
};

export default function UserFormModal({ open, onClose, onSubmit, initialData }: Props) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      username: "",
      phone_number: "",
      password: "",
      role: 1,
      is_verified: false,
      profile: {
        gender: "",
        address: "",
        city: "",
        country: "",
        postal_code: "",
        website: "",
        linkedin: "",
        facebook: "",
        twitter: "",
        instagram: "",
      },
    },
  });

  const handleSubmit = async (values: UserFormValues) => {
    await onSubmit(values);
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (initialData) form.reset(initialData);
  }, [initialData, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Username (Email)</Label>
              <Input {...form.register("username")} />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input {...form.register("phone_number")} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" {...form.register("password")} />
            </div>
            <div>
              <Label>Role</Label>
              <Input type="number" {...form.register("role", { valueAsNumber: true })} />
            </div>
            <div className="flex items-center gap-2">
              <Label>Verified</Label>
              <Switch checked={form.watch("is_verified")} onCheckedChange={(v) => form.setValue("is_verified", v)} />
            </div>
          </div>

          <hr className="my-4" />
          <h3 className="font-semibold">Profile Info</h3>

          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Gender" {...form.register("profile.gender")} />
            <Input placeholder="Address" {...form.register("profile.address")} />
            <Input placeholder="City" {...form.register("profile.city")} />
            <Input placeholder="Country" {...form.register("profile.country")} />
            <Input placeholder="Postal Code" {...form.register("profile.postal_code")} />
            <Input placeholder="Website" {...form.register("profile.website")} />
            <Input placeholder="LinkedIn" {...form.register("profile.linkedin")} />
            <Input placeholder="Facebook" {...form.register("profile.facebook")} />
            <Input placeholder="Twitter" {...form.register("profile.twitter")} />
            <Input placeholder="Instagram" {...form.register("profile.instagram")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
