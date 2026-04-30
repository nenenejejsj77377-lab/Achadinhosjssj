import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { AddProductModal } from './components/AddProductModal';
import { Product, Category } from './types';
import { syncStoreRecommendations } from './services/geminiService';
import { Plus, SlidersHorizontal, PackageOpen, RefreshCw } from 'lucide-react';

const STORE_URL = "https://collshp.com/infinitymix26?view=storefront";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Mini Impressora Térmica Portátil',
    description: 'Imprima adesivos e anotações direto do celular via Bluetooth. Sem tinta!',
    price: 69.90,
    category: 'Tech',
    affiliateLink: STORE_URL,
    imageUrl: 'https://picsum.photos/id/1/400/400',
    isNew: false,
    dateAdded: Date.now() - 1000000,
  },
  {
    id: '2',
    title: 'Organizador de Cabos 3 em 1',
    description: 'Acabe com a bagunça na sua mesa. Design clean e adesivo forte.',
    price: 15.50,
    category: 'Casa',
    affiliateLink: STORE_URL,
    imageUrl: 'https://picsum.photos/id/2/400/400',
    isNew: true,
    dateAdded: Date.now(),
  },
  {
    id: '3',
    title: 'Garrafa Térmica Digital LED',
    description: 'Mostra a temperatura da água ao tocar na tampa. Design elegante.',
    price: 35.99,
    category: 'Cozinha',
    affiliateLink: STORE_URL,
    imageUrl: 'https://picsum.photos/id/3/400/400',
    isNew: false,
    dateAdded: Date.now() - 2000000,
  }
];

const CATEGORIES: Category[] = ['Todos', 'Casa', 'Tech', 'Moda', 'Beleza', 'Cozinha'];

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('achadinhos_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem('achadinhos_products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleSyncStore = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    try {
      const recommendations = await syncStoreRecommendations(STORE_URL);
      
      const newProducts: Product[] = recommendations.map(rec => ({
        id: crypto.randomUUID(),
        title: rec.title,
        description: rec.description,
        price: rec.price,
        category: rec.category,
        affiliateLink: STORE_URL,
        imageUrl: `https://picsum.photos/seed/${rec.suggestedImageKeyword}${Date.now()}/400/400`,
        isNew: true,
        dateAdded: Date.now(),
      }));

      // Add only products that don't look like duplicates (simple check by title)
      const uniqueNewProducts = newProducts.filter(np => 
        !products.some(p => p.title.toLowerCase() === np.title.toLowerCase())
      );

      if (uniqueNewProducts.length > 0) {
        setProducts(prev => [...uniqueNewProducts, ...prev]);
      } else {
        alert("A IA buscou na web, mas não encontrou novidades diferentes do que você já tem no momento.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao sincronizar com a loja. Tente novamente.");
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header onSearch={setSearchTerm} storeUrl={STORE_URL} />

      {/* Category Filter */}
      <div className="sticky top-[60px] z-40 bg-gray-50/95 backdrop-blur-sm py-2 border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 overflow-x-auto no-scrollbar flex items-center space-x-2">
           <button className="flex items-center space-x-1 pr-2 text-gray-400">
             <SlidersHorizontal size={16} />
           </button>
           {CATEGORIES.map(cat => (
             <button
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                 selectedCategory === cat 
                   ? 'bg-shopee-orange text-white shadow-md' 
                   : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Sync Banner */}
        <div className="mb-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white shadow-lg flex items-center justify-between">
           <div>
             <h3 className="font-bold text-sm">Infinity Mix Store</h3>
             <p className="text-xs text-gray-300">Sincronize tendências com sua loja</p>
           </div>
           <button 
             onClick={handleSyncStore}
             disabled={isSyncing}
             className={`px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-2 ${isSyncing ? 'opacity-70 cursor-wait' : ''}`}
           >
             <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
             {isSyncing ? "Buscando..." : "Sincronizar"}
           </button>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <PackageOpen className="w-16 h-16 mb-4 opacity-50" />
            <p>Nenhum achadinho encontrado.</p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-shopee-orange text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white"
        title="Adicionar novo achadinho"
      >
        <Plus size={28} />
      </button>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
        defaultStoreUrl={STORE_URL}
      />
    </div>
  );
}