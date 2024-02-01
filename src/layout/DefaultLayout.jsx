import { Outlet } from "react-router-dom";;

function DefaultLayout() {
    return (
        <>
            <h1>HEADER</h1>
            <Outlet />
        </>
    );
}

export default DefaultLayout;