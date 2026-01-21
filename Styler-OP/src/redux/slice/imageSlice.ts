import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { TransformImageResponseSchema, type HistoryItem, type ImageState, type StyleType } from "../../types/images.types";
import imageApi from '../../api/images.api';
import z from "zod";


const initialState: ImageState = {
  transformedImage: null,
  originalImage: null,
  currentResponse: null,
  history: [],
  isLoading: false,
  error: null,
};

export const transformImage = createAsyncThunk(
  "images/transform",
  async (
    {file, style}:{file:File,style:StyleType},{rejectWithValue}
  ) => {
    try {
      const response = await imageApi.transformImage(file,style);

      
      const validateResponse = TransformImageResponseSchema.parse(response);

      return {
        response:validateResponse,
        originalImageUrl:URL.createObjectURL(file)
      };
    } catch (error:any) {
      if (error instanceof z.ZodError) {
        return rejectWithValue('Invalid data received from server');
      }
      
      // Handle API errors
      if (error.response?.data?.detail) {
        return rejectWithValue(error.response.data.detail);
      }
      
      return rejectWithValue(error.message || 'Failed to transform image');
    }
  }
)

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetTransform: (state) => {
      state.transformedImage = null;
      state.originalImage = null;
      state.currentResponse = null;
      state.error = null;
    },
    addToHistory: (state , action:PayloadAction<HistoryItem>) => {
      state.history = [action.payload , ...state.history ].slice(0,20);
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
  extraReducers:(builder) => {
    builder
      .addCase(transformImage.pending , (state) => {
        state.isLoading = true,
        state.error = null
      })
      .addCase(transformImage.fulfilled , (state , action) => {
        state.isLoading = false;
        state.transformedImage = action.payload.response.transformed_image;
        state.originalImage = action.payload.originalImageUrl;
        state.currentResponse = action.payload.response;
        state.error = null;

        const historyItem: HistoryItem = {
          id : Date.now().toString(),
          createdAt : action.payload.response.created_at,
          originalImage : action.payload.originalImageUrl,
          style : action.payload.response.style,
          transformedImage : action.payload.response.transformed_image
        };
        state.history = [historyItem, ...state.history].slice(0, 20); 
      })
      .addCase(transformImage.rejected , (state , action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Transformation failed';
      })
  }
})

export const {  clearError, setError, resetTransform, addToHistory, clearHistory} = imageSlice.actions;
export default imageSlice.reducer;