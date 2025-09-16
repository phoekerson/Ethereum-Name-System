'use client'

import { useState, useEffect } from 'react';
import { useENSContract } from '../hooks/useENSContract';
import WalletConnection from '../components/WalletConnection';
import RegisterForm from "../components/RegisterForm";
import SearchForm from '../components/SearchForm';
import type { UpdateForm, TransferForm } from '../types/contract';

export default function HomePage() {
  const {
    isConnected,
    account,
    isLoading,
    events,
    ownedNames,
    connectWallet,
    registerName,
    updateAddress,
    updateImage,
    transferName,
    resolveName,
    checkAvailability,
  } = useENSContract();

  const [updateForm, setUpdateForm] = useState<UpdateForm>({
    name: '',
    newAddress: '',
    newImageHash: ''
  });

  const [transferForm, setTransferForm] = useState<TransferForm>({
    name: '',
    newOwner: ''
  });

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error: any) {
      alert(`Erreur de connexion : ${error.message}`);
    }
  };

  const handleUpdateAddress = async () => {
    if (!updateForm.name || !updateForm.newAddress) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      await updateAddress(updateForm.name, updateForm.newAddress);
      setUpdateForm({ ...updateForm, newAddress: '' });
      alert('Adresse mise à jour avec succès !');
    } catch (error: any) {
      alert(`Erreur de mise à jour : ${error.reason || error.message}`);
    }
  };

  const handleUpdateImage = async () => {
    if (!updateForm.name || !updateForm.newImageHash) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      await updateImage(updateForm.name, updateForm.newImageHash);
      setUpdateForm({ ...updateForm, newImageHash: '' });
      alert('Image mise à jour avec succès !');
    } catch (error: any) {
      alert(`Erreur de mise à jour : ${error.reason || error.message}`);
    }
  };

  const handleTransfer = async () => {
    if (!transferForm.name || !transferForm.newOwner) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (!window.confirm(`Êtes-vous sûr de vouloir transférer "${transferForm.name}" ?`)) {
      return;
    }

    try {
      await transferName(transferForm.name, transferForm.newOwner);
      setTransferForm({ name: '', newOwner: '' });
      alert('Nom transféré avec succès !');
    } catch (error: any) {
      alert(`Erreur de transfert : ${error.reason || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            ENS Smart Contract
          </h1>
          {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interface moderne pour gérer vos noms ENS sur la blockchain
          </p> */}
        </div>

        {/* Connexion wallet */}
        <div className="max-w-2xl mx-auto mb-8">
          <WalletConnection
            isConnected={isConnected}
            account={account}
            onConnect={handleConnect}
          />
        </div>

        {isConnected && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Colonne gauche - Actions */}
            <div className="space-y-6">
              {/* Enregistrement */}
              <RegisterForm
                onRegister={registerName}
                isLoading={isLoading}
              />

              {/* Mise à jour */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">✏️ Mettre à jour un Nom</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nom à mettre à jour"
                    value={updateForm.name}
                    onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})}
                    className="input-field"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nouvelle adresse"
                        value={updateForm.newAddress}
                        onChange={(e) => setUpdateForm({...updateForm, newAddress: e.target.value})}
                        className="input-field"
                      />
                      <button
                        onClick={handleUpdateAddress}
                        disabled={isLoading}
                        className="btn-primary w-full"
                      >
                        Mettre à jour l'adresse
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nouveau hash d'image"
                        value={updateForm.newImageHash}
                        onChange={(e) => setUpdateForm({...updateForm, newImageHash: e.target.value})}
                        className="input-field"
                      />
                      <button
                        onClick={handleUpdateImage}
                        disabled={isLoading}
                        className="btn-purple w-full"
                      >
                        Mettre à jour l'image
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfert */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🔄 Transférer un Nom</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nom à transférer"
                    value={transferForm.name}
                    onChange={(e) => setTransferForm({...transferForm, name: e.target.value})}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Adresse du nouveau propriétaire"
                    value={transferForm.newOwner}
                    onChange={(e) => setTransferForm({...transferForm, newOwner: e.target.value})}
                    className="input-field"
                  />
                  <button
                    onClick={handleTransfer}
                    disabled={isLoading}
                    className="btn-danger w-full"
                  >
                    {isLoading ? 'Transfert...' : 'Transférer le Nom'}
                  </button>
                </div>
              </div>
            </div>

            {/* Colonne droite - Informations */}
            <div className="space-y-6">
              {/* Recherche */}
              <SearchForm
                onSearch={resolveName}
                onCheckAvailability={checkAvailability}
              />

              {/* Noms possédés */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                  <span>👤</span>
                  <span>Vos Noms ({ownedNames.length})</span>
                </h3>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {ownedNames.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <span className="text-4xl mb-2 block">📋</span>
                      <p>Aucun nom possédé</p>
                      <p className="text-sm mt-1">Enregistrez votre premier nom !</p>
                    </div>
                  ) : (
                    ownedNames.map((name, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-800">{name}</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setUpdateForm({...updateForm, name})}
                              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-100"
                              title="Sélectionner pour mise à jour"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => setTransferForm({...transferForm, name})}
                              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-100"
                              title="Sélectionner pour transfert"
                            >
                              🔄
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Événements récents */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                  <span>📡</span>
                  <span>Événements en Temps Réel</span>
                  {events.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {events.length}
                    </span>
                  )}
                </h3>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <span className="text-4xl mb-2 block animate-pulse-slow">⏳</span>
                      <p>En attente d'événements...</p>
                      <p className="text-sm mt-1">Les événements apparaîtront ici en temps réel</p>
                    </div>
                  ) : (
                    events.map((event, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              event.type === 'registered' 
                                ? 'bg-green-100 text-green-800' 
                                : event.type === 'updated'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {event.type === 'registered' && '✅'}
                              {event.type === 'updated' && '✏️'}
                              {event.type === 'transferred' && '🔄'}
                              <span className="ml-1">
                                {event.type === 'registered' ? 'ENREGISTRÉ' :
                                 event.type === 'updated' ? 'MISE À JOUR' : 'TRANSFÉRÉ'}
                              </span>
                            </span>
                            <span className="font-medium text-gray-800">{event.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString('fr-FR')}
                          </span>
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">Block:</span>
                            <span className="font-mono">{event.blockNumber}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">Tx:</span>
                            <span className="font-mono">{event.transactionHash.slice(0, 10)}...</span>
                          </div>
                          
                          {event.type === 'registered' && (
                            <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                              <p className="text-green-700 text-xs">
                                <strong>Propriétaire:</strong> <span className="font-mono">{event.data.owner.slice(0, 10)}...</span>
                              </p>
                            </div>
                          )}
                          
                          {event.type === 'updated' && (
                            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                              <p className="text-blue-700 text-xs">
                                {event.data.newAddress && (
                                  <><strong>Nouvelle adresse:</strong> <span className="font-mono">{event.data.newAddress.slice(0, 10)}...</span><br/></>
                                )}
                                {event.data.newImageHash && (
                                  <><strong>Nouvelle image:</strong> <span className="font-mono">{event.data.newImageHash.slice(0, 15)}...</span></>
                                )}
                              </p>
                            </div>
                          )}
                          
                          {event.type === 'transferred' && (
                            <div className="mt-2 p-2 bg-orange-50 rounded border border-orange-200">
                              <p className="text-orange-700 text-xs">
                                <strong>De:</strong> <span className="font-mono">{event.data.oldOwner.slice(0, 8)}...</span><br/>
                                <strong>Vers:</strong> <span className="font-mono">{event.data.newOwner.slice(0, 8)}...</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {events.length > 0 && (
                  <div className="mt-3 text-center">
                    <button
                      onClick={() => window.location.reload()}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Actualiser les événements
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer avec informations */}
        {isConnected && (
          <div className="mt-12 text-center">
            <div className="card max-w-4xl mx-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{ownedNames.length}</div>
                  {/* <div className="text-sm text-blue-800">Noms Possédés</div> */}
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{events.filter(e => e.type === 'registered').length}</div>
                  {/* <div className="text-sm text-green-800">Enregistrements</div> */}
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{events.filter(e => e.type === 'transferred').length}</div>
                  {/* <div className="text-sm text-orange-800">Transferts</div> */}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guide d'utilisation */}
        {!isConnected && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="card">
              {/* <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                🚀 Guide d'utilisation
              </h3> */}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    {/* <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</span> */}
                    <div>
                      {/* <h4 className="font-semibold text-gray-800">Connecter votre Wallet</h4> */}
                      {/* <p className="text-sm text-gray-600">Connectez MetaMask pour commencer à utiliser l'interface</p> */}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    {/* <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">2</span> */}
                    <div>
                      {/* <h4 className="font-semibold text-gray-800">Enregistrer des Noms</h4> */}
                      {/* <p className="text-sm text-gray-600">Créez vos noms ENS avec des images IPFS et des adresses cibles</p> */}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    {/* <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">3</span> */}
                    <div>
                      {/* <h4 className="font-semibold text-gray-800">Gérer vos Noms</h4> */}
                      {/* <p className="text-sm text-gray-600">Mettez à jour les adresses, images et transférez la propriété</p> */}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    {/* <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">4</span> */}
                    <div>
                      {/* <h4 className="font-semibold text-gray-800">Suivre en Temps Réel</h4> */}
                      {/* <p className="text-sm text-gray-600">Observez tous les événements du contrat en direct</p> */}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  {/* <span className="text-yellow-600">⚠️</span> */}
                  <p className="text-sm text-yellow-800">
                    {/* <strong>Important :</strong> Assurez-vous d'être connecté au bon réseau Ethereum et d'avoir suffisamment d'ETH pour les frais de gas. */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}