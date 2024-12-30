import { createAction, props } from "@ngrx/store"
import { Invoice } from "../../data/data";

const getAction = (action: string)=> `[Invoice] ${action}`

export default {
  delete: createAction(getAction('delete'), props<{ id: string }>()),
  add: createAction(getAction('add'), props<Invoice>()),
};

