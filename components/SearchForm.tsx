'use client'

import { useState } from 'react';
import type { NameRecord } from '../types/contract';

interface SearchFormProps {
  onSearch: (name: string) => Promise<NameRecord | null>;
  onCheckAvailability: (name: string) => Promise<boolean>;
}

export default function SearchForm({ onSearch, onCheckAvailability }: SearchFormProps) {
  const [searchName, setSearchName] = useState('');
  const [resolvedData, setResolvedData] = useState<NameRecord | null>(null);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    
    setIsLoading(true);
    try {
      const [data, available] = await Promise.all([
        onSearch(searchName),
        onCheckAvailability(searchName)
      ]);
      
      setResolvedData(data);
      setNameAvailable(available);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">🔍 Rechercher un Nom</h3>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Entrez le nom à rechercher"
            className="input-field flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchName.trim()}
            className="btn-primary"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Rechercher'
            )}
          </button>
        </div>
        
        {nameAvailable !== null && (
          <div className={`p-4 rounded-lg ${nameAvailable 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {nameAvailable ? (
                <>
                  <span className="text-lg">✅</span>
                  <span className="font-medium">Nom disponible !</span>
                </>
              ) : (
                <>
                  <span className="text-lg">❌</span>
                  <span className="font-medium">Nom déjà pris</span>
                </>
              )}
            </div>
          </div>
        )}

        {resolvedData && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
              <span>📋</span>
              <span>Détails du nom</span>
            </h4>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">Propriétaire :</span>
                <span className="ml-2 font-mono bg-white px-2 py-1 rounded border">
                  {resolvedData.owner}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Résout vers :</span>
                <span className="ml-2 font-mono bg-white px-2 py-1 rounded border">
                  {resolvedData.resolvedAddress}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Hash de l'image :</span>
                <span className="ml-2 font-mono bg-white px-2 py-1 rounded border text-xs">
                  {resolvedData.imageHash}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-gray-600">Enregistré le :</span>
                <span className="ml-2">
                  {new Date(resolvedData.registrationTime * 1000).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}