import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { legacy_createStore as createStore, Reducer } from 'redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const initState: State = {
  userInfo: null,
  isLogin: false
}

interface State {
  userInfo: {
    id: string;
    name: string;
    role: string;
  } | null;
  isLogin: boolean;
}

interface Action {
  type: 'LOGIN';
  payload: {
    userInfo: {
      id: string;
      name: string;
      role: string;
    }
  }
}

const reducer: Reducer<State, Action> = (state = initState, action: Action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        userInfo: action.payload.userInfo,
        isLogin: true
      };
    default:
      return state;
  }
}
const store = createStore<State, Action>(reducer);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)