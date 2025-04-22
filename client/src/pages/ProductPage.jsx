import React, { useState } from 'react';
import { Navbar, Stars } from '../components';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SINGLE_PRODUCT } from '../graphql/Queries/productQueries';
import Loading from '../assets/mui/Loading';
import MuiError from '../assets/mui/Alert';
import styled from 'styled-components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ADD_TO_CART } from '../graphql/Mutations/cartMutations';
import { useDispatch, useSelector } from 'react-redux';
import { GET_USER_CART } from '../graphql/Queries/cartQueries';
import { mobile } from '../responsive';
import { getImageForProduct, getDefaultImage } from '../utils/imageUtils';

const ProductPage = () => {
  const [product, setProduct] = useState('');
  const [shoeSize, setShoeSize] = useState([]);
  const [success, setSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  const userInfo = useSelector((state) => state.user.userInfo);

  const { id } = useParams();
  const navigate = useNavigate();

  const userId = userInfo?.id;

  const { loading, data, error } = useQuery(GET_SINGLE_PRODUCT, {
    variables: { productId: id },
    pollInterval: 1000,
  });

  const { data: cart } = useQuery(GET_USER_CART, {
    variables: { userId: userInfo?.id },
  });

  const [cartHandle, { loading: cartLoading, error: cartError }] = useMutation(
    ADD_TO_CART,
    {
      onCompleted() {
        setShoeSize([]);
        setSuccess(true);
      },
      variables: {
        userId,
        productId: id,
        size: shoeSize,
        productPrice: data?.getProductById?.price,
      },
      refetchQueries: [
        {
          query: GET_USER_CART,
          variables: { userId },
          awaitRefetchQueries: true,
        },
      ],
    }
  );

  useEffect(() => {
    if (data?.getProductById) {
      setProduct(data.getProductById);
    }
  }, [data]);

  const handleImageError = () => {
    setImgError(true);
  };

  const addShoeSize = (size) => {
    if (shoeSize.includes(size)) {
      setShoeSize(shoeSize.filter((sz) => sz !== size));
    } else {
      setShoeSize([...shoeSize, size]);
    }
  };

  const addToCartHandler = () => {
    if (!userInfo) {
      alert('You must be logged in to add this item to your cart.');
      navigate('/login');
      return;
    }

    if (userInfo) {
      if (shoeSize.length > 0) {
        cartHandle();
      } else {
        alert('Please select a size');
      }
    }
  };

  const { title, price, rates, inStock, brand, model, size } = product;
  
  // Always prioritize getting the image based on the product title - just like in ProductsContainer
  const productImage = title ? getImageForProduct(title) : getDefaultImage();
  
  // Determine which image source to use - prioritize our local images
  const imageSource = imgError ? getDefaultImage() : productImage;
  
  // Debug logging
  console.log(`ProductPage: Title=${title}, Using image: ${imageSource}`);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <MuiError
          type='error'
          value={'Error occured, Please refresh and try again!'}
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ProductContainer>
        <ImageContainer>
          <Image 
            src={imageSource} 
            alt={title || 'Sneaker image'}
            onError={handleImageError}
          />
        </ImageContainer>
        <InfoContainer>
          <Title>{title}</Title>
          <Stars stars={rates} />
          <Info>
            Model: <span>{model}</span>
          </Info>
          <Info>
            Status: <span>{inStock ? 'In Stock' : 'Out Of Stock'}</span>
          </Info>
          <Info>
            Brand: <span>{brand}</span>
          </Info>

          <Price>${price}</Price>
          <Lorem>
            Sneakers blend comfort, performance, and street-ready style, making them an essential for everyday wear. Crafted with precision and designed for impact, each pair offers a unique identity for modern sneakerheads.
          </Lorem>

          <SizeContainer>
            {size?.map((shoe) => (
              <SizeButton
                key={`size-${shoe}`}
                disabled={cartLoading}
                onClick={() => addShoeSize(shoe)}
                className={shoeSize.includes(shoe) ? 'active' : ''}
              >
                {shoe}
              </SizeButton>
            ))}
          </SizeContainer>

          {cartError && (
            <MuiError
              type='error'
              value={'Something went wrong when adding this item to your cart.'}
            />
          )}
          {success && !cartError && (
            <MuiError
              type='success'
              value={'Added successfully to your cart!'}
            />
          )}
          <Button
            className={!inStock ? 'btn-disabled' : ''}
            disabled={!inStock || cartLoading}
            onClick={addToCartHandler}
          >
            Add To Cart
          </Button>
          <div>
            <Link to='/'>Back to home page</Link>
          </div>
        </InfoContainer>
      </ProductContainer>
    </>
  );
};

export default ProductPage;

const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  gap: 2rem;
  
  .btn-disabled {
    background-color: #666565;
    &:hover {
      background-color: #666565;
    }
  }
  
  ${mobile({ 
    width: '95%', 
    padding: '1rem 0.5rem',
    gap: '1rem' 
  })}
`;

const Button = styled.button`
  background-color: var(--clr-mocha-3);
  color: white;
  border-radius: 5px;
  padding: 0.375rem 0.75rem;
  margin-top: 3rem;
  letter-spacing: 1.5px;
  font-size: 14px;
  transition: all 0.3s;
  border: 1px solid black;
  cursor: pointer;
  &:hover {
    background-color: var(--clr-mocha-2);
  }
`;

const ImageContainer = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  margin: 10px;
  padding: 10px;
  overflow: hidden;
  height: 350px;
  max-width: 450px;
  
  ${mobile({ height: '300px', maxWidth: '100%' })}
`;

const Image = styled.img`
  width: auto;
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  ${mobile({ maxHeight: '260px' })}
`;

const InfoContainer = styled.div`
  flex: 3;
  padding: 0 1rem;
  
  .active {
    border: 1px solid black;
  }
  
  ${mobile({ 
    flex: '1 1 100%',
    padding: '0 0.5rem' 
  })}
`;

const Title = styled.h1`
  color: var(--clr-primary);
  font-size: 36px;
  ${mobile({ fontSize: '24px' })}
`;

const Price = styled.p`
  color: var(--clr-mocha-2);
  font-size: 22px;
`;

const Lorem = styled.p`
  letter-spacing: 1px;
  line-height: 1.5rem;
  ${mobile({ marginBottom: '2rem' })}
`;

const Info = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr;
  width: 100%;
  align-items: center;
  margin-bottom: 2rem;
  font-weight: 600;
  span {
    font-weight: 400;
  }
`;

const SizeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const SizeButton = styled.button`
  background-color: transparent;
  outline: none;
  margin-left: 0.5rem;
  color: black;
  font-weight: 500;
  font-size: 16px;
  padding: 15px 20px;
  margin-bottom: 10px;
  border: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  :hover {
    border: 1px solid black;
  }
  :disabled {
    color: #b6b6b6;
    border: none;
    pointer-events: none;
  }

  :checked {
    border: 1px solid black;
  }
`;
