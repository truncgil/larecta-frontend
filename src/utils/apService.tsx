import CustomStore from 'devextreme/data/custom_store';
const token = localStorage.getItem('token');
// utils/apiService.js
const apiRequest = async (url: string, method: string, data: any = null) => {
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      mode: 'cors',
      ...(data && { body: JSON.stringify(data) }),
    };
  
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  };
  
  export const createCustomStore = (resource: string) => ({
    store: new CustomStore({
      key: 'id',
      load: () => apiRequest(`${API_URL}/admin/${resource}`, 'GET'),
      update: (key, values) =>
        values ? apiRequest(`${API_URL}/admin/${resource}/${key}`, 'PUT', values) : Promise.reject('Güncellenecek veri bulunamadı'),
      remove: (key) => apiRequest(`${API_URL}/admin/${resource}/${key}`, 'DELETE'),
      insert: (values) => apiRequest(`${API_URL}/admin/${resource}`, 'POST', values),
    }),
  });
  