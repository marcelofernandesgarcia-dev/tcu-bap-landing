'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, X } from "lucide-react";

export interface SearchableContent {
  id: string;
  title: string;
  category: string;
  content: string;
  reference?: string;
  link?: string;
}

interface AdvancedSearchProps {
  data: SearchableContent[];
  onResultClick?: (item: SearchableContent) => void;
  placeholder?: string;
  showCategories?: boolean;
}

export function AdvancedSearch({
  data,
  onResultClick,
  placeholder = "Buscar...",
  showCategories = true
}: AdvancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const categories = useMemo(() => {
    return Array.from(new Set(data.map(item => item.category))).sort();
  }, [data]);

  const results = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesCategory = selectedCategory === null || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, data]);

  const handleResultClick = (item: SearchableContent) => {
    if (onResultClick) {
      onResultClick(item);
    }
    setShowResults(false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="pl-10 py-6 text-base"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setShowResults(false);
            }}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      {showCategories && categories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Filtrar por Categoria:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              Todas ({data.length})
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category} ({data.filter(item => item.category === category).length})
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (searchTerm !== '' || selectedCategory !== null) && (
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
          </p>

          {results.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map(item => (
                <Card
                  key={item.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                  onClick={() => handleResultClick(item)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">{item.content}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {item.category}
                        </span>
                        {item.reference && (
                          <span className="text-xs text-slate-500">
                            {item.reference}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-slate-600 mb-3">Nenhum resultado encontrado.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setShowResults(false);
                }}
              >
                Limpar Filtros
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
