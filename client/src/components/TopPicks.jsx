import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import icon from '../assets/utils/yeezy.svg';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ProductsContainer } from '../components';
import { useQuery } from '@apollo/client';
import {
  GET_DEFAULT_TOP_PICKS,
  GET_USER_TOP_PICKS,
} from '../graphql/Queries/userQueries';
import Loading from '../assets/mui/Loading';
import { useSelector } from 'react-redux';
import MuiError from '../assets/mui/Alert';
import { mobile } from '../responsive';

// Fallback products to display when server connection fails
const fallbackProducts = [
  {
    id: "fallback1",
    title: "Nike Air Jordan 1 High Chicago",
    image: "/images/nike-jordan1.jpg",
    price: 170,
    rates: 4.8,
    brand: "Nike"
  },
  {
    id: "fallback2",
    title: "Adidas Yeezy Boost 350 V2 Zebra",
    image: "/images/yeezy-zebra.jpg",
    price: 220,
    rates: 4.7,
    brand: "Adidas"
  },
  {
    id: "fallback3",
    title: "Nike Dunk Low Panda",
    image: "/images/nike-dunk-panda.jpg",
    price: 110,
    rates: 4.5,
    brand: "Nike"
  }
];

const TopPicks = (props) => {
  const { userInfo } = useSelector((state) => state.user);
  const { cartPage } = props;
  const [useFallback, setUseFallback] = useState(false);

  const query = userInfo ? GET_USER_TOP_PICKS : GET_DEFAULT_TOP_PICKS;

  const { data, error, loading } = useQuery(query, {
    fetchPolicy: 'network-only',
    onError: (err) => {
      console.error('TopPicks query error:', err);
      setUseFallback(true);
    }
  });

  // Only update the useEffect that determines when to use fallback data
  useEffect(() => {
    // Only use fallback if we have a definite error, not just when data is temporarily null
    if (error && error.networkError) {
      console.log("Network error detected, using fallback data for TopPicks");
      setUseFallback(true);
    } else if (!loading && data) {
      // We have some data, make sure we're not using fallback
      setUseFallback(false);
    }
  }, [error, loading, data]);

  const mapValue = useFallback 
    ? fallbackProducts
    : (userInfo
      ? data?.getTopPicksProducts
      : data?.getDefaultTopPicks);

  const hasValidData = mapValue && Array.isArray(mapValue) && mapValue.length > 0;

  return (
    <Wrapper>
      <HeaderContainer>
        <Header>
          <Icon src={icon} />
          TOP picks for you
        </Header>
        <Link to='/shop'>
          <ViewButton cartPage={cartPage && cartPage}>
            View all <ChevronRightIcon />
          </ViewButton>
        </Link>
      </HeaderContainer>
      {loading && !useFallback ? (
        <Loading />
      ) : error && !useFallback ? (
        <MuiError 
          width='40%' 
          type='warning' 
          alignItems='center' 
          value={'Something went wrong.. Please try again later.'} 
        />
      ) : !hasValidData && !useFallback ? (
        <MuiError
          width='40%'
          type='info'
          alignItems='center'
          value={'No product recommendations available at the moment.'}
        />
      ) : (
        <ItemsContainer cartPage={cartPage && cartPage}>
          {mapValue.map((item) => (
            <ProductsContainer key={item.id} {...item} />
          ))}
        </ItemsContainer>
      )}
    </Wrapper>
  );
};

export default TopPicks;

const Wrapper = styled.div`
  margin-top: 0.5rem;
`;
const Header = styled.h3`
  color: var(--clr-primary);
  ${mobile({ justifyContent: 'center', display: 'flex', marginBottom: '3rem' })}
`;
const Icon = styled.img`
  width: 6%;
  margin-right: 10px;
  transform: rotate(40deg);
`;

const ViewButton = styled.p`
  font-weight: 600;
  display: ${(props) => (props.cartPage ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
  height: 0;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  line-height: 1.75;
  letter-spacing: 0.02em;
  transition: all 0.3s;
  &:hover {
    color: var(--clr-mocha);
    background-color: var(--clr-mocha-hover);
  }
  ${mobile({ display: 'none' })}
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  border-bottom: ${(props) =>
    props.cartPage ? 'none' : '2px solid var(--clr-border)'};
  ${mobile({ flexDirection: 'column' })}
`;
