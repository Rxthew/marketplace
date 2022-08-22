import React, { MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react"
import Skeleton from "react-loading-skeleton"
import { Link } from "react-router-dom"
import { cartItem } from "./Cart"
import 'react-loading-skeleton/dist/skeleton.css'

interface itemEssenceProps {
    readonly name : string
    readonly imageSrc : string
    readonly description? : string
    readonly price : number


}

interface itemProps extends itemEssenceProps {
    readonly mapKey : string
    readonly itemsSetter : React.Dispatch<SetStateAction<Map<string,cartItem> | null>>
    readonly description: string
    

}


export const ItemEssence = function(props:itemEssenceProps):JSX.Element{
    let [imageVisible, setImageVisible] = useState<boolean>(false)
    let [imageLoaded, setImageLoaded] = useState<boolean>(false)
    const target= useRef() as MutableRefObject<HTMLDivElement> | undefined

    const removePlaceHolder = function(){
        setImageLoaded(true)
    }

    useEffect(()=>{
        let latestTarget = target?.current
        let opts =  {
            rootMargin : '50px',
            threshold : 0.1
        }
        const observer = new IntersectionObserver((entries)=>{
            entries.forEach(entry => entry.isIntersecting  ? setImageVisible(true) : false)
        },opts)
        observer.observe(latestTarget as HTMLDivElement)     
        
        return () => {
            if(latestTarget){
                observer.unobserve(latestTarget)
            }
            
        }
    },[])

    
    if(props.description){
        return (
            <section className='flex flex-col items-center mt-2 border p-8 rounded-lg bg-[#D6AD60] max-w-xl' ref={target}>
                <h2 className='text-2xl mb-4'>{props.name}</h2>
                {imageVisible ? <img src={props.imageSrc} alt={props.name}/> : <Skeleton className='min-w-[min(600px,100vw)] min-h-[min(400px,50vh)]'/>}
                <p className='p-4 whitespace-pre-wrap break-all' data-testid='desc'>{props.description}</p>
                <p className='text-2xl mt-4 self-start' data-testid='price'>${props.price.toFixed(2)}</p>
            </section>
        )
        }
        return(
            <div className='flex flex-col items-center mt-8 border p-8 rounded-lg bg-[#D6AD60] max-w-xl' ref={target}>
                <h2 className='text-2xl mb-4'>{props.name}</h2>
                {imageVisible ? <img src={props.imageSrc} alt={props.name} onLoad={removePlaceHolder}/> : <Skeleton className='min-w-[min(600px,100vw)] min-h-[min(400px,50vh)]'/>}
                {imageLoaded ? false : <Skeleton className='min-w-[min(600px,100vw)] min-h-[min(400px,50vh)]'/>}
                <p className='text-2xl mt-4 self-start' data-testid='price'>${props.price.toFixed(2)}</p>
            </div>
        )

}

export const Item = function(props:itemProps):JSX.Element{

    const essence = <ItemEssence name={props.name} description={props.description} imageSrc={props.imageSrc} price={props.price}/>

    const addToCartItem = function(newMapObject:Map<string,cartItem>):Map<string,cartItem>{

        const newItemsObj = function(amount:number){
         
           return {
                item : essence,
                itemAmount : ++amount,
                itemPrice : props.price

            }
        }
        let oldAmount = newMapObject.get(props.mapKey)?.itemAmount
        newMapObject.set(props.mapKey,newItemsObj(oldAmount ?? 0))
        return newMapObject        
    }

    const newItemsObj = {
        item : essence,
        itemAmount : 1,
        itemPrice : props.price
    }
    
    const addToCart = function():void{
        props.itemsSetter(itemsMap => {
            const newMapObject = new Map(itemsMap)
            
            if(newMapObject.has(props.mapKey)){
                return addToCartItem(newMapObject)
            }

            newMapObject.set(props.mapKey,newItemsObj)
            return newMapObject
        })
    }
 

    return (
        <main className="flex flex-col items-center bg-[#F4EBD0] min-h-screen text-[#122620]">
            <Link to='/cart'>
                <button className='mt-4 p-4 rounded-lg bg-[#D6AD60]' type='button' aria-label='addToCart' onClick={addToCart}>Add to Cart</button>
            </Link> 
            {essence}
            <Link to='/products'>
                <button className='m-4 p-4 rounded-lg bg-[#D6AD60]' type='button'>Back to Marketplace</button>
            </Link>        
        </main>
    )
}