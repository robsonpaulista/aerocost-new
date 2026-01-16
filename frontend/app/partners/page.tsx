'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users, Mail, Phone, Palette } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import AppLayout from '@/components/AppLayout';
import { partnerApi, type Partner } from '@/lib/api';

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    color: '#3B82F6',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await partnerApi.list();
      setPartners(data);
    } catch (error) {
      console.error('Erro ao carregar sócios:', error);
      alert('Erro ao carregar sócios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        email: partner.email || '',
        phone: partner.phone || '',
        color: partner.color,
        is_active: partner.is_active,
      });
    } else {
      setEditingPartner(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        color: '#3B82F6',
        is_active: true,
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (editingPartner) {
        await partnerApi.update(editingPartner.id!, {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          color: formData.color,
          is_active: formData.is_active,
        });
      } else {
        await partnerApi.create({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          color: formData.color,
          is_active: formData.is_active,
        });
      }
      await loadPartners();
      setShowModal(false);
    } catch (error: any) {
      console.error('Erro ao salvar sócio:', error);
      if (error.response?.data?.details) {
        const fieldErrors: Record<string, string> = {};
        error.response.data.details.forEach((detail: any) => {
          fieldErrors[detail.path[0]] = detail.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: error.response?.data?.error || 'Erro ao salvar sócio' });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar este sócio?')) return;

    try {
      await partnerApi.delete(id);
      await loadPartners();
    } catch (error: any) {
      console.error('Erro ao desativar sócio:', error);
      alert('Erro ao desativar sócio: ' + (error.response?.data?.error || error.message));
    }
  };

  const predefinedColors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Amarelo', value: '#F59E0B' },
    { name: 'Vermelho', value: '#EF4444' },
    { name: 'Roxo', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Ciano', value: '#06B6D4' },
    { name: 'Laranja', value: '#F97316' },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-text-light">Carregando sócios...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Gerenciar Sócios</h1>
          <p className="text-sm text-text-light mt-1">Cadastre e gerencie os sócios da aeronave</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          icon={<Plus className="w-4 h-4" />}
        >
          Novo Sócio
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-semibold text-text mb-4">
              {editingPartner ? 'Editar Sócio' : 'Novo Sócio'}
            </h2>

            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome do Sócio"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
              />

              <Input
                label="Email (Opcional)"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />

              <Input
                label="Telefone (Opcional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
              />

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Cor de Identificação
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="is_active" className="text-sm text-text">
                  Sócio ativo
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  {editingPartner ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Card>
        {partners.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-text-light mx-auto mb-4" />
            <h3 className="text-base font-semibold text-text mb-2">Nenhum sócio cadastrado</h3>
            <p className="text-text-light mb-6">
              Cadastre os sócios para gerenciar os voos no calendário.
            </p>
            <Button onClick={() => handleOpenModal()} icon={<Plus className="w-4 h-4" />}>
              Cadastrar Primeiro Sócio
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-text">Cor</th>
                  <th className="text-left py-3 px-4 font-semibold text-text">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-text">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-text">Telefone</th>
                  <th className="text-left py-3 px-4 font-semibold text-text">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-text">Ações</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div
                        className="w-8 h-8 rounded-lg border border-gray-300"
                        style={{ backgroundColor: partner.color }}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-text">{partner.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      {partner.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-text-light" />
                          <span className="text-text">{partner.email}</span>
                        </div>
                      ) : (
                        <span className="text-text-light">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {partner.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-text-light" />
                          <span className="text-text">{partner.phone}</span>
                        </div>
                      ) : (
                        <span className="text-text-light">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          partner.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {partner.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(partner)}
                          className="text-gray-600 hover:text-primary hover:bg-gray-50"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => partner.id && handleDelete(partner.id)}
                          icon={<Trash2 className="w-4 h-4" />}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Desativar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
