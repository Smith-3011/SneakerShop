import React, { useEffect, useState } from 'react';
import client from '../services/client';
import { GET_PRODUCTS } from '../queries/products';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const result = await client.query({
          query: GET_PRODUCTS,
        });
        setProducts(result.data.getProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        
        // Fallback to dummy data when API fails
        const dummyProducts = [
          {
            _id: "dummy1",
            name: "Nike Air Jordan 1 High",
            brand: "Nike",
            price: 180,
            countInStock: 10,
            rating: 4.5,
            image: "/images/nike-air-jordan-1.jpg",
          },
          {
            _id: "dummy2",
            name: "Adidas Yeezy Boost 350",
            brand: "Adidas",
            price: 220,
            countInStock: 5,
            rating: 4.8,
            image: "/images/adidas-yeezy-350.jpg",
          },
          {
            _id: "dummy3",
            name: "Nike Dunk Low Panda",
            brand: "Nike",
            price: 110,
            countInStock: 15,
            rating: 4.2,
            image: "/images/nike-dunk-panda.jpg",
          }
        ];
        setProducts(dummyProducts);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Render your products here */}
    </div>
  );
};

export default Home; 