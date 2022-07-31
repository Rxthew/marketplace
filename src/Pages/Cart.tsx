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

interface singleItemProps {
    mapKey: string,
    itemObject : cartItem
    setter : React.Dispatch<SetStateAction<Map<string,cartItem> | null>>
    decrement(key:string) : void
    increment(key:string) : void
    
}

const getAmount = function(obj:cartItem){
    return obj.itemAmount
}

const removeItem = function(key:string, setter:React.Dispatch<SetStateAction<Map<string,cartItem> | null>>){
    setter(item => {
        item = new Map(item)
        item?.delete(key)
        return item
    })
}

const SingleItem =  function(props:singleItemProps){

    const [key,itemsSetter,decrement,increment] = [props.mapKey, props.setter,props.decrement,props.increment]
    let itemObject = props.itemObject
    let amount = itemObject.itemAmount.toString()

    return (
        <div key={genKey()}>
            {itemObject.item}
            <div>
                <button type='button' aria-label={'decrement'} onClick = {() => {decrement(key)}}>Decrement</button>
                <span data-testid='amount'>{amount}</span>
                <button type='button' aria-label={'increment'} onClick={() => {increment(key)}}>Increment</button>
            </div>
            <button type='button' aria-label={'remove'} onClick={() => {removeItem(key,itemsSetter)}}>Remove</button>

        </div>
        
    )
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
                        itemsMap = new Map(itemsMap)
                        let updatedObj = Object.assign({},target,{itemAmount:amount})
                        itemsMap.set(key,updatedObj)
                        
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
                        itemsMap = new Map(itemsMap)
                        let updatedObj = Object.assign({},target,{itemAmount:amount})
                        itemsMap.set(key,updatedObj)
                        
                    }
                }
                return itemsMap
            })
            
        
        }

        if(itemsMap){
            const itemsArray =  Array.from(itemsMap.entries())
            const renderedItems = itemsArray.map(elem => 
                <SingleItem key={genKey()} mapKey={elem[0]} itemObject={elem[1]} setter={itemsSetter} increment={incrementItem} decrement={decrementItem} />
            )
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
