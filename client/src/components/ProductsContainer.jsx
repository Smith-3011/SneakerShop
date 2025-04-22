import React, { useState } from 'react';
import styled from 'styled-components';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Stars from './Stars';
import { Link } from 'react-router-dom';
import { mobile } from '../responsive';
import { getImageForProduct, getDefaultImage } from '../utils/imageUtils';

const ProductsContainer = ({ title, image, price, rates, id, brand }) => {
  const [imgError, setImgError] = useState(false);

  // Handle image error by setting error state to use fallback
  const handleImageError = () => {
    setImgError(true);
  };

  // Always prioritize getting the image based on the product title
  const productImage = title ? getImageForProduct(title) : getDefaultImage();

  // Determine which image source to use - prioritize our local images over server URLs
  const imageSource = imgError ? getDefaultImage() : productImage;
  
  // Debug logging to see what's happening
  console.log(`ProductsContainer: Title=${title}, Using image: ${imageSource}`);

  return (
    <>
      <Wrapper>
        <Link to={`/shop/${id}`}>
          <ImageContainer>
            <Image 
              src={imageSource}
              alt={title || 'Sneaker image'}
              onError={handleImageError}
            />
          </ImageContainer>

          <Title>{title}</Title>
        </Link>
        <InfoContainer>
          <RatesContainer>
            <Stars stars={rates} />
          </RatesContainer>
        </InfoContainer>

        <PriceContainer>
          <Link to={`/shop/${id}`}>
            <Button>
              Buy <AddShoppingCartIcon style={{ fontSize: '18px' }} />
            </Button>
          </Link>
          <Price>${price}</Price>
        </PriceContainer>
      </Wrapper>
    </>
  );
};

export default ProductsContainer;

const Wrapper = styled.div`
  background-color: #fff;
  border-radius: 16px;
  margin-right: 2rem;
  padding: 0px 1rem;
  width: 100%;
  margin-bottom: 2rem;
  ${mobile({ minWidth: '350px' })}
`;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 200px;
  padding: 1rem;
  align-items: center;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 12px;
  margin-top: 10px;
`;
const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  transition: transform 0.3s ease;
  display: block;
  margin: 0 auto;

  &:hover {
    transform: scale(1.05);
  }
`;
const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.p`
  color: var(--clr-primary);
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
  font-weight: 500;
  text-decoration: underline;
`;
const RatesContainer = styled.div`
  display: flex;
  align-items: center;
  color: var(--clr-primary);
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Button = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 4rem;
  background: none;
  border: 1px solid lightgray;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    color: black;
    background-color: var(--clr-mocha-hover);
  }
  padding: 0.4rem 0.4rem;
`;
const Price = styled.p`
  color: var(--clr-red);
  font-size: 22px;
`;