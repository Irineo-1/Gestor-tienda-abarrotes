import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDetallesCompra } from "../interfaces/IDetallesCompra";
import { RootState } from "./store";

const initialState: IDetallesCompra = {
    precioTotal: 0.0,
    cantidadProductos: 0,
}

export const cuentaSlice = createSlice({
    name: 'cuenta',
    initialState,
    reducers: {
        setPrecioTotal: (state, action: PayloadAction<number>) => {
            state.precioTotal = action.payload
        },
        setCantidadProductos: (state, action: PayloadAction<number>) => {
            state.cantidadProductos = action.payload
        }
    }
})

export const { setPrecioTotal, setCantidadProductos } = cuentaSlice.actions
export const selectPrecioTotal = (state: RootState) => state.cuenta.precioTotal

export default cuentaSlice.reducer