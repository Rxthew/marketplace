
import Shop from '../Shop'
import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'

it('Shop matches snapshot',() => {
    const shopsnap = renderer.create(
    <Router >
        <Shop/>
    </Router>).toJSON()
    expect(shopsnap).toMatchSnapshot()
})