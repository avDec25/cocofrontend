import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import reportWebVitals from './reportWebVitals';
import CocoApp from './routes/CocoApp';

import Customers from './routes/customers/Customers';
import Drops from './routes/drops/Drops';
import Orders from './routes/orders/Orders';
import Items from './routes/items/Items';

const router = createBrowserRouter([
  {
    path: "/",
    element: <CocoApp />,
    children: [
      {
        path: "customers",
        element: <Customers />
      },
      {
        path: "drops",
        element: <Drops />
      },
      {
        path: "items",
        element: <Items />
      },
      {
        path: "orders",
        element: <Orders />
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
