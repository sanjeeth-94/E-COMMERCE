import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';

const DraggableProduct = ({ selectedList, setSelectedList, discount, handleClickDiscount, toggleVariants, variantStates, handleClickOpen, setEditeList }) => {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedList = Array.from(selectedList);
        const [movedItem] = reorderedList.splice(result.source.index, 1);
        reorderedList.splice(result.destination.index, 0, movedItem);

        setSelectedList(reorderedList);
    };

    const EditData = (props) => {
        console.log("sanjeeth::EditData",props)
        return (
            <EditIcon 
                onClick={(event) => {
                    setEditeList(props.selectedRow);
                }}
            />
        );
    }

    console.log("sanjeeth::Draggable", selectedList)
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
                                                            <EditData selectedRow={item}  />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            {discount ? (
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
                                                    <CloseIcon sx={{ ml: '10px', cursor: 'pointer' }} onClick={handleClickDiscount} />
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        minWidth: '250px',
                                                        color: 'white',
                                                        backgroundColor: '#008060',
                                                        '&:hover': { backgroundColor: 'darkgreen' },
                                                    }}
                                                    onClick={handleClickDiscount}
                                                >
                                                    Add Discount
                                                </Button>
                                            )}
                                        </Grid>

                                        {selectedList[index]?.selectedList[0]?.variants && (
                                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                                                <Button
                                                    onClick={() => toggleVariants(index)}
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

                                        {variantStates[index] && item.selectedList && item.selectedList.map((product) => (
                                            <Grid item xs={9} key={product.id} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '20px' }}>
                                                <div>
                                                    <InputAdornment position="start">
                                                        <DragIndicatorIcon sx={{ color: '#666', cursor: 'pointer' }} />
                                                    </InputAdornment>
                                                </div>
                                                <div>
                                                    <TextField
                                                        variant="outlined"
                                                        placeholder={product.title}
                                                        value={product.title}
                                                        fullWidth
                                                        sx={{
                                                            minWidth: '550px',
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '20px',
                                                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                padding: '10px 14px',
                                                            },
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <InputAdornment position="start">
                                                        <CloseIcon sx={{ color: '#666', cursor: 'pointer' }} />
                                                    </InputAdornment>
                                                </div>
                                            </Grid>
                                        ))}
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
