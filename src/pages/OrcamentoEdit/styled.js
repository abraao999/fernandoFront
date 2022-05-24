import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const Form2 = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  small {
    color: red;
    display: none;
  }
  label {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  label + label {
    margin-left: 3px;
  }
  div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  input {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    margin-top: 5px;
    &:focus {
      border: 1px solid ${colors.primaryColor};
    }
  }
  select {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    margin: 5px 0;
    &:focus {
      border: 1px solid ${colors.primaryColor};
    }
  }
`;
export const Table = styled.table`
  margin-top: 20px;
  max-width: 80%;
`;
export const Listagem = styled.div`
  h3 {
    /* margin: 30px; */
    display: flex;
    justify-content: center;
  }
`;
export const Topo = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  button {
    margin-right: 5px;
  }
`;
export const Label = styled.label`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* margin-bottom: 20px; */
  small {
    color: red;
    display: block;
  }
  input {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    margin-top: 10px;
    &:focus {
      border: 4px solid ${colors.inputBorder};
    }
  }
  select {
    height: 40px;
    font-size: 18px;
    border: 1px solid #ddd;
    padding: 0 10px;
    border-radius: 4px;
    margin-top: 8px;
    &:focus {
      border: 4px solid ${colors.inputBorder};
    }
  }
`;
export const CardBox = styled.section`
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin-top: 5px;

  padding: 30px;
`;
export const CardHeader = styled.span`
  flex: 1;
  margin-bottom: 10px;
  font-size: 26px;
  font-weight: bold;
`;
export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
`;
export const CardDados = styled.div`
  flex: 3;
  display: flex;
  flex-direction: row;
`;
export const CardButton = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`;
export const TextBold = styled.span`
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  span {
    font-weight: normal;
    margin: 3px;
  }
  button {
    margin: 5px;
  }
`;
