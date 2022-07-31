import React, { SetStateAction } from "react"
import {cartItem} from "./Cart"

interface itemProps {
    readonly mapKey : string
    readonly itemsSetter : React.Dispatch<SetStateAction<Map<string,cartItem> | null>>
    readonly name : string
    readonly imageSrc : string
    readonly description : string
    readonly price : number

}

export const Item = function(props:itemProps): JSX.Element{

    const addToCart = function(){
        const newItemsMap = {
            item : mapItem,
            itemAmount : 1,
            itemPrice : props.price
        }

        props.itemsSetter(itemsMap => {
            const newMapObject = new Map(itemsMap)
            newMapObject.set(props.mapKey,newItemsMap)
            return newMapObject
        })
    }

    const mapItem:JSX.Element = 
    <div>
        <h2>{props.name}</h2>
        <img src={props.imageSrc} alt={props.name}/>
        <p data-testid='desc'>{props.description}</p>
        <p data-testid='price'>{props.price.toString()}</p>
    </div>
    return (
        <div>
        {mapItem}
        <button type='button' aria-label='addToCart' onClick={addToCart}>Add to Cart</button>
        </div>
    )
}