import { ConvexHttpClient } from "convex/browser"

export const getConvexClient = ()=>{
    if(!process.env.NEXT_PUBLIC_CONVEX_URL){
        throw new Error("Missing convex url NEXT_PUBLIC_CONVEX_URL")
    }
    return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
}