import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const RoleModal = ({ role, permissions, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions.map(p => p.id)
      });
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${window.API_URL}/roles${role ? `/${role.id}` : ''}`, {
        method: role ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('İşlem başarısız oldu');
      }

      Swal.fire('Başarılı', `Rol başarıyla ${role ? 'güncellendi' : 'oluşturuldu'}`, 'success');
      onSave();
      onClose();
    } catch (error) {
      Swal.fire('Hata', 'İşlem sırasında bir hata oluştu', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-boxdark">
        <h3 className="mb-4 text-xl font-semibold">
          {role ? 'Rolü Düzenle' : 'Yeni Rol Ekle'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              Rol Adı
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              İzinler
            </label>
            <div className="grid grid-cols-2 gap-4">
              {permissions.map(permission => (
                <label key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
                    onChange={(e) => {
                      const newPermissions = e.target.checked
                        ? [...formData.permissions, permission.id]
                        : formData.permissions.filter(id => id !== permission.id);
                      setFormData({ ...formData, permissions: newPermissions });
                    }}
                    className="mr-2"
                  />
                  {permission.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-stroke px-6 py-2 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded bg-primary px-6 py-2 text-white hover:bg-primary/90"
            >
              {role ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal; 