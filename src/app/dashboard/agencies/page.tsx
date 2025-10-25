"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/helpers/axios";
import { toast } from "sonner";

interface Agency {
  id?: number;
  user: number;
  name: string;
  license_number: string;
  address: string;
  phone: string;
  website: string;
}

interface User {
  id: number;
  username: string;
}

export default function AgencyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Agency>({
    user: 0,
    name: "",
    license_number: "",
    address: "",
    phone: "",
    website: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch agencies
  const fetchAgencies = async () => {
    try {
      const { data } = await api.get("/agency/agencies");
      setAgencies(data.results);
    } catch {
      toast("Failed to fetch agencies");
    }
  };

  // Fetch users for dropdown
  const fetchUsers = async (role: number) => {
    try {
      const { data } = await api.get("/users/user/?role=" + role);
      setUsers(data.results);
    } catch {
      toast("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleChange = (field: keyof Agency, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.user) {
      toast("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await api.put(`/agency/agencies/${editId}`, formData);
        toast("Agency updated successfully");
      } else {
        await api.post("/agency/agencies", formData);
        toast("Agency created successfully");
      }
      setOpen(false);
      setFormData({
        user: 0,
        name: "",
        license_number: "",
        address: "",
        phone: "",
        website: "",
      });
      setEditId(null);
      fetchAgencies();
    } catch {
      toast("Failed to save agency");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (agency: Agency) => {
    setFormData(agency);
    setEditId(agency.id!);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this agency?")) return;
    try {
      await api.delete(`/agency/agencies/${id}`);
      toast("Agency deleted");
      fetchAgencies();
    } catch {
      toast("Failed to delete agency");
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Agencies</CardTitle>
            <CardDescription>Manage real estate agencies</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Agency</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editId ? "Edit Agency" : "Add Agency"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className=" flex items-center gap-2">
                  {" "}
                  <div>
                    <Label>Role</Label>
                    <Select
                      onValueChange={(value) => {
                        fetchUsers(Number(value));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Admin</SelectItem>
                        <SelectItem value="1">Buyer</SelectItem>
                        <SelectItem value="2">Seller</SelectItem>
                        <SelectItem value="3">Agent</SelectItem>
                        <SelectItem value="4">Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>User</Label>
                    <Select
                      value={formData.user ? formData.user.toString() : ""}
                      onValueChange={(value) =>
                        handleChange("user", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id.toString()}>
                            {u?.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Agency Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Sunrise Realty"
                  />
                </div>
                <div>
                  <Label>License Number</Label>
                  <Input
                    value={formData.license_number}
                    onChange={(e) =>
                      handleChange("license_number", e.target.value)
                    }
                    placeholder="AGY-123456"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="123 Main Street, Dhaka"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+8801712345678"
                  />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="https://www.sunriserealty.com"
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Saving..." : editId ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Agency Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencies.length > 0 ? (
                agencies.map((agency, i) => (
                  <TableRow key={agency.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      {}
                    </TableCell>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.phone}</TableCell>
                    <TableCell>{agency.website}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(agency)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(agency.id!)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No agencies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
