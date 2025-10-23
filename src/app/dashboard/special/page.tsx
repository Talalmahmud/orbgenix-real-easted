"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/helpers/axios";

// ✅ Mock API simulation (replace with your real API later)
type Category = {
  id: string;
  name: string;
  description: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditCategory(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast("Name is required");
      return;
    }

    if (editCategory) {
      handleEdit();
    } else {
      try {
        const res = await api.post(
          process.env.NEXT_PUBLIC_URL + "/agency/specializations/",
          { name: name, description: description }
        );
        const resData = await res.data;
        console.log(resData);
        toast("Seciality added successfully");

        getSpecialities();
        setOpen(false);
        resetForm();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const selectData = async (cat: Category) => {
    setOpen(true);

    setEditCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
  };

  const handleEdit = async () => {
    if (editCategory) {
      try {
        const res = await api.patch(
          process.env.NEXT_PUBLIC_URL +
            `/agency/specializations/${editCategory.id}/`,
          { name: name, description: description }
        );
        const resData = await res.data;
        toast("Seciality updated successfully");
        getSpecialities();

        setOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(
        process.env.NEXT_PUBLIC_URL + "/agency/specializations/" + { id } + "/"
      );
      const resData = await res.data;
      toast("Seciality deleted successfully");
      getSpecialities();
    } catch (error) {
      console.log(error);
    }
  };

  const getSpecialities = async () => {
    try {
      const res = await api.get(
        process.env.NEXT_PUBLIC_URL + "/agency/specializations/"
      );
      const resData = await res.data;
      console.log(resData);
      setCategories(resData.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSpecialities();
  }, []);

  return (
    <div className="p-8">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Agency Specialities</CardTitle>
          <Button onClick={() => setOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Speciality
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectData(cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-6 text-gray-500"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
