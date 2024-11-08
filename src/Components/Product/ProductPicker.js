import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box, Checkbox, FormControlLabel, Paper, Divider, Avatar, TextField, InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase-config';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Stack from '@mui/material/Stack';
import NotificationBar from '../ServiceNotificationBar';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.grey[50],
}));

const ProductPicker = ({ open, setOpen, editeList }) => {
  const productCollectionRef = collection(db, "productList");
  const selectedCollectionRef = collection(db, "selectedDataList");
  const [productList, setProductList] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updateProduct, seUpdatetProduct] = useState("");
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  useEffect(() => {
    if (editeList && open) {
      const textOnly = editeList?.id.replace(/[0-9]/g, '');
      console.log("editeListediteList==>", textOnly);
      seUpdatetProduct(textOnly);
    }
  }, [editeList])



  const handleClose = () => {
    setOpen(false);
    setSelectedItems([]);
    
  };


  const notificationhandleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };
  // Fetch products from Firestore
  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await getDocs(productCollectionRef);
        const products = data.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductList(products);

        // Initialize checkedState based on fetched productList
        const initialCheckedState = products.map(product => ({
          checked: false,
          variants: product.variants?.map(() => ({ checked: false })) || [],
        }));
        setCheckedState(initialCheckedState);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    getProduct();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const createProductPicker = async () => {
    if (selectedItems.length > 0) {
      if (updateProduct === "tempvale") {
        await addDoc(selectedCollectionRef, { selectedList: selectedItems });
        setNotification({
          status: true,
          type: 'success',
          message: "Add Succefully..",
        });
        setTimeout(() => {
          notificationhandleClose();
          handleClose();
        }, 3000);
      } else {
        const productDoc = doc(db, "selectedDataList", editeList.id);
        await updateDoc(productDoc, { selectedList: selectedItems });
        setNotification({
          status: true,
          type: 'success',
          message: "Updated Succefully..",
        });
        setTimeout(() => {
          notificationhandleClose();
          handleClose();
        }, 3000);
      }
    } else {
      console.log("Please select the product");
    }
  };

  // Filtered product list based on search term
  const filteredProductList = productList.filter(product =>
    product.title.toLowerCase().includes(searchTerm)
  );

  // Handle main product checkbox change
  const handleChangeMain = (idx) => {
    const updatedState = [...checkedState];
    updatedState[idx].checked = !updatedState[idx].checked;
    if (updatedState[idx].checked) {
      setSelectedItems(prev => [...prev, productList[idx]]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== productList[idx]));
    }
    setCheckedState(updatedState);
  };

  // Handle variant checkbox change
  const handleChangeVariant = (itemIdx, variantIdx) => {
    const updatedState = [...checkedState];
    updatedState[itemIdx].variants[variantIdx].checked = !updatedState[itemIdx].variants[variantIdx].checked;
    const selectedVariants = productList[itemIdx].variants.filter((_, idx) => updatedState[itemIdx].variants[idx].checked);
    const updatedItem = { ...productList[itemIdx], variants: selectedVariants };
    setSelectedItems(prev => {
      const withoutCurrentItem = prev.filter(item => item.id !== updatedItem.id);
      return selectedVariants.length ? [...withoutCurrentItem, updatedItem] : withoutCurrentItem;
    });
    setCheckedState(updatedState);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
      >
        <StyledPaper>
          <DialogTitle sx={{ m: 0, p: 2, fontSize: '1.25rem', fontWeight: 'bold' }} id="customized-dialog-title">
            Select Products
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              variant="outlined"
              placeholder="Search Product"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange} // Handle search input change
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiOutlinedInput-input': {
                  padding: '10px 14px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ cursor: 'pointer' }}>
                    <SearchIcon style={{ color: '#666' }} />
                  </InputAdornment>
                ),
                style: {
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                },
              }}
            />
            <Divider variant="fullWidth" sx={{ my: 1 }} />
            {filteredProductList.map((product, idx) => (
              <React.Fragment key={product.id}>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={checkedState[idx]?.checked || false}
                    indeterminate={
                      !checkedState[idx]?.checked &&
                      checkedState[idx]?.variants?.some(variant => variant.checked)
                    }
                    onChange={() => handleChangeMain(idx)}
                  />
                  <Avatar
                    sx={{ marginRight: '10px', borderRadius: '4px' }}
                    src={product.image?.src}
                    variant="square"
                  />
                  <Typography variant="subtitle1">{product.title}</Typography>
                </Box>
                {product.variants?.map((variant, variantIdx) => (
                  <Box key={variant.id} ml={4}>
                    <Divider variant="fullWidth" sx={{ my: 1 }} />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkedState[idx]?.variants[variantIdx]?.checked || false}
                          onChange={() => handleChangeVariant(idx, variantIdx)}
                        />
                      }
                      label={variant.title}
                    />
                  </Box>
                ))}
                <Divider variant="fullWidth" sx={{ my: 1 }} />
              </React.Fragment>
            ))}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose} sx={{ color: 'black', borderColor: 'black' }}>
              Cancel
            </Button>
            <Button variant="contained" sx={{ fontWeight: 'bold', backgroundColor: '#008060' }} onClick={createProductPicker}>
              Add
            </Button>
          </DialogActions>
        </StyledPaper>
      </BootstrapDialog>
      <NotificationBar
        handleClose={notificationhandleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </React.Fragment>
  );
};

export default ProductPicker;
