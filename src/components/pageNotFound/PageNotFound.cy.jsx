import React from 'react'
import PageNotFound from './PageNotFound'


describe('<PageNotFound />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PageNotFound />)
  })
})