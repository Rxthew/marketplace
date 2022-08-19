import  products from '../Images/products'
import { Item, ItemEssence } from './Item'
import { useState } from 'react'
import {v4 as genKey} from 'uuid'
import { Link, Route, Routes } from 'react-router-dom'
import { Cart, cartItem } from './Cart'
import { ReactComponent as CartButton} from '../Icons/cart.svg'



interface shopItem {
    readonly mapKey : string
    readonly name : string
    readonly imageSrc : string
    readonly description : string
    readonly price : number
}

    
const defaultItems = function():Map<string,shopItem>[]{
    const defaultArray:[string,string][] = [
        ['Camera', products.camera],['Toolbox',products.toolbox],
        ['Kettle',products.kettle],['Reel',products.reel],
        ['Basket',products.basket],['Drive',products.drive],
        ['Perfume',products.perfume],['Bicycle',products.bike],
    ]

    const basicMaps = defaultArray.map(elem => {
       let elemMap =  new Map()
       elemMap.set(elem[0],{
        mapKey: elem[0],
        name: elem[0],
        imageSrc: elem[1],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'+
                     ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        price: 10
       })
       return elemMap
    })

    return basicMaps

}

const noMatch = <main className="flex flex-col justify-center items-center text-slate-500">
    <Link to='/products'>
        <button className="mt-4 p-4 border border-black" type='button'>Back to Marketplace</button>
    </Link>
    <p className="p-24 text-5xl">There is nothing here right now.</p>
    
</main>

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
                return <Route key={genKey()} path={`/products/${key}`} element={element}/>
            }
        )
        return finalisedRoutes
            
    }
    
    const finalisedItems:JSX.Element[] = basicMaps.map(
        function(elem){
            const {map,key} = getSingleMap(elem)
            const element = <ItemEssence name={map?.name ?? 'Coming soon'} imageSrc={map?.imageSrc ?? '#'} price={map?.price ?? 0}/>

            return  <section key={genKey()}>
                <Link key={genKey()} to={`/products/${key}`} >{element}</Link>
                </section>
    })

    const indexPage:JSX.Element = <main className="flex flex-col items-center bg-[#F4EBD0]">
                        <nav>
                            <Link key={genKey()} to={'/cart'}>
                                {<button className="mt-2 p-2 border border-black border-solid rounded-xl" type='button'>
                                    <CartButton/>
                                </button>}
                            </Link>
                        </nav>
                        {finalisedItems}
                    </main> 
    return (
        <Routes>
            <Route key={genKey()} path="/" element={indexPage}/> 
            <Route key={genKey()} path="/cart" element={<Cart itemsMap={itemsState} itemsSetter={setItemsState}/>}/> 
            <Route  key={genKey()} path="/products" element={indexPage}/>  
            {generateRoutes()}
            <Route key={genKey()} path="*" element={noMatch} />
        </Routes>
            
    ) 

}

export default Shop