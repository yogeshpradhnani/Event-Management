import React from "react";
import Header from "./Header";
import UpcomingEvents from "./UpcomingEvents";
import CreateEvent from "./CreateEvent";
import { Container } from "react-bootstrap";


export default function HomePage() {

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === 'admin';
    console.log(isAdmin);
    
  return (
   <>
   <Header />
   <UpcomingEvents />
   {isAdmin ?(
    
       <Container className="my-5">
       <CreateEvent />
          
       </Container>
   ):<> </>
}

   </>
  );
}
