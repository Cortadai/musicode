import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import type { UserInfo } from '../types';
import { UserPlus, Trash2, Shield, Headphones } from 'lucide-react';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'LISTENER'>('LISTENER');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<UserInfo[]>('/users');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/users', {
        username: newUsername,
        password: newPassword,
        role: newRole,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setNewUsername('');
      setNewPassword('');
      setNewRole('LISTENER');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (newUsername.trim() && newPassword.trim()) {
      createMutation.mutate();
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">User Management</h2>

      {/* User list */}
      <section className="mb-8">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Users</h3>

        {isLoading ? (
          <p className="text-zinc-500 text-sm">Loading…</p>
        ) : users && users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-4 py-3 bg-zinc-900 rounded-lg">
                {user.role === 'ADMIN' ? (
                  <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <Headphones className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
                <span className="text-sm text-zinc-200 flex-1">{user.username}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.role === 'ADMIN'
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {user.role}
                </span>
                {!user.enabled && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                    disabled
                  </span>
                )}
                <button
                  onClick={() => deleteMutation.mutate(user.id)}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-sm">No users found.</p>
        )}
        {deleteMutation.isError && (
          <p className="text-red-400 text-sm mt-2">
            {(deleteMutation.error as any)?.response?.data?.error || 'Failed to delete user'}
          </p>
        )}
      </section>

      {/* Create user form */}
      <section>
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Add User</h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'LISTENER')}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
          >
            <option value="LISTENER">Listener</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" /> Create User
          </button>
          {createMutation.isError && (
            <p className="text-red-400 text-sm">
              {(createMutation.error as any)?.response?.data?.error || 'Failed to create user'}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
