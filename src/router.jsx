import { Routes, Route, BrowserRouter } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import Home from "./pages/Home";
import Order from "./pages/Order/Order";


function Router() {
    return(
        <BrowserRouter>
           <Routes>
              <Route path="/" element={<DefaultLayout/>} >
                 <Route path="/" element={<Home />} />
                 <Route path="/order" element={<Order />} />
              </Route>
           </Routes>
        </BrowserRouter>
     )
}

export default Router;