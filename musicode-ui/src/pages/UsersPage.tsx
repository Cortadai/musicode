import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import type { UserInfo } from '../types';
import { getErrorMessage } from '../utils/errors';
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
        <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Users</h3>

        {isLoading ? (
          <p className="text-sm" style={{ color: 'var(--mc-text-muted)' }}>Loading…</p>
        ) : users && users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
                {user.role === 'ADMIN' ? (
                  <Shield className="w-4 h-4 shrink-0" style={{ color: 'var(--mc-accent-primary)' }} />
                ) : (
                  <Headphones className="w-4 h-4 shrink-0" style={{ color: 'var(--mc-text-muted)' }} />
                )}
                <span className="text-sm flex-1" style={{ color: 'var(--mc-text-primary)' }}>{user.username}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.role === 'ADMIN' ? 'mc-badge' : 'mc-badge-muted'
                }`}>
                  {user.role}
                </span>
                {!user.enabled && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(248,113,113,0.2)', color: 'var(--mc-text-error)' }}>
                    disabled
                  </span>
                )}
                <button
                  onClick={() => deleteMutation.mutate(user.id)}
                  className="mc-interactive-danger transition-colors"
                  title="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--mc-text-muted)' }}>No users found.</p>
        )}
        {deleteMutation.isError && (
          <p className="text-sm mt-2" style={{ color: 'var(--mc-text-error)' }}>
            {getErrorMessage(deleteMutation.error, 'Failed to delete user')}
          </p>
        )}
      </section>

      {/* Create user form */}
      <section>
        <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Add User</h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full border rounded-lg px-4 py-2 text-sm mc-input focus:outline-none"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full border rounded-lg px-4 py-2 text-sm mc-input focus:outline-none"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'LISTENER')}
            className="w-full border rounded-lg px-4 py-2 text-sm mc-input focus:outline-none"
          >
            <option value="LISTENER">Listener</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 mc-btn-primary text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" /> Create User
          </button>
          {createMutation.isError && (
            <p className="text-sm" style={{ color: 'var(--mc-text-error)' }}>
              {getErrorMessage(createMutation.error, 'Failed to create user')}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
