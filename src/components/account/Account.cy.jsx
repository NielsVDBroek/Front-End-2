import React from 'react'
import Account from './Account'
import { useNavigate } from "react-router-dom";

describe('<Account />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Account />)
  })
})