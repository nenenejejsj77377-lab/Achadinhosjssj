import React from 'react';
import { Product } from '../types';
import { ExternalLink, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-40 w-full bg-gray-200 overflow-hidden group">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-shopee-orange text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Novo
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-1">
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
            <Tag size={10} /> {product.category}
          </span>
        </div>
        
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">
          {product.title}
        </h3>
        
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="text-shopee-orange font-bold text-sm">
            {formatCurrency(product.price)}
          </div>
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-shopee-orange text-white p-1.5 rounded-lg hover:bg-shopee-dark transition-colors"
            title="Ver na Shopee"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};