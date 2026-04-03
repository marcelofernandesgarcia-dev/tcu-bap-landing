import { useState, useMemo } from 'react';
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
}

export function FAQSearch({ faqData }: FAQSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Busque por palavras-chave (ex: prescrição, BAP, juros, valores...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 py-3 text-base border-2 border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-blue-700 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Todas as Categorias
        </button>
        {Object.entries(faqData).map(([category, data]) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? `bg-${categoryColors[category] || 'blue'}-700 text-white`
                : `bg-${categoryColors[category] || 'blue'}-100 text-${categoryColors[category] || 'blue'}-800 hover:bg-${categoryColors[category] || 'blue'}-200`
            }`}
          >
            {category} ({data.count})
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{filteredItems.length}</span>
          {' '}
          resultado{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
          {searchQuery && ` para "${searchQuery}"`}
          {selectedCategory && ` em ${selectedCategory}`}
        </p>
      </div>

      {/* Results */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item, idx) => (
            <Card key={idx} className="p-6 border-l-4 border-l-blue-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-bold text-slate-900 flex-grow">
                  {highlightText(item.q, searchQuery)}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getCategoryBadgeColor(item.category)}`}>
                  {item.category}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {highlightText(item.a, searchQuery)}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-300">
          <p className="text-slate-600 text-lg mb-2">
            Nenhum resultado encontrado
          </p>
          <p className="text-slate-500 text-sm">
            Tente usar outras palavras-chave ou navegue por categorias
          </p>
        </Card>
      )}

      {/* Quick Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>💡 Dica:</strong> Use palavras-chave como "prescrição", "BAP", "juros", "valores", "responsável", "TCU", "CGU" para encontrar respostas rapidamente.
        </p>
      </Card>
    </div>
  );
}
