"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import { MultiSelect } from "@/components/ui/multi-select";
import api from "@/helpers/axios";

interface Agent {
  id?: number;
  user: number;
  license_number: string;
  experience_years: number;
  specializations: number[];
}

interface Option {
  label: string;
  value: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [specializations, setSpecializations] = useState<Option[]>([]);
  const [form, setForm] = useState<Agent>({
    user: 7,
    license_number: "",
    experience_years: 0,
    specializations: [],
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // ✅ Fetch all data
  useEffect(() => {
    fetchAgents();
    fetchSpecializations();
  }, []);

  const fetchAgents = async () => {
    const res = await api.get("/agency/agents/");
    setAgents(res.data.results || res.data);
  };

  const fetchSpecializations = async () => {
    const res = await api.get("/agency/specializations/");
    setSpecializations(
      res.data.results.map((sp: any) => ({
        label: sp.name,
        value: String(sp.id),
      }))
    );
  };

  // ✅ Handle Create/Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/agency/agents/${editingId}/`, form);
    } else {
      await api.post("/agency/agents/", form);
    }
    setForm({
      user: 7,
      license_number: "",
      experience_years: 0,
      specializations: [],
    });
    setEditingId(null);
    setOpen(false);
    fetchAgents();
  };

  // ✅ Handle Edit
  const handleEdit = (agent: Agent) => {
    setForm(agent);
    setEditingId(agent.id!);
    setOpen(true);
  };

  // ✅ Handle Delete
  const handleDelete = async (id: number) => {
    await api.delete(`/agency/agents/${id}/`);
    fetchAgents();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Agents</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setForm({
                  user: 7,
                  license_number: "",
                  experience_years: 0,
                  specializations: [],
                });
              }}
            >
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Agent" : "Add Agent"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>License Number</Label>
                <Input
                  value={form.license_number}
                  onChange={(e) =>
                    setForm({ ...form, license_number: e.target.value })
                  }
                  placeholder="AGT-123456"
                  required
                />
              </div>

              <div>
                <Label>Experience (years)</Label>
                <Input
                  type="number"
                  value={form.experience_years}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      experience_years: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label>Specializations</Label>
                <MultiSelect
                  options={specializations}
                  value={form.specializations.map(String)}
                  onValueChange={(vals) =>
                    setForm({
                      ...form,
                      specializations: vals.map(Number),
                    })
                  }
                  placeholder="Select specializations"
                />
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ✅ Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>License Number</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Specializations</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>{agent.id}</TableCell>
                    <TableCell>{agent.license_number}</TableCell>
                    <TableCell>{agent.experience_years} years</TableCell>
                    <TableCell>
                      {agent.specializations?.map((item: any) => (
                        <p key={item.value}>{item?.label}</p>
                      ))}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(agent)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(agent.id!)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No agents found.
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
