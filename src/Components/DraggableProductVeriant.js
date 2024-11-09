import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase-config';

const DraggableProductVariant = ({ items, variantStates, productListId, refresh, setRefresh }) => {
    const [reorderedItems, setReorderedItems] = useState(items.selectedList);
    const [tempData, setTempData] = useState([]);
    const productCollectionRef = collection(db, "selectedDataList");

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const updatedItems = Array.from(reorderedItems);
        const [movedItem] = updatedItems.splice(result.source.index, 1);
        updatedItems.splice(result.destination.index, 0, movedItem);
        setReorderedItems(updatedItems);
    };

    useEffect(() => {
        const getProduct = async () => {
            try {
                const data = await getDocs(productCollectionRef);
                const products = data.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTempData(products);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        getProduct();
    }, [items, refresh]);

    useEffect(() => {
        console.log("Open state changed:");
        setReorderedItems(items.selectedList);
    }, [items, refresh]);


    const RemoveProductPicker = async (product) => {
        const productDoc = doc(db, "selectedDataList", productListId);
        const filterValue = tempData.find(item => item.id === productListId);

        if (filterValue && product) {
            const updatedData = {
                ...filterValue,
                selectedList: filterValue.selectedList.filter(item => item.id !== product.id)
            };
            await updateDoc(productDoc, { selectedList: updatedData.selectedList });
            setRefresh(oldValue => !oldValue);
        }
    }

    return (
        <Grid container spacing={2} style={{ display: "flex", justifyContent: "flex-end" }}>
            {variantStates && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="variant-droppable" type="variant">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {reorderedItems.map((product, index) => (
                                    <Draggable key={product.id} draggableId={`product-${product.id}`} index={index}>
                                        {(provided) => (
                                            <Grid
                                                container
                                                spacing={2}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '20px',
                                                    gap: '20px',
                                                }}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Grid item xs={0.1}>
                                                    <InputAdornment position="start">
                                                        <DragIndicatorIcon sx={{ color: '#666', cursor: 'pointer' }} />
                                                    </InputAdornment>
                                                </Grid>
                                                <Grid item xs={6.8}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={product.title}
                                                        value={product.title}
                                                        fullWidth
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '0px',
                                                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                padding: '10px 14px',
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder="0"
                                                        sx={{
                                                            width: '100px',
                                                            mr: '10px',
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '150px',
                                                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                padding: '10px 14px',
                                                            },
                                                        }}
                                                    />
                                                    <Select
                                                        sx={{
                                                            width: '100px',
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '20px',
                                                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                padding: '10px 14px',
                                                            },
                                                        }}
                                                    >
                                                        <MenuItem value="%off">% off</MenuItem>
                                                        <MenuItem value="flatoff">flat off</MenuItem>
                                                    </Select>
                                                    <InputAdornment position="start">
                                                        <CloseIcon
                                                            sx={{ color: '#666', cursor: 'pointer' }}
                                                            onClick={() => RemoveProductPicker(product)}
                                                        />
                                                    </InputAdornment>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </Grid>
    );
};

export default DraggableProductVariant;
