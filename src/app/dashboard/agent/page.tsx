"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";

import { Agency } from "@/types/agency";

export default function AgencyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([
    {
      id: 1,
      user: 3,
      name: "Sunrise Realty",
      license_number: "AGY-123456",
      address: "123 Main Street, Dhaka, Bangladesh",
      phone: "+8801712345678",
      website: "https://www.sunriserealty.com",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editAgency, setEditAgency] = useState<Agency | null>(null);
  const [form, setForm] = useState({
    user: "",
    name: "",
    license_number: "",
    address: "",
    phone: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editAgency) {
      setAgencies((prev) =>
        
        prev.map((a) =>
          a.id === editAgency.id
            ? { ...a, ...form, user: Number(form.user) }
            : a
        )
      );
    } else {
      setAgencies((prev) => [
        ...prev,
        { id: Date.now(), ...form, user: Number(form.user) },
      ]);
    }

    setOpen(false);
    setEditAgency(null);
    setForm({
      user: "",
      name: "",
      license_number: "",
      address: "",
      phone: "",
      website: "",
    });
  };

  const handleEdit = (agency: Agency) => {
    setEditAgency(agency);
    setForm({
      user: String(agency.user),
      name: agency.name,
      license_number: agency.license_number,
      address: agency.address,
      phone: agency.phone,
      website: agency.website,
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setAgencies((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Agency Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditAgency(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Agency
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editAgency ? "Edit Agency" : "Add Agency"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div>
                <Label>User ID</Label>
                <Input name="user" value={form.user} onChange={handleChange} />
              </div>
              <div>
                <Label>Agency Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <Label>License Number</Label>
                <Input
                  name="license_number"
                  value={form.license_number}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>
              <Button className="w-full mt-2" onClick={handleSubmit}>
                {editAgency ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agencies.map((agency) => (
              <TableRow key={agency.id}>
                <TableCell>{agency.id}</TableCell>
                <TableCell>{agency.user}</TableCell>
                <TableCell>{agency.name}</TableCell>
                <TableCell>{agency.license_number}</TableCell>
                <TableCell>{agency.address}</TableCell>
                <TableCell>{agency.phone}</TableCell>
                <TableCell>
                  <a
                    href={agency.website}
                    target="_blank"
                    className="text-indigo-600 hover:underline"
                  >
                    {agency.website}
                  </a>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(agency)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(agency.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
