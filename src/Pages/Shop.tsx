import {useState} from 'react'
import { Cart } from './Cart'
import { Item, ItemEssence } from './Item'


interface shopItem {
    readonly mapKey : string
    readonly name : string
    readonly imageSrc : string
    readonly description : string
    readonly price : number
}

    
const defaultItems = function(){
    const defaultArray = [
        'a','b',
        'c','d',
        'e','f',
        'g','h',
    ]
    const basicMaps = defaultArray.map(elem => {
       let elemMap =  new Map()
       elemMap.set(elem,{
        mapKey: elem,
        name: '#',
        imageSrc: '#',
        description: '#',
        price: 10
       })
       return elemMap
    })

    return basicMaps

    
}

const Shop = function(){
    const basicMaps = defaultItems()
    const finalisedItems = basicMaps.map(
        function(elem){
            const key = elem.keys().next().value
            const map = elem.get(key)
            return <ItemEssence name={map.name} description={map.description} imageSrc={map.imageSrc} price={map.price}/>
    })
    return (
        <div>
            {finalisedItems}
        </div>
    ) 


}

export default Shop