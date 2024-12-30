import { createSelector } from "@ngrx/store";
import { AppStore } from "..";

export const selectInvoicesData = (appStore: AppStore) => appStore.invoices

export const selectAllInvoices = createSelector(
  selectInvoicesData,
  (store) => store
)
