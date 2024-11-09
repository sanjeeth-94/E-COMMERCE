async function fetchProducts(search = '', page = 0, limit = 1) {
  const apiKey = 'your_api_key_here';
  const url = `http://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${page}&limit=${limit}`;
  
  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'x-api-key': apiKey,
          },
      });
      
      if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched products:', data);
      return data;
  } catch (error) {
      console.error('Error fetching products:', error);
  }
}

// Usage example:
fetchProducts('Hat', 2, 1);

export const SalePartListDeleteSaleList = (data, successCallback, errorCallBack) => _fetchService('salePartList/deleteSaleList', 'POST', data, successCallback, errorCallBack);
