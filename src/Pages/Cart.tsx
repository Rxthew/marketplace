import React, { SetStateAction, useState, useEffect } from "react"
import {v4 as genKey} from 'uuid'


export interface cartItem {
    readonly item : JSX.Element,
    itemAmount : number
    readonly itemPrice : number
}

interface cartProps {
    itemsMap: Map<string,cartItem> | null
    readonly itemsSetter: React.Dispatch<SetStateAction<Map<string,cartItem> | null>>
    

}

const getAmount = function(obj:cartItem){
    return obj.itemAmount
}

const removeItem = function(key:string, setter:React.Dispatch<SetStateAction<Map<string,cartItem> | null>>){
    setter(item => {
        item?.delete(key)
        item = new Map(item)
        return item
    })
}

let lastMount = false;
export const Cart = function(props:cartProps):JSX.Element{

    let [cartContent,setCartContent] = useState<JSX.Element>(
    <div>
        <span>Your cart is empty</span>
    </div>
    )

    let itemsSetter = props.itemsSetter
    let itemsMap = props.itemsMap

    useEffect(()=> {
        return () => {
            lastMount = true
        }

    },[])

    useEffect(()=> {

        const removeEmptyOrders = function(){
            itemsSetter(itemsMap => {
                if(itemsMap){
                    const items = Array.from(itemsMap.entries())
                    for(let item of items){
                        let [key, obj] = item
                        if(getAmount(obj) === 0 ){
                            removeItem(key,itemsSetter)
                        }
        
                    }
                    
                }
                return itemsMap
                
            })
        }  

      return () => {

        if(lastMount){

            lastMount = false;
            removeEmptyOrders();
            
        }
      }  
    },[itemsSetter])

    useEffect(() => {
        
    
        const incrementItem = function(key:string){
            itemsSetter(itemsMap => {
                if(itemsMap){
                    let target = itemsMap.get(key)
                    let amount  = target ? getAmount(target) + 1 : false
                    if(amount){
                        let updatedObj = Object.assign({},target,{itemAmount:amount})
                        itemsMap.set(key,updatedObj)
                        itemsMap = new Map(itemsMap)
                    }
                }
                return itemsMap
            })
    
        }
        
        const decrementItem = function(key:string){
            itemsSetter(itemsMap => {
                if(itemsMap){
                    let target = itemsMap.get(key)
                    let amount  = target ? getAmount(target) - 1 : -1
                    if(amount >= 0){
                        let updatedObj = Object.assign({},target,{itemAmount:amount})
                        itemsMap.set(key,updatedObj)
                        itemsMap = new Map(itemsMap)
                    }
                }
                return itemsMap
            })
            
        
        }

        const renderItem = function(key:string,itemObject:cartItem ){
            let amount = itemObject.itemAmount.toString()
    
            return (
                <div key={genKey()}>
                    {itemObject.item}
                    <div>
                        <button onClick = {() => {decrementItem(key)}}>Decrement</button>
                        <span data-testid='amount'>{amount}</span>
                        <button onClick={() => {incrementItem(key)}}>Increment</button>
                    </div>
                    <button onClick={() => {removeItem(key,itemsSetter)}}>Remove</button>
    
                </div>
                
            )
        }

        if(itemsMap){
            const itemsArray =  Array.from(itemsMap.entries())
            const renderedItems = itemsArray.map(elem => renderItem(elem[0],elem[1]))
            setCartContent(
                <div>
                    {renderedItems}
                </div>
            )
            
        }
    

    },[itemsMap, itemsSetter])


    return (
        cartContent
    )  
    
}
