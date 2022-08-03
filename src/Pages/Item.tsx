import React, { SetStateAction } from "react"
import { useParams } from "react-router-dom"
import {cartItem} from "./Cart"

interface itemEssenceProps {
    readonly name : string
    readonly imageSrc : string
    readonly description : string
    readonly price : number

}

interface itemProps extends itemEssenceProps {
    readonly mapKey : string
    readonly itemsSetter : React.Dispatch<SetStateAction<Map<string,cartItem> | null>>
    

}

export const ItemEssence = function(props:itemEssenceProps){
    return (
        <div>
            <h2>{props.name}</h2>
            <img src={props.imageSrc} alt={props.name}/>
            <p data-testid='desc'>{props.description}</p>
            <p data-testid='price'>{props.price.toString()}</p>
        </div>
    )

}

export const Item = function(props:itemProps): JSX.Element{

    const essence = <ItemEssence name={props.name} description={props.description} imageSrc={props.imageSrc} price={props.price}/>
    
    const addToCart = function(){
        const newItemsMap = {
            item : essence,
            itemAmount : 1,
            itemPrice : props.price
        }

        props.itemsSetter(itemsMap => {
            const newMapObject = new Map(itemsMap)
            newMapObject.set(props.mapKey,newItemsMap)
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