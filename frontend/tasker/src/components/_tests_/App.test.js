import { render } from '@testing-library/react';
import App from '../App.js';
import { MemoryRouter } from 'react-router-dom';


describe('smoke and snapshot tests',() => {

  test('renders without crashing', () => {

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

  });


  test('matches the snapshot', () => {

    let asFragment;

    const {asFragment: fragment } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    asFragment = fragment;

    expect(asFragment()).toMatchSnapshot

  });

})

describe('renders correct components', () => {
  
  test('renders Router component', () => {

    const {container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(container).toHaveTextContent('Welcome to Tasker');

  })

  test('renders NavBar component', () => {

    const {container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(container).toHaveTextContent('Login');
    expect(container).toHaveTextContent('Sign Up');

  })

})

