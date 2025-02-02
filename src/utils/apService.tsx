// utils/apiService.js
import CustomStore from 'devextreme/data/custom_store';

export const apiRequest = async (url: string, method: string, data: any = null) => {
    const currentToken = localStorage.getItem('token');
    const fullUrl = `${API_URL}${url}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      mode: 'cors',
      ...(data && { body: JSON.stringify(data) }),
    };
  
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  };
  
  export const createCustomStore = (resource: string, dataField?: string) => ({
    store: new CustomStore({
      key: 'id',
      load: async () => {
        const response = await apiRequest(`/admin/${resource}`, 'GET');
        return dataField ? response[dataField] : response;
      },
      update: (key, values) =>
        values ? apiRequest(`/admin/${resource}/${key}`, 'PUT', values) : Promise.reject('Güncellenecek veri bulunamadı'),
      remove: (key) => apiRequest(`/admin/${resource}/${key}`, 'DELETE'),
      insert: (values) => apiRequest(`/admin/${resource}`, 'POST', values),
    }),
  });
  export const createCustomStore2 = (resource: string, getResource: string) => ({
    store: new CustomStore({
      key: 'id',
      load: async () => {
        const response = await apiRequest(`/admin/${getResource}`, 'GET');
        return response;
      },
      update: (key, values) =>
        values ? apiRequest(`/admin/${resource}/${key}`, 'PUT', values) : Promise.reject('Güncellenecek veri bulunamadı'),
      remove: (key) => apiRequest(`/admin/${resource}/${key}`, 'DELETE'),
      insert: (values) => apiRequest(`/admin/${resource}`, 'POST', values),
    }),
  });

  export const createLookupStore = (resource: string, displayExpr: string = 'name', valueExpr: string = 'id') => {
    let cachedData: any[] = [];

    return {
      dataSource: {
        paginate: false,
        store: new CustomStore({
          key: valueExpr,
          load: async () => {
            const response = await apiRequest(`/admin/${resource}`, 'GET');
            cachedData = response; // Verileri cache'le
            return response;
          },
          byKey: (key) => {
            // Cache'den ilgili kaydı bul
            return Promise.resolve(cachedData.find(item => item.id === key));
          }
        })
      },
      displayExpr: displayExpr,
      valueExpr: valueExpr
    };
  };

// Content için tip tanımı

interface ContentResponse {
  content: Content;
}

export interface Content {
  id?: number;
  title: string;
  content: string;
  slug?: string;
  type?: string;
  status?: string;
  parent_id?: number;
  order?: number;
}

// Content yükleme fonksiyonu
export const loadContent = async (id: string | number): Promise<ContentResponse> => {
  try {
    const data = await apiRequest(`/admin/contents/${id}`, 'GET');
    return data;
  } catch (error) {
    console.error('İçerik yüklenirken hata:', error);
    throw error;
  }
};

export const loadData = async (type: string | number): Promise<ContentResponse> => {
  try {
    const data = await apiRequest(`/admin/${type}`, 'GET');
    return data;
  } catch (error) {
    console.error('İçerik yüklenirken hata:', error);
    throw error;
  }
};

// Content güncelleme fonksiyonu
export const updateContent = async (id: string | number, data: Content): Promise<Content> => {
  try {
    const updatedData = await apiRequest(`/admin/contents/${id}`, 'PUT', data);
    return updatedData;
  } catch (error) {
    console.error('İçerik güncellenirken hata:', error);
    throw error;
  }
};