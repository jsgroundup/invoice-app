import { createReducer, on } from "@ngrx/store";
import Invoices, { Invoice } from "../../data/data";
import Actions from '../actions/invoices'

const data: Invoice[] = []
export const invoiceReducer = createReducer(
  data,
  on(Actions.addInitial, (store, { invoices }) => invoices),
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

  on(Actions.update, (store, { id, ...data }) => {
    const index = store.findIndex((data) => data.id === id);
    if (index >= 0) {
      return [
        ...store.slice(0, index),
        { ...data, id },
        ...store.slice(index + 1),
      ]
    }
    return store;
  }),
);
