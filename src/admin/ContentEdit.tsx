import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import { loadContent, updateContent, type Content, createLookupStore } from '../utils/apService';
import SelectBox from 'devextreme-react/select-box';


const ContentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  const typeStore = createLookupStore('types', 'name', 'slug');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (id) {
          let data = await loadContent(id);
          setContent(data.content);
        }
      } catch (error) {
        console.error('İçerik yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  const handleSave = async () => {
    try {
      if (id && content) {
        await updateContent(id, content);
        navigate('/admin/contents');
      }
    } catch (error) {
      console.error('İçerik kaydedilirken hata oluştu:', error);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <Breadcrumb pageName="İçerik Düzenle" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={content?.title || ''}
            onChange={(e) => setContent(content ? { ...content, title: e.target.value } : null)}
            className="w-full rounded border border-stroke p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            type="text"
            value={content?.slug || ''}
            onChange={(e) => setContent(content ? { ...content, slug: e.target.value } : null)}
            className="w-full rounded border border-stroke p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tür</label>
          <SelectBox
            dataSource={typeStore.dataSource}
            displayExpr={typeStore.displayExpr}
            valueExpr={typeStore.valueExpr}
            value={content?.type}
            onValueChanged={(e) => setContent(content ? { ...content, type: e.value } : null)}
            className="w-full rounded border border-stroke p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Durum</label>
          <select
            value={content?.status || 'draft'}
            onChange={(e) => setContent(content ? { ...content, status: e.target.value } : null)}
            className="w-full rounded border border-stroke p-2"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayınlandı</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Content</label>
          <ReactQuill
            theme="snow"
            value={content?.content || ''}
            onChange={(value) => setContent(content ? { ...content, content: value } : null)}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
              ],
            }}
            style={{ height: '300px', marginBottom: '50px' }}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate('/admin/contents')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kaydet
          </button>
        </div>
      </div>
    </>
  );
};

export default ContentEdit; 