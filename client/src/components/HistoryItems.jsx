import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GET_SINGLE_PRODUCT } from '../graphql/Queries/productQueries';
import Stars from './Stars';
import moment from 'moment';
import { CREATE_REVIEW } from '../graphql/Mutations/productMutation';
import Loading from '../assets/mui/Loading';
import MuiError from '../assets/mui/Alert';
import { mobile } from '../responsive';
import { getImageForProduct, getDefaultImage } from '../utils/imageUtils';

const HistoryItems = ({ productId, datePurchased, size }) => {
  const [historyItems, setHistoryItems] = useState([]);
  const [userRates, setUserRates] = useState(0);
  const [success, setSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const getUserRates = (value) => {
    setUserRates(value + 1);
  };

  const [createReview, { error }] = useMutation(CREATE_REVIEW, {
    variables: { productId: productId, userRate: +userRates },
    onCompleted() {
      setSuccess(true);
      setUserRates(0);
    },
  });

  const { loading } = useQuery(GET_SINGLE_PRODUCT, {
    variables: { productId },
    onCompleted({ getProductById }) {
      setHistoryItems(getProductById);
    },
  });

  const { title, image, brand, rates, price } = historyItems;
  
  // Get appropriate image
  const productImage = title ? getImageForProduct(title) : getDefaultImage();
  const imageSource = imgError ? getDefaultImage() : image || productImage;

  return (
    <Wrapper>
      <Container>
        <ItemsContainer>
          <ImageContainer>
            <Image 
              src={imageSource} 
              alt={title || 'Sneaker image'}
              onError={() => setImgError(true)}
            />
          </ImageContainer>
          <InfoContainer>
            <Title>{title}</Title>
            <Brand>{brand}</Brand>
            <Size>{`Size: ${size}`}</Size>
            <Price>Price: ${price}</Price>
          </InfoContainer>
        </ItemsContainer>

        <SaleInfo>
          <SaleInfoTitle>Sale Info:</SaleInfoTitle>
          <Info>
            Date Purchased:
            <span>{moment(datePurchased).format('MMMM Do YYYY, h:mm a')}</span>
          </Info>
          <Info>
            Day: <span>{moment(datePurchased).format('dddd')}</span>
          </Info>
          {loading ? (
            <Loading />
          ) : error ? (
            <MuiError width='80%' type='error' value={error.message} />
          ) : success ? (
            <MuiError
              width='80%'
              type='success'
              value={'Thank you for your review!'}
            />
          ) : (
            <RatingContainer>
              <Rate>Rate</Rate>
              <Stars
                stars={rates}
                condition
                getUserRates={getUserRates}
                createReview={createReview}
                userRates={userRates}
              />
            </RatingContainer>
          )}
        </SaleInfo>
      </Container>
    </Wrapper>
  );
};

export default HistoryItems;

const Wrapper = styled.div``;
const Container = styled.div`
  display: flex;
  background-color: #fff;
  width: 100%;
  margin: 2rem 0 0;
  border-radius: 1rem;
  ${mobile({ flexDirection: 'column' })}
`;

const ItemsContainer = styled.div`
  display: flex;
  width: 80%;
  height: 25vh;
  justify-content: space-evenly;
  ${mobile({
    height: '30vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  })}
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  
  &:hover {
    transform: scale(1.05);
  }
  
  ${mobile({ width: '180px', height: '150px', marginTop: '15px' })}
`;

const InfoContainer = styled.div`
  width: 50%;
  margin-top: 0.5rem;
  ${mobile({ margin: '0', width: '90%' })}
`;

const Title = styled.h4``;
const Brand = styled.p`
  font-size: 14px;
  color: var(--clr-gray);
  margin-top: -1rem;
`;
const Size = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const Price = styled.h4`
  color: var(--clr-red);
`;

const SaleInfo = styled.div`
  ${mobile({ width: '100%', marginTop: '2rem', padding: '10px' })}
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--clr-border);
  width: 60%;
  padding-top: 0.5rem;
  padding-left: 1rem;
  h4 {
  }
  .info {
    display: flex;
    width: 100%;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  span {
    margin-left: 10px;
    font-weight: 400;
  }
`;

const SaleInfoTitle = styled.h4``;

const Info = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const RatingContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;
const Rate = styled.h3``;
