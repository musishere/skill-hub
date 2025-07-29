"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { getMyLearningProducts } from "@/lib/api-client";

type IProduct = {
  id: string;
  image: string;
  type: string;
  status?: string;
  title: string;
  price?: string;
  students?: string;
  members?: string;
  posts?: string;
  spaces?: string;
  certificates?: string;
  subscribers?: string;
  products?: string;
  lastActivity: string;
  action?: string;
  enrolled?: number;
  createdAt?: string;
  updatedAt?: string;
};

interface ProductsGridProps {
  searchQuery?: string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 ProductsGrid: Starting API call to /api/client/my-learning/products');
        const data = await getMyLearningProducts();
        console.log('✅ ProductsGrid: API Response received:', data);
        console.log('📊 ProductsGrid: Data length:', data?.length || 0);

        // Transform backend data to match component structure
        const transformedProducts = data.map((product) => ({
          id: product.id,
          image: product.image || 'https://i.ibb.co/jJ4GHXP/img1.jpg',
          type: product.type,
          status: product.status,
          title: product.title,
          price: product.price,
          students: product.students,
          members: product.members,
          posts: product.posts,
          spaces: product.spaces,
          certificates: product.certificates,
          subscribers: product.subscribers,
          products: product.products,
          lastActivity: product.lastActivity,
          action: product.action,
          enrolled: product.enrolled,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }));
        console.log('🔄 ProductsGrid: Transformed data:', transformedProducts);
        setProducts(transformedProducts);
      } catch (err) {
        console.error('❌ ProductsGrid: API Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.log('🔄 ProductsGrid: Using fallback data due to error');
        // Fallback to static data if API fails
        setProducts([
          {
            id: "1",
            image: 'https://i.ibb.co/jZjZ7ZRd/butterfly.webp',
            type: 'course',
            status: 'published',
            title: 'How to Write Better Prompts',
            price: '5',
            students: '695',
            lastActivity: 'Created Nov 1, 2024',
            enrolled: 2543,
            action: 'View Outline',
          },
          {
            id: "2",
            image: 'https://i.ibb.co/BHcDXgQt/product5.webp',
            type: 'course',
            status: 'published',
            title: 'How to Write Better Prompts',
            price: '14.99',
            students: '695',
            lastActivity: 'Created Nov 1, 2024',
            enrolled: 2543,
            action: 'View Outline',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.status && product.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 max-xs:hidden">
        {filteredProducts.map((product: IProduct, index: number) => (
          <ProductCard.Desktop {...product} key={product.id || index} />
        ))}
      </div>
      <div className="min-xs:hidden flex flex-col gap-1 max-xs:gap-3">
        {filteredProducts.map((product: IProduct, index: number) => (
          <ProductCard.Mobile {...product} key={product.id || index} />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
