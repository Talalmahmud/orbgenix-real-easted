"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Edit, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Agency {
  id: number;
  user: number;
  agency: number;
  license_number: string;
  experience_years: number;
  specializations: string[];
}

export default function AgencyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([
    {
      id: 1,
      user: 5,
      agency: 2,
      license_number: "AGT-123456",
      experience_years: 4,
      specializations: ["residential", "commercial", "luxury"],
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editAgency, setEditAgency] = useState<Agency | null>(null);
  const [form, setForm] = useState({
    user: "",
    agency: "",
    license_number: "",
    experience_years: "",
    specializations: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editAgency) {
      setAgencies([]);
    } else {
      setAgencies((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: Number(form.user),
          agency: Number(form.agency),
          license_number: form.license_number,
          experience_years: Number(form.experience_years),
          specializations: form.specializations.split(",").map((s) => s.trim()),
        },
      ]);
    }
    setOpen(false);
    setEditAgency(null);
    setForm({
      user: "",
      agency: "",
      license_number: "",
      experience_years: "",
      specializations: "",
    });
  };

  const handleDelete = (id: number) => {
    setAgencies((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (agency: Agency) => {
    setEditAgency(agency);
    setForm({
      user: String(agency.user),
      agency: String(agency.agency),
      license_number: agency.license_number,
      experience_years: String(agency.experience_years),
      specializations: agency.specializations.join(", "),
    });
    setOpen(true);
  };

  return (
    <div className="p-8 ">
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
                {editAgency ? "Edit Agency" : "Add New Agency"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label>User ID</Label>
                <Input name="user" value={form.user} onChange={handleChange} />
              </div>
              <div>
                <Label>Agency ID</Label>
                <Input
                  name="agency"
                  value={form.agency}
                  onChange={handleChange}
                />
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
                <Label>Experience (Years)</Label>
                <Input
                  name="experience_years"
                  type="number"
                  min="0"
                  value={form.experience_years}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Specializations (comma separated)</Label>
                <Input
                  name="specializations"
                  value={form.specializations}
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

      <div className="rounded-xl border">
        <Table className=" min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Specializations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agencies.map((agency) => (
              <TableRow key={agency.id}>
                <TableCell>{agency.id}</TableCell>
                <TableCell>{agency.user}</TableCell>
                <TableCell>{agency.agency}</TableCell>
                <TableCell>{agency.license_number}</TableCell>
                <TableCell>{agency.experience_years} yrs</TableCell>
                <TableCell className="space-x-1">
                  {agency.specializations.map((s, idx) => (
                    <Badge key={idx} variant="outline">
                      {s}
                    </Badge>
                  ))}
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
