"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserFormModal, { UserFormValues } from "../modals/user-form-modal";
import api from "@/helpers/axios";

export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🟩 GET users with pagination
  const loadUsers = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;

      const res = await api.get(`${process.env.NEXT_PUBLIC_URL}/users/user/`, {
        params: { limit, offset },
      });

      setUsers(res.data.results);
      if (res.data.count) {
        setTotalPages(Math.ceil(res.data.count / limit));
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  // 🟦 CREATE user
  const handleCreate = async (data: UserFormValues) => {
    try {
      await api.post(`${process.env.NEXT_PUBLIC_URL}/users/user/`, data);
      setPage(1);
      await loadUsers();
    } catch (err) {
      console.error("Failed to create user", err);
    }
  };

  // 🟧 UPDATE user
  const handleUpdate = async (data: UserFormValues) => {
    if (!editUser) return;
    try {
      await api.patch(
        `${process.env.NEXT_PUBLIC_URL}/users/user/${editUser.id}/`,
        data
      );
      await loadUsers();
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  // 🟥 DELETE user
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${process.env.NEXT_PUBLIC_URL}/users/user/${id}/`);
      await loadUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">User Management</h1>
        <Button onClick={() => setModalOpen(true)}>+ Add User</Button>
      </div>

      {/* Shadcn Table */}
      <div className="border rounded-lg">
        <Table>
          <TableCaption>A list of users in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.phone_number}</TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
                  <TableCell className="text-center">
                    {u.is_verified ? "✅" : "❌"}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditUser(u);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-4"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modal */}
      <UserFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditUser(null);
        }}
        onSubmit={editUser ? handleUpdate : handleCreate}
        initialData={editUser}
      />
    </div>
  );
}
