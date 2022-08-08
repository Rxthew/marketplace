import {useState} from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Cart, cartItem } from './Cart'
import { Item, ItemEssence } from './Item'


interface shopItem {
    readonly mapKey : string
    readonly name : string
    readonly imageSrc : string
    readonly description : string
    readonly price : number
}

    
const defaultItems = function():Map<string,shopItem>[]{
    const defaultArray:string[] = [
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

const getSingleMap = function(elem:Map<string,shopItem>):{map : shopItem | undefined, key : string}{
    const key = elem.keys().next().value
    const map = elem.get(key)
        return {map,key}
}


const Shop = function():JSX.Element{
    let [itemsState, setItemsState] = useState<Map<string,cartItem>|null>(null)

    const basicMaps = defaultItems()
    const generateRoutes = function(){
        const basicMaps = defaultItems()
        const finalisedRoutes = basicMaps.map(
            function(elem){
                const {map,key} = getSingleMap(elem)
                const element = <Item name={map?.name ?? 'Coming soon'} description={map?.description ?? 'Product description not available at this time'} imageSrc={map?.imageSrc ?? '#'} price={map?.price ?? 0} mapKey={key} itemsSetter={setItemsState}/>
                return <Route path={`/products/${key}`} element={element}/>
            }
        )
        return finalisedRoutes
            
    }
    
    const finalisedItems:JSX.Element[] = basicMaps.map(
        function(elem){
            const {map,key} = getSingleMap(elem)
            const element = <ItemEssence name={map?.name ?? 'Coming soon'} imageSrc={map?.imageSrc ?? '#'} price={map?.price ?? 0}/>
            return <Link to={`/products/${key}`} >{element}</Link>
    })

    const indexPage:JSX.Element = <div>
                        <nav>
                            <Link to={'/cart'}>{<button>Cart</button>}</Link>
                            {finalisedItems}
                        </nav>
                    </div>
    return (
        <Routes>
            <Route path="/" element={indexPage}/> 
            <Route path="/cart" element={<Cart itemsMap={itemsState} itemsSetter={setItemsState}/>}/> 
            <Route path="/products" element={indexPage}/>  
            {generateRoutes()}
        </Routes>
            
    ) 

}

export default Shop