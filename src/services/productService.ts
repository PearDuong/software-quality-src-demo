import { Product } from '../types/product';

export interface CategoryItem {
  slug: string;
  name: string;
}

export const productService = {
  // Lấy danh sách sản phẩm (có hỗ trợ phân trang và lọc danh mục)
  getProducts: async (limit: number = 20, skip: number = 0, category?: string): Promise<{ products: Product[]; total: number }> => {
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    if (category && category !== 'all') {
      url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
    }

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) {
      throw new Error('Không thể tải danh sách sản phẩm');
    }

    const data = await res.json();
    return {
      products: data.products || [],
      total: data.total || 0,
    };
  },

  // Tìm kiếm sản phẩm theo từ khóa
  searchProducts: async (query: string): Promise<Product[]> => {
    const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!res.ok) {
      throw new Error('Lỗi khi tìm kiếm sản phẩm');
    }

    const data = await res.json();
    return data.products || [];
  },

  // Lấy danh mục sản phẩm
  getCategories: async (): Promise<CategoryItem[]> => {
    try {
      const res = await fetch('https://dummyjson.com/products/categories', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (!res.ok) return [];
      const data = await res.json();

      // DummyJSON có thể trả về mảng string hoặc mảng object { slug, name }
      if (Array.isArray(data)) {
        return data.map((item: any) => {
          if (typeof item === 'string') {
            return { slug: item, name: item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' ') };
          }
          return { slug: item.slug || item.name, name: item.name || item.slug };
        });
      }
      return [];
    } catch {
      return [];
    }
  },
};
