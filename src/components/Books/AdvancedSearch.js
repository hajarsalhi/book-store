import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Rating,
  Collapse,
  IconButton,
  Grid,
  Autocomplete,
  Chip,
  Stack
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { bookAPI } from '../../services/api';

const AdvancedSearch = ({ onSearch, categories }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 200],
    title: '',
    category: [],
    author: '',
    publicationDate: null,
    rating: 0,
    inStock: false
  });

  useEffect(() => {
    const fetchTitleSuggestions = async () => {
      if (filters.title.length > 2) {
        try {
          const response = await bookAPI.searchBooks(`title=${filters.title}`);
          const suggestions = response.data.map(book => book.title);
          setTitleSuggestions([...new Set(suggestions)]);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setTitleSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchTitleSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters.title]);

  const handlePriceChange = (event, newValue) => {
    setFilters({ ...filters, priceRange: newValue });
  };

  const handleChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
  };

  const handleDateChange = (newValue) => {
    setFilters({ ...filters, publicationDate: newValue });
  };

  const handleRatingChange = (event, newValue) => {
    setFilters({ ...filters, rating: newValue });
  };

  const handleStockChange = (event) => {
    setFilters({ ...filters, inStock: event.target.checked });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      priceRange: [0, 200],
      title: '',
      category: [],
      author: '',
      publicationDate: null,
      rating: 0,
      inStock: false
    });
    setSelectedCategories([]);
    onSearch({});
  };

  const handleTitleChange = (event, newValue) => {
    setFilters({ ...filters, title: newValue || '' });
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategories(newValue);
    setFilters(prev => ({ ...prev, category: newValue }));
  };

  return (
    <Paper sx={{ p: 2, mb: 3, backgroundColor: '#FFF8DC' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#2C1810' }}>
          Advanced Search
        </Typography>
        <Box>
          <IconButton onClick={() => setShowFilters(!showFilters)} sx={{ color: '#8B4513' }}>
            <FilterListIcon />
          </IconButton>
          <IconButton onClick={handleClear} sx={{ color: '#8B4513' }}>
            <ClearIcon />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              freeSolo
              options={titleSuggestions}
              value={filters.title}
              onChange={handleTitleChange}
              onInputChange={(event, newValue) => {
                setFilters({ ...filters, title: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Title"
                  fullWidth
                  sx={{
                    backgroundColor: '#FFF8DC',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8B4513'
                    }
                  }}
                />
              )}
              ListboxProps={{
                sx: {
                  maxHeight: '200px',
                  backgroundColor: '#FFF8DC',
                  '& .MuiAutocomplete-option': {
                    '&:hover': {
                      backgroundColor: 'rgba(139, 69, 19, 0.1)'
                    }
                  }
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom sx={{ color: '#2C1810' }}>
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={200}
              sx={{
                color: '#8B4513',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#FFF8DC',
                  border: '2px solid #8B4513'
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={categories || []}
              value={selectedCategories}
              onChange={handleCategoryChange}
              getOptionLabel={(option) => option.charAt(0).toUpperCase() + option.slice(1)}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categories"
                  fullWidth
                  sx={{
                    backgroundColor: '#FFF8DC',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#8B4513'
                    }
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    label={option.charAt(0).toUpperCase() + option.slice(1)}
                    sx={{
                      backgroundColor: '#8B4513',
                      color: '#FFF8DC',
                      '& .MuiChip-deleteIcon': {
                        color: '#FFF8DC',
                        '&:hover': {
                          color: '#DEB887'
                        }
                      }
                    }}
                  />
                ))
              }
              renderOption={(props, option) => (
                <li {...props}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#8B4513',
                        mr: 1
                      }}
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Stack>
                </li>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Author"
              value={filters.author}
              onChange={handleChange('author')}
              sx={{
                backgroundColor: '#FFF8DC',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#8B4513'
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Publication Date"
                value={filters.publicationDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{
                      backgroundColor: '#FFF8DC',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#8B4513'
                      }
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography component="legend" sx={{ color: '#2C1810' }}>
              Minimum Rating
            </Typography>
            <Rating
              value={filters.rating}
              onChange={handleRatingChange}
              sx={{
                color: '#8B4513',
                '& .MuiRating-iconEmpty': {
                  color: '#DEB887'
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.inStock}
                  onChange={handleStockChange}
                  sx={{
                    color: '#8B4513',
                    '&.Mui-checked': {
                      color: '#8B4513'
                    }
                  }}
                />
              }
              label="In Stock Only"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                fullWidth
                sx={{
                  backgroundColor: '#8B4513',
                  '&:hover': {
                    backgroundColor: '#654321'
                  }
                }}
              >
                Apply Filters ({Object.values(filters).filter(value => 
                  value !== '' && value !== null && 
                  (Array.isArray(value) ? value.some(v => v !== 0) : value !== 0) && 
                  value !== false
                ).length} active)
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                sx={{
                  borderColor: '#8B4513',
                  color: '#8B4513',
                  '&:hover': {
                    borderColor: '#654321',
                    backgroundColor: 'rgba(139, 69, 19, 0.1)'
                  }
                }}
              >
                Clear All
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default AdvancedSearch; 