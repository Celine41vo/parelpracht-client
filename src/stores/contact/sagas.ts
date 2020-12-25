import {
  call, put, select, throttle,
} from 'redux-saga/effects';
import {
  Client, Dir5, Contact, ContactParams,
} from '../../clients/server.generated';
import { takeEveryWithErrorHandling } from '../errorHandling';
import { errorSingle, setSingle } from '../single/actionCreators';
import {
  singleActionPattern, SingleActionType, SingleCreateAction, SingleFetchAction, SingleSaveAction,
} from '../single/actions';
import { SingleEntities } from '../single/single';
import { setSummaries } from '../summaries/actionCreators';
import { summariesActionPattern, SummariesActionType } from '../summaries/actions';
import { SummaryCollections } from '../summaries/summaries';
import { fetchTable, setTable } from '../tables/actionCreators';
import { tableActionPattern, TableActionType } from '../tables/actions';
import { getTable } from '../tables/selectors';
import { Tables } from '../tables/tables';
import { TableState } from '../tables/tableState';

function* fetchContacts() {
  const client = new Client();

  const state: TableState<Contact> = yield select(getTable, Tables.Contacts);
  const {
    sortColumn, sortDirection,
    take, skip,
    search,
  } = state;

  const { list, count } = yield call(
    [client, client.getAllContacts], sortColumn, sortDirection as Dir5,
    skip, take, search,
  );
  yield put(setTable(Tables.Contacts, list, count));
}

export function* fetchContactSummaries() {
  const client = new Client();
  const summaries = yield call([client, client.getContactSummaries]);
  yield put(setSummaries(SummaryCollections.Contacts, summaries));
}

function* fetchSingleContact(action: SingleFetchAction<SingleEntities.Contact>) {
  const client = new Client();
  const contact = yield call([client, client.getContact], action.id);
  yield put(setSingle(SingleEntities.Contact, contact));
}

function* saveSingleContact(
  action: SingleSaveAction<SingleEntities.Contact, ContactParams>,
) {
  const client = new Client();
  yield call([client, client.updateContact], action.id, action.data);
  const contact = yield call([client, client.getContact], action.id);
  yield put(setSingle(SingleEntities.Contact, contact));
}

function* errorSaveSingleContact() {
  yield put(errorSingle(SingleEntities.Contact));
}

function* watchSaveSingleContact() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contact, SingleActionType.Save),
    saveSingleContact,
    { onErrorSaga: errorSaveSingleContact },
  );
}

function* createSingleContact(
  action: SingleCreateAction<SingleEntities.Contact, ContactParams>,
) {
  const client = new Client();
  const contact = yield call([client, client.createContact], action.data);
  yield put(setSingle(SingleEntities.Contact, contact));
  yield put(fetchTable(Tables.Contacts));
}

function* errorCreateSingleContact() {
  yield put(errorSingle(SingleEntities.Contact));
}

function* watchCreateSingleContact() {
  yield takeEveryWithErrorHandling(
    singleActionPattern(SingleEntities.Contact, SingleActionType.Create),
    createSingleContact,
    { onErrorSaga: errorCreateSingleContact },
  );
}

export default [
  function* watchFetchContacts() {
    yield throttle(
      500,
      tableActionPattern(Tables.Contacts, TableActionType.Fetch),
      fetchContacts,
    );
  },
  function* watchFetchContactSummaries() {
    yield takeEveryWithErrorHandling(
      summariesActionPattern(
        SummaryCollections.Contacts,
        SummariesActionType.Fetch,
      ),
      fetchContactSummaries,
    );
  },
  function* watchFetchSingleContact() {
    yield takeEveryWithErrorHandling(
      singleActionPattern(SingleEntities.Contact, SingleActionType.Fetch),
      fetchSingleContact,
    );
  },
  watchSaveSingleContact,
  watchCreateSingleContact,
];