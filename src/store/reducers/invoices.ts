import { createReducer, on } from "@ngrx/store";
import Invoices from "../../data/data";
import Actions from '../actions/invoices'

export const invoiceReducer = createReducer(
  Invoices,
  on(Actions.delete, (store, { id }) => {
    return store.filter((data) => data.id !== id);
  }),
  on(Actions.add, (store, data) => {
    return [data, ...store];
  })
);
