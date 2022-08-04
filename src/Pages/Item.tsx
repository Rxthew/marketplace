import React, { SetStateAction } from "react"
import {cartItem} from "./Cart"

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

export const ItemEssence = function(props:itemEssenceProps){
    if(props.description){
        return (
            <div>
                <h2>{props.name}</h2>
                <img src={props.imageSrc} alt={props.name}/>
                <p data-testid='desc'>{props.description}</p>
                <p data-testid='price'>{props.price.toString()}</p>
            </div>
        )
        }
        return(
            <div>
                <h2>{props.name}</h2>
                <img src={props.imageSrc} alt={props.name}/>
                <p data-testid='price'>{props.price.toString()}</p>
            </div>
        )

}

export const Item = function(props:itemProps): JSX.Element{

    const essence = <ItemEssence name={props.name} description={props.description} imageSrc={props.imageSrc} price={props.price}/>

    const addToCartItem = function(newMapObject:Map<string,cartItem>){

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
    
    const addToCart = function(){
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
        <div>
        {essence}
        <button type='button' aria-label='addToCart' onClick={addToCart}>Add to Cart</button>
        </div>
    )
}