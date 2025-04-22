import { useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import {
  BrandChart,
  ColorChart,
  Navbar,
  PriceChart,
  ProductList,
  ShopHeader,
  SizeChart,
} from '../components';
import { GET_PRODUCTS_PAGINATION } from '../graphql/Queries/productQueries';
import Loading from '../assets/mui/Loading';
import MuiError from '../assets/mui/Alert';
import { PaginationMUI } from '../assets/mui/PaginationMUI';
import { mobile } from '../responsive';

// Fallback products data for when the server connection fails
const fallbackProducts = [
  {
    id: "fallback1",
    title: "Nike Air Jordan 1 High Chicago",
    image: "/images/nike-jordan1.jpg",
    price: 180,
    rates: 4.8,
    brand: "Nike",
    color: "red",
    inStock: true,
    size: [7, 8, 9, 10, 11]
  },
  {
    id: "fallback2",
    title: "Adidas Yeezy Boost 350 V2 Zebra",
    image: "/images/yeezy-zebra.jpg",
    price: 220,
    rates: 4.7,
    brand: "Adidas",
    color: "white",
    inStock: true,
    size: [7, 8, 9, 10, 11, 12]
  },
  {
    id: "fallback3",
    title: "Nike Dunk Low Panda",
    image: "/images/nike-dunk-panda.jpg",
    price: 110,
    rates: 4.5,
    brand: "Nike",
    color: "black",
    inStock: true,
    size: [7, 8, 9, 10]
  },
  {
    id: "fallback4",
    title: "Jordan 4 Retro University Blue",
    image: "/images/jordan-4-blue.jpg",
    price: 200,
    rates: 4.9,
    brand: "Jordan",
    color: "blue",
    inStock: true,
    size: [7, 8, 9, 10, 11]
  },
  {
    id: "fallback5",
    title: "Puma RS-X Core",
    image: "/images/puma-rsx.jpg",
    price: 90,
    rates: 4.3,
    brand: "Puma",
    color: "white",
    inStock: true,
    size: [7, 8, 9, 10, 11, 12]
  },
  {
    id: "fallback6",
    title: "Nike Zoom Vomero 5",
    image: "/images/vomero-5.jpg",
    price: 150,
    rates: 4.4,
    brand: "Nike",
    color: "grey",
    inStock: true,
    size: [7, 8, 9, 10, 11]
  }
];

const ShopPage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [useFallback, setUseFallback] = useState(false);

  const { size, brand, price, sort, color } = useSelector(
    (state) => state.filter
  );

  const getPage = (value) => {
    setPage(value);
  };

  const { data, loading, error } = useQuery(GET_PRODUCTS_PAGINATION, {
    variables: {
      page,
      productsFiltersInput: {
        size,
        color,
        brand,
        price,
        sort,
        rates: filteredProducts?.rates,
      },
    },
    fetchPolicy: 'network-only',
    onError: () => {
      setUseFallback(true); // Switch to fallback data on error
    }
  });

  // Use fallback data when server connection fails
  useEffect(() => {
    // Only use fallback if we have a definite error, not just when data is temporarily null
    if (error && error.networkError) {
      console.log("Network error detected, using fallback data");
      setUseFallback(true);
    } else if (!loading && data && data.getProductsPagination) {
      // We have valid data, make sure we're not using fallback
      setUseFallback(false);
    }
  }, [error, loading, data]);

  // If using fallback data, apply filter logic manually
  const getFallbackProducts = () => {
    let filtered = [...fallbackProducts];
    
    // Apply brand filter
    if (brand) {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase() === brand.toLowerCase()
      );
    }
    
    // Apply color filter
    if (color) {
      filtered = filtered.filter(product => 
        product.color.toLowerCase() === color.toLowerCase()
      );
    }
    
    // Apply size filter (if it's a number)
    if (size && !isNaN(size)) {
      filtered = filtered.filter(product => 
        product.size.includes(Number(size))
      );
    }
    
    // Apply price filter
    if (price && price.length === 2) {
      const [min, max] = price;
      filtered = filtered.filter(product => 
        product.price >= min && product.price <= max
      );
    }
    
    return filtered;
  };

  const products = useFallback ? getFallbackProducts() : data?.getProductsPagination?.products;
  const numOfPages = useFallback ? 1 : data?.getProductsPagination?.numOfPages || 1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [products]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    if (size || brand || color || price.length > 0) {
      setPage(1);
    }
  }, [size, brand, color, price.length]);

  return (
    <div className='section-center'>
      <Navbar />
      <Container>
        <FilterWrapper>
          <h4>Filter</h4>
          <SizeChart />
          <BrandChart />
          <PriceChart />
          <ColorChart />
        </FilterWrapper>
        <ShopWrapper>
          <ShopHeader filteredProducts={filteredProducts} />
          {loading && !useFallback ? (
            <Loading />
          ) : error && !useFallback ? (
            <MuiError
              width='40%'
              type='warning'
              alignItems='center'
              value={'Something went wrong.. Please try again later.'}
            />
          ) : !loading && filteredProducts?.length < 1 ? (
            <MuiError
              width='40%'
              type='warning'
              alignItems='center'
              value={'No product is matching your result'}
            />
          ) : (
            <div>
              <ProductList
                data={data}
                filteredProducts={filteredProducts}
                error={error}
              />
            </div>
          )}
        </ShopWrapper>
      </Container>
      <PaginationContainer>
        <PaginationMUI page={page} getPage={getPage} numOfPages={numOfPages} />
      </PaginationContainer>
    </div>
  );
};

export default ShopPage;

const Container = styled.div`
  width: 100%;
  min-width: 250px;
  display: flex;
  ${mobile({ flexDirection: 'column' })}
`;
const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  ${mobile({ minWidth: '350px' })}
  min-width: 250px;
`;

const ShopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-left: 10rem;
  ${mobile({ margin: '0 auto' })}
`;

const FallbackNotice = styled.div`
  text-align: center;
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: #fdf9e2;
  color: #786600;
  border-radius: 4px;
  font-size: 0.9rem;
`;
