import { useState, useEffect } from 'react'
import Guitar from './components/Guitar'
import Header from './components/Header'
import { db } from './data/db'

function App() {

  const initialState = () => {
    const cartString = localStorage.getItem('cart');
    return cartString ? JSON.parse(cartString) : [];
  }

  // Hooks siempre van en la parte superior del componente dentro de la función
  const [data] = useState(db); //read guitars from db
  const [cart, setCart] = useState(initialState);
  const MAX_ITEMS = 10;

  useEffect(() => {
    // getFromLocalStorage();
    saveInLocalStorage();
  }, [cart]);

  function addToCart(item) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExists >= 0) {
      const newCart = [...cart];
      newCart[itemExists].quantity++;
      setCart(newCart);
    } else {
      item.quantity = 1;
      setCart(prevCart => [...prevCart, item]);
    }
  }

  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map((guitar) => {
      if (guitar.id === id) {
        if (guitar.quantity >= MAX_ITEMS) {
          alert(`No puedes agregar más de ${MAX_ITEMS} unidades`);
          return guitar;
        }
        return { ...guitar, quantity: guitar.quantity + 1 };
      }
      return guitar;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map((guitar) => {
      if (guitar.id === id && guitar.quantity > 1) {
        return { ...guitar, quantity: guitar.quantity - 1 };
      }
      return guitar;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  function saveInLocalStorage() {
    const cartString = JSON.stringify(cart);
    localStorage.setItem('cart', cartString);
  }
  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        maxItems={MAX_ITEMS}
        clearCart={clearCart}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>

    </>
  )
}

export default App
