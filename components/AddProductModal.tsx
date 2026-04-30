import React, { useState } from 'react';
import { X, Sparkles, Loader2, Link as LinkIcon } from 'lucide-react';
import { parseProductInfo } from '../services/geminiService';
import { Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
  defaultStoreUrl: string;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd, defaultStoreUrl }) => {
  const [inputText, setInputText] = useState('');
  const [link, setLink] = useState(defaultStoreUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Por favor, cole o título ou descrição do produto.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // 1. Use AI to extract structured data
      const parsed = await parseProductInfo(inputText);
      
      // 2. Create new product object
      const newProduct: Product = {
        id: crypto.randomUUID(),
        title: parsed.title,
        description: parsed.description,
        price: parsed.price,
        category: parsed.category,
        affiliateLink: link || defaultStoreUrl,
        // Use a random picsum image based on keyword + random seed to avoid caching same image
        imageUrl: `https://picsum.photos/seed/${parsed.suggestedImageKeyword}${Date.now()}/400/400`,
        isNew: true,
        dateAdded: Date.now(),
      };

      onAdd(newProduct);
      onClose();
      setInputText('');
      setLink(defaultStoreUrl); // Reset to default store
    } catch (err) {
      setError('Falha ao processar com IA. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-shopee-orange to-shopee-light p-4 flex justify-between items-center text-white">
          <h2 className="font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-200" />
            Adicionar Achadinho
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-orange-50 p-3 rounded-lg text-xs text-orange-800 border border-orange-100">
            <strong>Como funciona:</strong> Cole o título ou a descrição "bagunçada" do produto abaixo. Nossa IA vai formatar, colocar preço e categorizar automaticamente!
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cole o texto do produto
            </label>
            <textarea
              className="w-full p-3 border rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-shopee-orange focus:border-transparent outline-none transition-all h-24 resize-none"
              placeholder="Ex: Mini Processador Alimentos Sem Fio USB 250ml..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link de Afiliado (Opcional)
            </label>
            <div className="relative">
              <input
                type="url"
                className="w-full pl-9 p-2.5 border rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-shopee-orange outline-none"
                placeholder="https://shopee.com.br/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando IA...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Criar Magic Card
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};