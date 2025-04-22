import React, { useState } from 'react';
import styled from 'styled-components';
import ClearIcon from '@mui/icons-material/Clear';
import Stars from './Stars';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SINGLE_PRODUCT } from '../graphql/Queries/productQueries';
import Loading from '../assets/mui/Loading';
import { useSelector } from 'react-redux';
import { DELETE_FROM_CART } from '../graphql/Mutations/cartMutations';
import { GET_USER_CART } from '../graphql/Queries/cartQueries';
import MuiError from '../assets/mui/Alert';
import { mobile } from '../responsive';
import { getImageForProduct, getDefaultImage } from '../utils/imageUtils';

// Fallback image URLs mapped by shoe type/brand
const fallbackImages = {
  'Yeezy Slide Core': 'https://i.ibb.co/9Wc6zVR/adidas-yeezy-slides-core.png',
  'Nike Dunk Low Panda': 'https://i.ibb.co/7SBt6ty/nike-dunk-low-panda.png',
  'Jordan 1 Mid Chicago Black Toe': 'https://i.ibb.co/kqM3rC7/nike-jordan-1-mid-chicago-black-toe.png',
  'Jordan 1 High UNC Chicago': 'https://i.ibb.co/PQfWdQV/nike-jordan-1-unc-to-chicago.png',
  'Puma RS-X Core': 'https://i.ibb.co/zGhXbWF/puma-rs-x-core.png',
  // Generic fallbacks by brand
  'Yeezy': 'https://i.ibb.co/1mdcmDW/adidas-yeezy-700-wave-runner.png',
  'Jordan': 'https://i.ibb.co/2W5gXNT/nike-jordan-1-travis-mocha-high.png',
  'Dunk': 'https://i.ibb.co/SKVRntS/nike-dunk-low-unc.png',
  'Nike': 'https://i.ibb.co/VxB80fj/nike-dunk-low-chicago.png',
  'Puma': 'https://i.ibb.co/hK4V4mH/puma-rs-dreamer-purple.png',
  // Default fallback for any other type
  'default': 'https://i.ibb.co/kJH3HD8/nike-jordan-4-university-blue.png'
};

const CartItems = ({ productId, size, id, orderPage, historyPage }) => {
  const [cartItems, setCartItems] = useState([]);
  const [imgError, setImgError] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const { loading } = useQuery(GET_SINGLE_PRODUCT, {
    variables: { productId },
    onCompleted({ getProductById }) {
      setCartItems(getProductById);
    },
  });

  const [deleteProduct, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_FROM_CART, {
      variables: { id },
      refetchQueries: [
        {
          query: GET_USER_CART,
          variables: { userId: userInfo.id },
          awaitRefetchQueries: true,
        },
      ],
    });

  const { image, title, model, price, brand } = cartItems;
  
  // Get appropriate image
  const productImage = title ? getImageForProduct(title) : getDefaultImage();
  const imageSource = imgError ? getDefaultImage() : image || productImage;

  // Function to get fallback image based on title or brand
  const getFallbackImage = () => {
    if (fallbackImages[title]) {
      return fallbackImages[title];
    }
    if (fallbackImages[brand]) {
      return fallbackImages[brand];
    }
    return fallbackImages.default;
  };

  return (
    <>
      <Container>
        <Wrapper orderPage={orderPage}>
          {loading ? (
            <Loading />
          ) : deleteLoading ? (
            <Loading />
          ) : deleteError ? (
            <MuiError
              type='error'
              value={'Something went wrong.. Please try again later'}
            />
          ) : (
            <ItemContainer>
              <ImageContainer>
                <Image 
                  src={imageSource} 
                  onError={() => setImgError(true)}
                  alt={title || 'Sneaker image'}
                />
              </ImageContainer>
              <InfoContainer>
                <Title>{title} </Title>
                <Model>{model}</Model>
                <Size>{`Sizes: ${size} US`}</Size>

                <Qty>{`Qty: ${size?.length}`}</Qty>
              </InfoContainer>
            </ItemContainer>
          )}
          {historyPage ? (
            <SaleInfo>
              <h4>Sale Info:</h4>
              <div className='info'>
                Date Purchased: <span>21/11/2021</span>
              </div>
              <div className='info'>
                Day: <span>Sunday</span>
              </div>
              <div className='rating-container'>
                <h3>Rate this item</h3>
                <Stars />
              </div>
            </SaleInfo>
          ) : (
            <PriceContainer>
              {loading ? (
                ''
              ) : deleteLoading ? (
                ''
              ) : deleteError ? (
                ''
              ) : (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    flexDirection: 'column',
                  }}
                >
                  {orderPage ? (
                    ''
                  ) : (
                    <ClearIcon
                      className='icon'
                      onClick={() => deleteProduct()}
                    />
                  )}
                  <Price>${price * size?.length}</Price>
                </div>
              )}
            </PriceContainer>
          )}
        </Wrapper>
      </Container>
    </>
  );
};

export default CartItems;

const Container = styled.div``;
const Wrapper = styled.div`
  display: flex;
  background-color: #fff;
  width: 100%;
  margin: 2rem 0 0;
  border-radius: 1rem;
`;
const ItemContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 290px;
  justify-content: space-evenly;
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 12px;
  margin: 10px;
  overflow: hidden;
  width: 200px;
  height: 180px;
`;
const Image = styled.img`
  width: 100%;
  height: 160px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  transition: transform 0.3s ease;
  ${mobile({ width: '120px', height: '120px', marginTop: '1rem' })}
  
  &:hover {
    transform: scale(1.05);
  }
`;
const InfoContainer = styled.div`
  width: ${(props) => (props.historyPage ? '60%' : '40%')};
  margin-top: 1rem;
`;

const Title = styled.h4``;
const Model = styled.p`
  font-size: 14px;
  color: var(--clr-gray);
  margin-top: -1rem;
`;
const Size = styled.p`
  font-size: 14px;
  font-weight: 500;
  /* color: var(--clr-gray); */
  margin-top: 0.5rem;
`;

const Qty = styled.p`
  font-size: 14px;
  font-weight: 500;
`;

const Price = styled.h2`
  color: var(--clr-red);
  align-self: end;
  margin-right: 2rem;
  ${mobile({
    margin: '0.5rem',
    padding: '0',
  })}
`;

const PriceContainer = styled.div`
  display: ${(props) => (props.historyPage ? 'none' : 'flex')};
  width: 10%;
  margin-top: 0.5rem;
  flex-direction: column;
  justify-content: space-around;

  .icon {
    transition: all 0.3s;
    color: var(--clr-gray);
    cursor: pointer;
    font-size: 22px;
    &:hover {
      color: red;
    }
  }
`;

const SaleInfo = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--clr-border);
  width: 60%;
  padding-top: 1rem;
  padding-left: 1rem;
  h4 {
  }
  .info {
    display: flex;
    width: 85%;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .rating-container {
    display: flex;
    width: 95%;
    justify-content: space-between;
    h3 {
      font-weight: 600;
    }
  }
`;
