import { createSelector } from "@ngrx/store";
import { AppStore } from "..";
import { Invoice } from "../../data/data";

export const selectInvoicesData = (appStore: AppStore) => appStore.invoices

export const selectAllInvoices = createSelector(
  selectInvoicesData,
  (store) => store
)

export const selectInvoice = (props: { id: string }) => {
  return createSelector(selectInvoicesData, (store) => store.find(item=>item.id===props.id) as Invoice);
};
