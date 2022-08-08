import React, { SetStateAction, useState, useEffect, useRef } from "react"
import { Link} from "react-router-dom"
import {v4 as genKey} from 'uuid'


export interface cartItem {
    readonly item : JSX.Element,
    itemAmount : number,
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

const removeItem = function(key:string, someNewMap:Map<string,cartItem> | null){
        someNewMap?.delete(key)
        return someNewMap
    
}

const reduceMap = function(key: string, setter:React.Dispatch<SetStateAction<Map<string,cartItem> | null>>){
    setter(item => {
        let newMap = new Map(item)
        return removeItem(key, newMap)
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
            <button type='button' aria-label={'remove'} onClick={() => {reduceMap(key,itemsSetter)}}>Remove</button>

        </div>
        
    )
}


export const Cart = function(props:cartProps):JSX.Element{


    const itemsSetter = props.itemsSetter 
    let itemsMap = props.itemsMap 
    let onMount = useRef(false)
    
    let [cartContent,setCartContent] = useState<JSX.Element>(
    <div>
        <Link to='/products'>
            <button type='button'>Back to Marketplace</button>
        </Link>
        <span>Your cart is empty</span>
        <div>
            <span>Subtotal:</span>
            <span>${0}</span>
        </div>
    </div>
    )



    useEffect(()=>{
        onMount.current = true
    },[])

    useEffect(()=>{
        if(onMount.current){
            itemsSetter(function(iMap){
                if(iMap){
                    let newMap = new Map(iMap)
                    const items = Array.from(newMap.entries())
                    for(let item of items){
                        let [key, obj] = item
                        if(getAmount(obj) === 0 ){
                            removeItem(key,newMap)
                        }
                    }
                    return newMap   
                }
                return iMap                
                
            })
        }
        onMount.current = false

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


        const reconcileSubTotal = function(itemArr:[string,cartItem][]){
            const relevantData = itemArr.map(elem => elem[1].itemAmount * elem[1].itemPrice)
            const initialValue = 0
            const subTotal = relevantData.reduce((prev,current) => prev + current,initialValue)
            return subTotal
        }

        if(itemsMap){
            const itemsArray =  Array.from(itemsMap.entries())
            const renderedItems = itemsArray.map(elem => 
                <SingleItem key={genKey()} mapKey={elem[0]} itemObject={elem[1]} setter={itemsSetter} increment={incrementItem} decrement={decrementItem} />
            )
            setCartContent(
                <div>
                    <Link to='/products'>
                        <button type='button'>Back to Marketplace</button>
                    </Link>
                    {renderedItems}
                    <div>
                        <span>Subtotal:</span>
                        <span>${reconcileSubTotal(itemsArray)}</span>
                    </div>
                </div>
            )
            
        }    

    },[itemsMap, itemsSetter])


    return (
        cartContent
    )  
    
}
