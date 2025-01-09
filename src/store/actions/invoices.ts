import { createAction, props } from "@ngrx/store"
import { Invoice } from "../../data/data";
import { Badges } from "../../app/status-badge/status-badge.component";

const getAction = (action: string)=> `[Invoice] ${action}`

export default {
  // Delete invoice
  delete: createAction(getAction('delete'), props<{ id: string }>()),

  // Add invoice
  add: createAction(getAction('add'), props<Invoice>()),

  // Update invoice
  update: createAction(getAction('update'), props<Invoice>()),

  // Update invoice status
  updateStatus: createAction(
    getAction('update status'),
    props<{ id: string; status: Badges }>()
  ),
};

