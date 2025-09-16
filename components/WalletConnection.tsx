'use client'

interface WalletConnectionProps {
  isConnected: boolean;
  account: string;
  onConnect: () => Promise<void>;
}

export default function WalletConnection({ isConnected, account, onConnect }: WalletConnectionProps) {
  if (isConnected) {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Connecté en tant que :</p>
            <p className="font-mono text-sm font-medium">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow"></div>
            <span className="text-sm text-green-600 font-medium">Connecté</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Connecter votre Wallet</h2>
      <p className="text-gray-600 mb-6">
        Connectez MetaMask pour interagir avec le smart contract ENS
      </p>
      <button
        onClick={onConnect}
        className="btn-primary text-lg px-8 py-4"
      >
        <span className="flex items-center justify-center space-x-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
          </svg>
          <span>Connecter MetaMask</span>
        </span>
      </button>
    </div>
  );
}