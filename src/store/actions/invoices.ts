import { createAction, props } from "@ngrx/store"
import { Invoice } from "../../data/data";
import { Badges } from "../../app/status-badge/status-badge.component";

const getAction = (action: string)=> `[Invoice] ${action}`

export default {
  delete: createAction(getAction('delete'), props<{ id: string }>()),
  add: createAction(getAction('add'), props<Invoice>()),
  updateStatus: createAction(getAction('update status'), props<{ id: string, status: Badges }>()),
};

