import styled from 'styled-components';
import * as colors from '../../config/colors';

export const List = styled.div`
  display: flex;
  flex-direction: column;

  button {
    cursor: pointer;
    color: #000;
    padding: 10px 20px;
    border-radius: 0;
    font-weight: 700;
    transition: all 300ms;
    max-width: 500px;
  }
  button + button {
    cursor: pointer;
    color: #000;

    border-radius: 0;
    padding: 10px 20px;
    font-weight: 700;
    transition: all 300ms;
    max-width: 500px;
  }
  button:hover {
    filter: brightness(90%);
  }
`;
export const CardBox = styled.section`
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`;
export const CardHeader = styled.div`
  padding: 10px;
  flex: 1;
  span {
    font-weight: bold;
    color: white;
  }
`;
export const CardBody = styled.div`
  padding: 10px;

  display: flex;
`;
export const CardDados = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
`;
export const CardButton = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`;
export const TextBold = styled.span`
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: ${colors.warning};
  span {
    font-weight: normal;
  }
  button {
    margin: 5px;
  }
`;
