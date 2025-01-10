import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from '../../components/DataTable';
import RoleModal from './RoleModal';

interface Permission {
  id: number;
  name: string;
}

const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch(`${API_URL}/roles`).then(res => res.json()),
        fetch(`${API_URL}/permissions`).then(res => res.json())
      ]);
      setRoles(rolesRes.data);
      setPermissions(permissionsRes.data);
    } catch (error) {
      Swal.fire('Hata', 'Veriler yüklenirken bir hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { header: 'Rol Adı', accessor: 'name' },
    { header: 'Açıklama', accessor: 'description' },
    { header: 'İzinler', accessor: 'permissions',
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.permissions.map((perm: Permission) => (
            <span key={perm.id} className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
              {perm.name}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'İşlemler',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-primary hover:text-primary/80"
          >
            Düzenle
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-danger hover:text-danger/80"
          >
            Sil
          </button>
        </div>
      )
    }
  ];

  const handleEdit = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu rol kalıcı olarak silinecektir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${window.API_URL}/roles/${id}`);
        await fetchData();
        Swal.fire('Başarılı', 'Rol başarıyla silindi', 'success');
      } catch (error) {
        Swal.fire('Hata', 'Rol silinirken bir hata oluştu', 'error');
      }
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">Rol ve İzin Yönetimi</h2>
        <button
          onClick={() => {
            setSelectedRole(null);
            setShowModal(true);
          }}
          className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Yeni Rol Ekle
        </button>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        loading={loading}
        pagination
        sorting
        searchable
      />

      {showModal && (
        <RoleModal
          role={selectedRole}
          permissions={permissions}
          onClose={() => setShowModal(false)}
          onSave={fetchData}
        />
      )}
    </div>
  );
};

export default RolePermissions; 