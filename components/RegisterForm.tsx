'use client'

import { useState } from 'react';
import type { RegisterForm } from '../app/types/contract';

interface RegisterFormProps {
  onRegister: (name: string, imageHash: string, targetAddress: string) => Promise<void>;
  isLoading: boolean;
}

export default function RegisterForm({ onRegister, isLoading }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    imageHash: '',
    targetAddress: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.imageHash || !form.targetAddress) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      await onRegister(form.name, form.imageHash, form.targetAddress);
      setForm({ name: '', imageHash: '', targetAddress: '' });
      alert('Nom enregistré avec succès !');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? (error as any).reason || error.message 
        : 'Erreur inconnue';
      alert(`Erreur d'enregistrement : ${errorMessage}`);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">📝 Enregistrer un Nom</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom (ex: alice)
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            placeholder="Entrez le nom à enregistrer"
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hash de l&apos;image IPFS
          </label>
          <input
            type="text"
            value={form.imageHash}
            onChange={(e) => setForm({...form, imageHash: e.target.value})}
            placeholder="QmXxXxXxXxXxXxXxXxXxXx..."
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse cible
          </label>
          <input
            type="text"
            value={form.targetAddress}
            onChange={(e) => setForm({...form, targetAddress: e.target.value})}
            placeholder="0x..."
            className="input-field"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Enregistrement...</span>
            </div>
          ) : (
            'Enregistrer le Nom'
          )}
        </button>
      </form>
    </div>
  );
}