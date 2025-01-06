import { configureStore } from '@reduxjs/toolkit'
import counterReduce from '@/app/redux/counterSlice'
import cuentaReducer from './Compra'

export const store = configureStore({
  reducer: {
    counter: counterReduce,
    cuenta: cuentaReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
