
export type Trait = "attack" | "health" | "speed";

export type NftAttribute = {
  trait_type: Trait;
  value: string;
}

export type NftMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
}

export type NftCore = {
  tokenId: number;
  price: number;
  creator: string;
  isListed: boolean
}

// export type Nft = {
//   meta: NftMeta
// } & NftCore

export type Nft = {
  tokenId: number;
  name: string;
  description: string;
  creator: string;
  price: number;
  isListed:boolean;
  meta: NftMeta;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  image: string; // Add this line to include the image property
};


export type FileReq = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
}

export type PinataRes = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
}