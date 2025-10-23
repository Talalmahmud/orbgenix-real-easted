"use client";

import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select"; // if you have a multi-select, else replace with select
import api from "@/helpers/axios";

interface Agency {
  id: number;
  user: number;
  agency: number;
  license_number: string;
  experience_years: number;
  specializations: string[];
}

interface Specialization {
  id: number;
  name: string;
}

export default function AgencyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editAgency, setEditAgency] = useState<Agency | null>(null);
  const [form, setForm] = useState({
    user: "",
    agency: "",
    license_number: "",
    experience_years: "",
    specializations: [] as string[],
  });

  // ✅ Fetch all agencies
  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(
        process.env.NEXT_PUBLIC_URL + "/agency/agencies/"
      );
      setAgencies(data.results);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load agencies");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all specializations
  const fetchSpecializations = async () => {
    try {
      const { data } = await api.get(
        process.env.NEXT_PUBLIC_URL + "/agency/specializations/"
      );
      setSpecializations(data.results);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load specializations");
    }
  };

  useEffect(() => {
    fetchAgencies();
    fetchSpecializations();
  }, []);

  // ✅ Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Create or Update agency
  const handleSubmit = async () => {
    try {
      const payload = {
        user: Number(form.user),
        agency: Number(form.agency),
        license_number: form.license_number,
        experience_years: Number(form.experience_years),
        specializations: form.specializations,
      };

      if (editAgency) {
        await api.put(
          `${process.env.NEXT_PUBLIC_URL}/agency/agencies/${editAgency.id}`,
          payload
        );
        toast.success("Agency updated successfully");
      } else {
        await api.post(
          process.env.NEXT_PUBLIC_URL + "/agency/agencies/",
          payload
        );
        toast.success("Agency created successfully");
      }

      await fetchAgencies();
      setOpen(false);
      setEditAgency(null);
      setForm({
        user: "",
        agency: "",
        license_number: "",
        experience_years: "",
        specializations: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Error saving agency");
    }
  };

  // ✅ Delete agency
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this agency?")) return;
    try {
      await api.delete(`${process.env.NEXT_PUBLIC_URL}/agency/agencies/${id}`);
      toast.success("Agency deleted");
      await fetchAgencies();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting agency");
    }
  };

  // ✅ Edit mode
  const handleEdit = (agency: Agency) => {
    setEditAgency(agency);
    setForm({
      user: String(agency.user),
      agency: String(agency.agency),
      license_number: agency.license_number,
      experience_years: String(agency.experience_years),
      specializations: agency.specializations,
    });
    setOpen(true);
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
                {editAgency ? "Edit Agency" : "Add New Agency"}
              </DialogTitle>
            </DialogHeader>

            {/* Form */}
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

              {/* ✅ Multi-select for Specializations */}
              <div>
                <Label>Specializations</Label>
                <MultiSelect
                  options={specializations.map((s) => ({
                    label: s.name,
                    value: s.name,
                  }))}
                  value={form.specializations}
                  onValueChange={(values) =>
                    setForm({ ...form, specializations: values })
                  }
                  placeholder="Select specializations..."
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
      <div className="rounded-xl border">
        <Table className="min-w-[800px]">
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : agencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No agencies found
                </TableCell>
              </TableRow>
            ) : (
              agencies?.map((agency) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
