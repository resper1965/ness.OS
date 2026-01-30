'use client';

import { useState, useEffect } from 'react';
import { SuperAdminGuard, ShowIf } from '@/components/auth/guards';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabase } from '@/lib/supabase/client';
import {
  UserProfile,
  UserPermission,
  SystemModule,
  PermissionAction,
  UserRole,
  MODULE_LABELS,
  ROLE_LABELS,
  ROLE_COLORS,
  ACTION_LABELS,
} from '@/types/auth';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Trash2,
  X,
  Check,
  Loader2,
} from 'lucide-react';

// Tipos locais
interface UserWithPermissions extends UserProfile {
  permissions: UserPermission[];
}

// Módulos disponíveis
const MODULES: SystemModule[] = ['fin', 'ops', 'growth', 'jur', 'gov', 'people', 'admin'];
const ACTIONS: PermissionAction[] = ['create', 'read', 'update', 'delete', 'export', 'approve'];

export default function UsersAdminPage() {
  return (
    <SuperAdminGuard>
      <UsersAdminContent />
    </SuperAdminGuard>
  );
}

function UsersAdminContent() {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(null);
  const [showModal, setShowModal] = useState(false);

  const supabase = getSupabase();

  // Carregar usuários
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Buscar perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('nome');

      if (profilesError) throw profilesError;

      // Buscar permissões
      const { data: permissions, error: permsError } = await supabase
        .from('user_permissions')
        .select('*');

      if (permsError) throw permsError;

      // Combinar dados
      const usersWithPerms = (profiles || []).map(profile => ({
        ...profile,
        permissions: (permissions || []).filter(p => p.user_id === profile.id),
      })) as UserWithPermissions[];

      setUsers(usersWithPerms);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Alternar status ativo
  const toggleActive = async (user: UserWithPermissions) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ativo: !user.ativo })
        .eq('id', user.id);

      if (error) throw error;

      setUsers(users.map(u => 
        u.id === user.id ? { ...u, ativo: !u.ativo } : u
      ));
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
    }
  };

  // Alterar role
  const changeRole = async (user: UserWithPermissions, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;

      setUsers(users.map(u => 
        u.id === user.id ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      console.error('Erro ao alterar role:', err);
    }
  };

  // Ícone da role
  const RoleIcon = ({ role }: { role: UserRole }) => {
    switch (role) {
      case 'superadmin':
        return <ShieldAlert className="h-4 w-4" />;
      case 'adm-area':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciar Usuários</h1>
          <p className="text-slate-500">Controle de acesso e permissões do sistema</p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Convidar Usuário
        </button>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          />
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-cyan-500" />
            <p className="mt-2 text-slate-500">Carregando usuários...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Módulos
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Último Acesso
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  {/* Usuário */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-medium">
                        {user.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.nome}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                      <RoleIcon role={user.role} />
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>

                  {/* Módulos */}
                  <td className="px-6 py-4">
                    {user.role === 'superadmin' ? (
                      <span className="text-sm text-slate-500">Todos os módulos</span>
                    ) : user.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map((perm) => (
                          <span
                            key={perm.id}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {MODULE_LABELS[perm.modulo]}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Nenhum módulo</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(user)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        user.ativo
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.ativo ? (
                        <>
                          <Check className="h-3 w-3" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" />
                          Inativo
                        </>
                      )}
                    </button>
                  </td>

                  {/* Último Acesso */}
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.ultimo_acesso
                      ? new Date(user.ultimo_acesso).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Nunca acessou'}
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-slate-300" />
            <p className="mt-2 text-slate-500">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSave={() => {
            loadUsers();
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// Modal de Edição de Usuário
// ============================================
interface UserModalProps {
  user: UserWithPermissions | null;
  onClose: () => void;
  onSave: () => void;
}

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    cargo: user?.cargo || '',
    role: user?.role || 'user-area' as UserRole,
  });
  const [permissions, setPermissions] = useState<Record<SystemModule, PermissionAction[]>>(
    user?.permissions.reduce((acc, perm) => ({
      ...acc,
      [perm.modulo]: perm.acoes,
    }), {} as Record<SystemModule, PermissionAction[]>) || {}
  );
  const [saving, setSaving] = useState(false);

  const supabase = getSupabase();

  // Toggle módulo
  const toggleModule = (module: SystemModule) => {
    if (permissions[module]) {
      const { [module]: _, ...rest } = permissions;
      setPermissions(rest);
    } else {
      setPermissions({ ...permissions, [module]: ['read'] });
    }
  };

  // Toggle ação
  const toggleAction = (module: SystemModule, action: PermissionAction) => {
    const current = permissions[module] || [];
    if (current.includes(action)) {
      setPermissions({
        ...permissions,
        [module]: current.filter(a => a !== action),
      });
    } else {
      setPermissions({
        ...permissions,
        [module]: [...current, action],
      });
    }
  };

  // Salvar
  const handleSave = async () => {
    setSaving(true);
    try {
      if (user) {
        // Atualizar perfil
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            nome: formData.nome,
            cargo: formData.cargo,
            role: formData.role,
          })
          .eq('id', user.id);

        if (profileError) throw profileError;

        // Deletar permissões antigas
        await supabase
          .from('user_permissions')
          .delete()
          .eq('user_id', user.id);

        // Inserir novas permissões
        const newPermissions = Object.entries(permissions)
          .filter(([_, actions]) => actions.length > 0)
          .map(([modulo, acoes]) => ({
            user_id: user.id,
            modulo: modulo as SystemModule,
            acoes,
          }));

        if (newPermissions.length > 0) {
          const { error: permsError } = await supabase
            .from('user_permissions')
            .insert(newPermissions);

          if (permsError) throw permsError;
        }
      }

      onSave();
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {user ? 'Editar Usuário' : 'Convidar Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Dados básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!user}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cargo
              </label>
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              >
                <option value="user-area">Usuário</option>
                <option value="adm-area">Administrador de Área</option>
                <option value="superadmin">Super Administrador</option>
              </select>
            </div>
          </div>

          {/* Permissões por módulo */}
          {formData.role !== 'superadmin' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Permissões por Módulo
              </label>
              <div className="space-y-3">
                {MODULES.map((module) => (
                  <div
                    key={module}
                    className={`border rounded-lg transition-colors ${
                      permissions[module] ? 'border-cyan-300 bg-cyan-50/50' : 'border-slate-200'
                    }`}
                  >
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer"
                      onClick={() => toggleModule(module)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!permissions[module]}
                          onChange={() => toggleModule(module)}
                          className="h-4 w-4 text-cyan-500 rounded border-slate-300 focus:ring-cyan-500"
                        />
                        <span className="font-medium text-slate-900">
                          {MODULE_LABELS[module]}
                        </span>
                      </div>
                    </div>

                    {permissions[module] && (
                      <div className="px-3 pb-3 pt-0">
                        <div className="flex flex-wrap gap-2">
                          {ACTIONS.map((action) => (
                            <button
                              key={action}
                              onClick={() => toggleAction(module, action)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                permissions[module]?.includes(action)
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {ACTION_LABELS[action]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.role === 'superadmin' && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-800 text-sm">
                <strong>Super Administrador</strong> tem acesso total a todos os módulos e funcionalidades do sistema.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {user ? 'Salvar Alterações' : 'Convidar'}
          </button>
        </div>
      </div>
    </div>
  );
}
