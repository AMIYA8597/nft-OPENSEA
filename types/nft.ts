 export type Trait = "health" | "speed" | "attack"
 
 export type nftAttributes ={
    trait_type:Trait,
    value:string,

 }
 
 export type NftMeta = {
    description : string,
    image:string,
    name:string,
    attributes: nftAttributes
 }