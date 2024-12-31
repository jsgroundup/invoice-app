import { createReducer, on } from "@ngrx/store";
import Invoices, { Invoice } from "../../data/data";
import Actions from '../actions/invoices'

export const invoiceReducer = createReducer(
  Invoices,
  on(Actions.delete, (store, { id }) => {
    return store.filter((data) => data.id !== id);
  }),
  on(Actions.add, (store, data) => {
    return [data, ...store];
  }),
  on(Actions.updateStatus, (store, { id, status }) => {
    const index = store.findIndex((data) => data.id === id);
    if(index >=0) {
      return [...store.slice(0, index), { ...store[index], status }, ...store.slice(index + 1)] as Invoice[];
    }
    return store;
  }),
);
