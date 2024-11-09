import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DraggableProductVeriant from './DraggableProductVeriant';
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../Firebase-config';

const DraggableProduct = ({ selectedList, setSelectedList, toggleVariants, variantStates, handleClickOpen, setEditeList, open, refresh, setRefresh }) => {

    const [productListId, setProductListId] = useState("");

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedList = Array.from(selectedList);
        const [movedItem] = reorderedList.splice(result.source.index, 1);
        reorderedList.splice(result.destination.index, 0, movedItem);
        setSelectedList(reorderedList);
    };

    const toggleDiscount = (index) => {
        const updatedList = selectedList.map((item, i) =>
            i === index ? { ...item, discount: !item.discount } : item
        );
        setSelectedList(updatedList);
    };

    const RemoveProdcut = async (item) => {
        const productDoc = doc(db, "selectedDataList", item.id);
        await deleteDoc(productDoc);
        setRefresh(oldValue => !oldValue);
    };

    useEffect(() => {
        console.log("Open state changed:", open);
    }, [open, selectedList, refresh]);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-list">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {selectedList.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                {(provided) => (
                                    <Grid
                                        container
                                        spacing={2}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            padding: '5px',
                                            ...provided.draggableProps.style,
                                        }}
                                    >
                                        <Grid item xs={12} md={9} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <InputAdornment position="start">
                                                <DragIndicatorIcon sx={{ color: '#666', cursor: 'pointer' }} />
                                            </InputAdornment>
                                            <span style={{ marginRight: '10px' }}>{index + 1}</span>
                                            <TextField
                                                variant="outlined"
                                                placeholder="Select Product"
                                                fullWidth
                                                value={item?.selectedList[0]?.title || "Select Product"}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '0px',
                                                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                                    },
                                                    '& .MuiOutlinedInput-input': {
                                                        padding: '10px 14px',
                                                    },
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={handleClickOpen}>
                                                            <EditIcon onClick={() => setEditeList(item)} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            {item.discount ? (
                                                <div sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder="0"
                                                        sx={{
                                                            width: '80px',
                                                            mr: '10px',
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '0px',
                                                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                padding: '10px 14px',
                                                            },
                                                        }}
                                                    />
                                                    <Select
                                                        sx={{
                                                            width: '80px',
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '0px',
                                                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                padding: '10px 14px',
                                                            },
                                                        }}
                                                    >
                                                        <MenuItem value="%off">% off</MenuItem>
                                                        <MenuItem value='flatoff'>flat off</MenuItem>
                                                    </Select>
                                                    <CloseIcon sx={{ ml: '10px', cursor: 'pointer' }} onClick={() => toggleDiscount(index)} />
                                                </div>
                                            ) : (
                                                <Grid style={{ display: "flex", alignItems: "center" }}>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            minWidth: '200px',
                                                            color: 'white',
                                                            backgroundColor: '#008060',
                                                            '&:hover': { backgroundColor: 'darkgreen' },
                                                        }}
                                                        onClick={() => toggleDiscount(index)}
                                                    >
                                                        Add Discount
                                                    </Button>
                                                    <CloseIcon sx={{ ml: '10px', cursor: 'pointer' }} onClick={() => RemoveProdcut(item)} />
                                                </Grid>
                                            )}
                                        </Grid>
                                        {item?.selectedList[0]?.variants && (
                                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                                                <Button
                                                    onClick={() => {
                                                        toggleVariants(index)
                                                        setProductListId(item.id);
                                                    }}
                                                    variant="text"
                                                    sx={{ textDecoration: 'underline' }}
                                                >
                                                    {variantStates[index] ? (
                                                        <>
                                                            Hide Variants <KeyboardArrowUpIcon />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Show Variants <ExpandMoreIcon />
                                                        </>
                                                    )}
                                                </Button>
                                            </Grid>
                                        )}
                                        <Grid item xs={12} md={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <DraggableProductVeriant
                                                items={item}
                                                variantStates={variantStates[index]}
                                                productListId={productListId}
                                                refresh={refresh}
                                                setRefresh={setRefresh}
                                            />
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
    );
}

export default DraggableProduct;
