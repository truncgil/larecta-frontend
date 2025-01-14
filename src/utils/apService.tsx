// utils/apiService.js
import CustomStore from 'devextreme/data/custom_store';
const apiRequest = async (url: string, method: string, data: any = null) => {
    const currentToken = localStorage.getItem('token');
    
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
  
    const response = await fetch(url, options);
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
        const response = await apiRequest(`${API_URL}/admin/${resource}`, 'GET');
        return dataField ? response[dataField] : response;
      },
      update: (key, values) =>
        values ? apiRequest(`${API_URL}/admin/${resource}/${key}`, 'PUT', values) : Promise.reject('Güncellenecek veri bulunamadı'),
      remove: (key) => apiRequest(`${API_URL}/admin/${resource}/${key}`, 'DELETE'),
      insert: (values) => apiRequest(`${API_URL}/admin/${resource}`, 'POST', values),
    }),
  });
  