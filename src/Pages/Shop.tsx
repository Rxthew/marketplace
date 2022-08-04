import {useState} from 'react'
import { Link, Outlet, Route, Routes } from 'react-router-dom'
import { Cart, cartItem } from './Cart'
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

const getSingleMap = function(elem:Map<any,any>){
        const key = elem.keys().next().value
        const map = elem.get(key)
        return {map,key}
}


const Shop = function(){
    let [itemsState, setItemsState] = useState<Map<string,cartItem>|null>(null)

    const basicMaps = defaultItems()
    const generateRoutes = function(){
        const basicMaps = defaultItems()
        const finalisedRoutes = basicMaps.map(
            function(elem){
                const {map,key} = getSingleMap(elem)
                const element = <Item name={map.name} description={map.description} imageSrc={map.imageSrc} price={map.price} mapKey={key} itemsSetter={setItemsState}/>
                return <Route path={`products/${key}`} element={element}/>
            }
        )
        return <Route>
            {finalisedRoutes}
            </Route>
    }
    
    const finalisedItems = basicMaps.map(
        function(elem){
            const {map,key} = getSingleMap(elem)
            const element = <ItemEssence name={map.name} imageSrc={map.imageSrc} price={map.price}/>
            return <Link to={`/products/${key}`} >{element}</Link>
    })

    const indexPage = <div>
                        <nav>
                            <Link to={'/cart'}>{<button>Cart</button>}</Link>
                            {finalisedItems}
                        </nav>
                        <Outlet/>
                    </div>
    return (
        <Route path="/" element={indexPage}> 
            <Route path="/cart" element={<Cart itemsMap={itemsState} itemsSetter={setItemsState}/>}/>   
            {generateRoutes()}
        </Route>
        
    ) 

}

export default Shop