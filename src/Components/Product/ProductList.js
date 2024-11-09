import React, { useEffect, useState } from 'react';
import { Typography, Button, TextField, InputAdornment, Grid, Select, MenuItem } from '@mui/material';
import { useDrag, useDrop } from 'react-dnd';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ProductPicker from './ProductPicker';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { db } from '../../Firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import Divider from '@mui/material/Divider';
import DraggableProduct from '../DraggableProduct';

const ProductList = () => {
  const productSelectedListnRef = collection(db, "selectedDataList");
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  // const [discount, setDiscount] = useState(false);
  const [productCount, setProductCount] = useState([1]);
  const [productItems, setProductItems] = useState(productCount);
  const [editeList, setEditeList] = useState([]);

  const [selectedList, setSelectedList] = useState([]);
  const [variantStates, setVariantStates] = useState([]);
  const [discount, setDiscount] = useState(false); // For adding discount logic

  // Function to add a new product
  const tempProduct = {
    id: `tempvale${selectedList.length + 1}`,
    selectedList: [
      {
        image: {
          product_id: `77${selectedList.length + 1}`,
          src: " ",
          id: "266"
        },
        // variants: [
        //   {
        //     id: selectedList.length + 1,
        //     product_id: selectedList.length + 1,
        //     price: "00",
        //     title: "temp"
        //   }
        // ],
        title: "Select product",
        id: selectedList.length + 1
      }
    ]
  };

  const addProduct = () => {
    setSelectedList(prevList => [...prevList, tempProduct]);
  };
  // console.log("addProduct==>",variantStates, )

  const handleClickDiscount = () => setDiscount(!discount);
  const toggleVariants = (index) => {
    const newVariantStates = [...variantStates];
    newVariantStates[index] = !newVariantStates[index];
    setVariantStates(newVariantStates);
  };

  // const toggleVariants = (index) => {
  //   setVariantStates((prevState) => {
  //     const newState = [...prevState];
  //     newState[index] = !newState[index]; // Toggle the state for the specific item
  //     return newState;
  //   });
  // };


  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await getDocs(productSelectedListnRef);
        const products = data.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSelectedList(products);

      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    getProduct();
    console.log("sanjeeth::editeList", editeList)
  }, [editeList, open, refresh]);

  useEffect(() => {
    const newCount = Array.from({ length: selectedList.length }, (_, i) => i + 1);
    setProductCount(newCount);
  }, [selectedList]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  // const handleClickDiscount = () => {
  //   setDiscount((prev) => !prev);
  // };

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...productItems];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setProductItems(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={2} sx={{ padding: '100px' }}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ marginLeft: '50px' }}>
            Add Products
          </Typography>
        </Grid>
        <Grid container spacing={2} sx={{ padding: '25px' }}>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ marginLeft: '100px' }}>
              Product
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ marginLeft: '10px' }}>
              Discount
            </Typography>
          </Grid>
          <Divider variant="fullWidth" sx={{ my: 1 }} />

          <Grid item xs={7}>
            <DraggableProduct
              selectedList={selectedList}
              setSelectedList={setSelectedList}
              discount={discount}
              handleClickDiscount={handleClickDiscount}
              toggleVariants={toggleVariants}
              variantStates={variantStates}
              handleClickOpen={handleClickOpen}
              setEditeList={setEditeList}
              open={open}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              variant="outlined"
              sx={{ color: '#008060', borderColor: '#008060', width: '300px' }}
              onClick={addProduct}
            >
              Add Product
            </Button>
          </Grid>
        </Grid>
        <ProductPicker
          open={open}
          setOpen={setOpen}
          editeList={editeList}
        />
      </Grid>
    </DndProvider>
  );
};

export default ProductList;
