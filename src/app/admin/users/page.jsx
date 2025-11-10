"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react"

export default function AdminPanel() {
    const { data: session } = useSession();
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState("ALL")
    const [updateState, setUpdateState] = useState({
        userId: null,
        loading: false,
        success: false,
        error: null,
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        let filtered = users

        if (searchQuery) {
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        if (roleFilter !== "ALL") {
            filtered = filtered.filter((user) => user.role === roleFilter)
        }

        setFilteredUsers(filtered)
    }, [users, searchQuery, roleFilter])

    async function fetchUsers() {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/api/protected/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }

            const result = await response.json()
            setUsers(result.data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
            console.error("[v0] Fetch users error:", err)
        } finally {
            setLoading(false)
        }
    }

    async function updateUserRole(userId, newRole) {
        try {
            setUpdateState({ userId, loading: true, success: false, error: null })

            const response = await fetch(`/api/protected/users/update/${userId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role: newRole }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to update user role")
            }

            setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
            setUpdateState({ userId, loading: false, success: true, error: null })

            setTimeout(() => {
                setUpdateState({ userId: null, loading: false, success: false, error: null })
            }, 2000)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred"
            setUpdateState({ userId, loading: false, success: false, error: errorMessage })
            setTimeout(() => {
                setUpdateState({ userId: null, loading: false, success: false, error: null })
            }, 3000)
        }
    }

    async function deleteUser(userId) {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            setUpdateState({ userId, loading: true, success: false, error: null })

            const response = await fetch("/api/protected/users/delete", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to delete user")
            }

            setUsers(users.filter((user) => user.id !== userId))
            setUpdateState({ userId, loading: false, success: true, error: null })
            setTimeout(() => setUpdateState({ userId: null, loading: false, success: false, error: null }), 2000)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred"
            setUpdateState({ userId, loading: false, success: false, error: errorMessage })
            setTimeout(() => setUpdateState({ userId: null, loading: false, success: false, error: null }), 3000)
        }
    }

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case "ADMIN": return "default"
            case "DOCTOR": return "secondary"
            default: return "outline"
        }
    }

    return (
        <main className="min-h-screen bg-background p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Admin Panel</h1>
                    <p className="text-muted-foreground">Manage users and their roles</p>
                </div>

                {/* Filters Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Search by name or email</label>
                                <Input
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Filter by role</label>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Roles</SelectItem>
                                        <SelectItem value="USER">User</SelectItem>
                                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Showing {filteredUsers.length} of {users.length} users
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Users</CardTitle>
                        <Button onClick={fetchUsers} variant="outline" size="sm" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Refresh"}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {error && <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">{error}</div>}
                        {loading && !users.length ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">No users found</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Verified</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell className="text-sm">{user.email}</TableCell>
                                                <TableCell><Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge></TableCell>
                                                <TableCell className="text-sm">{user.emailVerified ? <span className="text-green-600">✓ Verified</span> : <span className="text-muted-foreground">Pending</span>}</TableCell>
                                                <TableCell className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Select
                                                            value={user.role}
                                                            onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                                                            disabled={updateState.loading && updateState.userId === user.id}
                                                        >
                                                            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="USER">User</SelectItem>
                                                                <SelectItem value="DOCTOR">Doctor</SelectItem>
                                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => deleteUser(user.id)}
                                                            disabled={updateState.loading && updateState.userId === user.id}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>

                                                        {updateState.userId === user.id && (
                                                            <>
                                                                {updateState.loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                                                {updateState.success && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                                                {updateState.error && <AlertCircle className="w-4 h-4 text-destructive" />}
                                                            </>
                                                        )}
                                                    </div>
                                                    {updateState.userId === user.id && updateState.error && (
                                                        <p className="text-xs text-destructive mt-1">{updateState.error}</p>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
