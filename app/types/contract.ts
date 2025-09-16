export interface NameRecord {
  owner: string;
  resolvedAddress: string;
  imageHash: string;
  registrationTime: number;
}

export interface EventLog {
  type: 'registered' | 'updated' | 'transferred';
  name: string;
  data: {
    owner?: string;
    newAddress?: string;
    newImageHash?: string;
    oldOwner?: string;
    newOwner?: string;
    [key: string]: unknown;
  };
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
}

export interface RegisterForm {
  name: string;
  imageHash: string;
  targetAddress: string;
}

export interface UpdateForm {
  name: string;
  newAddress: string;
  newImageHash: string;
}

export interface TransferForm {
  name: string;
  newOwner: string;
}