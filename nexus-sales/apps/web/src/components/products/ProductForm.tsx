'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/utils/api';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
}

interface ProductFormProps {
  product?: Product; // Optional: for editing existing products
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product ? product.price / 100 : 0,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    setError(null);

    const apiEndpoint = product ? `/api/products/${product.id}` : '/api/products';
    const method = product ? 'PUT' : 'POST';

    const payload = {
        ...data,
        price: Math.round(data.price * 100), // Convert to cents
    };

    try {
      const response = await apiClient(apiEndpoint, {
        method,
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Something went wrong');

      router.push('/dashboard/products');
      router.refresh(); // Refresh server components on the target page

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {product ? 'Edit Product' : 'Create New Product'}
      </h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input id="name" {...register('name')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" {...register('description')} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
        <input id="price" type="number" step="0.01" {...register('price')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
      </div>

      <div>
        <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
