import React, { useState } from 'react';
import styled from 'styled-components';
import StarIcon from '@mui/icons-material/Star';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link } from 'react-router-dom';
import { getImageForProduct, getDefaultImage } from '../utils/imageUtils';
import { mobile } from '../responsive';

const ListView = ({ data, filteredProducts }) => {
  // Use a state object to track image errors for each product by ID
  const [imgErrors, setImgErrors] = useState({});
  
  // Handle image error for a specific product ID
  const handleImageError = (productId) => {
    setImgErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };
  
  return (
    <Wrapper>
      {filteredProducts?.map((product) => {
        const { title, image, price, rates, id } = product;
        
        // Always prioritize the local assets over the server image
        const productImage = title ? getImageForProduct(title) : getDefaultImage();
        const imageSource = imgErrors[id] ? getDefaultImage() : productImage;

        return (
          <ProductContainer key={id}>
            <ImageContainer>
              <Image 
                src={imageSource} 
                alt={title || 'Sneaker image'}
                onError={() => handleImageError(id)}
              />
            </ImageContainer>
            <InfoContainer>
              <Title>{title}</Title>

              <Price>${price}</Price>
              <RatesContainer>
                <StarIcon style={{ width: '8%' }} /> {rates}
                /5.0
              </RatesContainer>
            </InfoContainer>
            <ButtonContainer>
              <Link to={`/shop/${id}`}>
                <Button>
                  Buy
                  <AddShoppingCartIcon
                    style={{ color: 'var(--clr-primary)', fontSize: '18px' }}
                  />
                </Button>
              </Link>
            </ButtonContainer>
          </ProductContainer>
        );
      })}
    </Wrapper>
  );
};

export default ListView;

const Wrapper = styled.div`
  margin-left: 3rem;
  margin-top: 1.5rem;
`;
const ProductContainer = styled.div`
  display: flex;
  background-color: white;
  margin-bottom: 1.5rem;
  border-radius: 16px;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

const ImageContainer = styled.div`
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 12px;
  margin: 10px;
  overflow: hidden;
  height: 200px;
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.h3`
  text-decoration: underline;
`;
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30%;
`;

const RatesContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;
const Price = styled.span`
  color: var(--clr-red);
  font-size: 22px;
  margin-bottom: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
  .details-icon {
    font-size: 16px;
    color: var(--clr-primary);
  }
`;
const Button = styled.button`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: none;
  border: 1px solid lightgray;
  border-radius: 8px;
  font-weight: 600;
  margin-right: 1rem;
  margin-top: 1rem;
  width: 5rem;
  height: 5vh;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: var(--clr-mocha-2);
  }
`;
