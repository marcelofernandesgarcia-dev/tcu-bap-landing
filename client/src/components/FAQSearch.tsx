import { useState, useMemo, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface FAQItem {
  q: string;
  a: string;
  category?: string;
}

interface FAQSearchProps {
  faqData: Record<string, { count: number; color: string; questions: FAQItem[] }>;
  initialCategory?: string;
}

export function FAQSearch({ faqData, initialCategory }: FAQSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);

  // Flatten all FAQ items with category info
  const allFaqItems = useMemo(() => {
    const items: (FAQItem & { category: string })[] = [];
    Object.entries(faqData).forEach(([category, data]) => {
      data.questions.forEach((q) => {
        items.push({ ...q, category });
      });
    });
    return items;
  }, [faqData]);

  // Set initial category on mount
  useEffect(() => {
    if (initialCategory && faqData[initialCategory]) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory, faqData]);

  // Filter items based on search query and category
  const filteredItems = useMemo(() => {
    let results = allFaqItems;

    // Filter by category if selected
    if (selectedCategory) {
      results = results.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query (case-insensitive, searches both Q and A)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (item) =>
          item.q.toLowerCase().includes(query) ||
          item.a.toLowerCase().includes(query)
      );
    }

    return results;
  }, [searchQuery, selectedCategory, allFaqItems]);

  // Highlight search term in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, idx) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={idx} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const categoryColors: Record<string, string> = {
    'O que é TCE': 'blue',
    'Motivos e Cálculos': 'green',
    'Limites e Valores': 'amber',
    'Responsabilidades': 'blue',
    'Prazos e Documentos': 'green',
    'Planilha BAP': 'amber',
  };

  const getCategoryBadgeColor = (category: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      amber: 'bg-amber-100 text-amber-800 border-amber-300',
    };
    return colorMap[categoryColors[category] || 'blue'] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Busque por palavras-chave (ex: prescrição, BAP, juros, valores...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2 text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-slate-800 text-white'
              : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
          }`}
        >
          Todas as Categorias
        </button>

        {Object.entries(faqData).map(([category, data]) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? `${getCategoryBadgeColor(category)} border-2`
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category} ({data.count})
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-600 font-medium">
        {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''} {selectedCategory && `em ${selectedCategory}`}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <Card key={idx} className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-3 text-base">
                {highlightText(item.q, searchQuery)}
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed mb-3">
                {highlightText(item.a, searchQuery)}
              </p>
              <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${getCategoryBadgeColor(item.category || '')}`}>
                {item.category}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center bg-slate-50">
            <p className="text-slate-600 font-medium">Nenhum resultado encontrado</p>
            <p className="text-slate-500 text-sm mt-2">Tente ajustar sua busca ou explorar outras categorias</p>
          </Card>
        )}
      </div>
    </div>
  );
}
