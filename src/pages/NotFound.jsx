import Title from "../components/atoms/Title";
import styled from "styled-components";

function NotFound() {
    return ( 
        <StyledDiv>
            <h1>Error: 404. Página no encontrada</h1>
        </StyledDiv>
        
    );
}

const StyledDiv=styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(29, 78, 216);
    font-size: 2rem;
`

export default NotFound;
