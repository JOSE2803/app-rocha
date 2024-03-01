import { Routes, Route, BrowserRouter } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";
import Home from "./pages/Home";
import Order from "./pages/Order/Order";
import Safra from "./pages/Safra/Safra"
import { SafraContextProvider } from "./context/SafraContext/SafraContext.jsx";


function Router() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<DefaultLayout />} >
               <Route path="/" element={<Home />} />
               <Route path="/order" element={<Order />} />
               <Route path="/safra" element={
                  <SafraContextProvider>
                     <Safra></Safra>
                  </SafraContextProvider>
               } />
            </Route>
         </Routes>
      </BrowserRouter>
   )
}

export default Router;