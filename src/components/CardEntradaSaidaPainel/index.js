/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { CardBody, CardBox, CardHeader, TextBold, List } from './styled';
import { danger, info, primary, success, warning } from '../../config/colors';
// eslint-disable-next-line react/prop-types
export default function CardEntradaSaidaPainel({
  variante,
  cliente,
  nomeCheckin,
  entradaCheckin,
  saidaCheckin,
  entrada,
  saida,
  onClick,
  nQuarto,
  disponivel,
  tipoQuarto,
  tipoQuartoCheckin,
}) {
  return (
    <>
      <CardBox>
        {variante === 'checkin' && (
          <CardHeader style={{ background: success }}>
            <span>Quarto {nQuarto + 1}</span>
          </CardHeader>
        )}
        {variante === 'checkout' && (
          <CardHeader style={{ background: warning }}>
            <span>Quarto {nQuarto + 1}</span>
          </CardHeader>
        )}
        {variante === 'duplo' && (
          <CardHeader style={{ background: info }}>
            <span>Quarto {nQuarto + 1}</span>
          </CardHeader>
        )}
        <CardBody>
          <TextBold>
            Cliente: <span>{cliente}</span>
          </TextBold>
          <TextBold>
            Tipo Quarto: <span>{tipoQuarto}</span>
          </TextBold>
          <TextBold>
            Data Entrada: <span>{entrada}</span>
          </TextBold>
          <TextBold>
            Data Saída: <span>{saida}</span>
          </TextBold>
          <TextBold>
            Cliente: <span>{nomeCheckin}</span>
          </TextBold>
          <TextBold>
            Tipo Quarto: <span>{tipoQuartoCheckin}</span>
          </TextBold>
          <TextBold>
            Data Entrada: <span>{entradaCheckin}</span>
          </TextBold>
          <TextBold>
            Data Saída: <span>{saidaCheckin}</span>
          </TextBold>
          {variante === 'checkin' && (
            <Button variant="outline-success" onClick={onClick}>
              Detalhes
            </Button>
          )}
          {variante === 'checkout' && (
            <Button variant="outline-warning" onClick={onClick}>
              Detalhes
            </Button>
          )}
          {variante === 'duplo' && (
            <Button variant="outline-info" onClick={onClick}>
              Detalhes
            </Button>
          )}
        </CardBody>
      </CardBox>
    </>
  );
}

CardEntradaSaidaPainel.defaultProps = {
  variante: '',
  cliente: '',
  nomeCheckin: '',
  saidaCheckin: '',
  entradaCheckin: '',
  disponivel: '',
  entrada: '',
  saida: '',
  nQuarto: 0,
  list: [],
};
CardEntradaSaidaPainel.protoTypes = {
  variante: PropTypes.string,
  disponivel: PropTypes.string,
  cliente: PropTypes.string,
  entrada: PropTypes.string,
  nomeCheckin: PropTypes.string,
  saidaCheckin: PropTypes.string,
  entradaCheckin: PropTypes.string,
  saida: PropTypes.string,
  handleRedirect: PropTypes.func,
  list: PropTypes.array,
  nQuarto: PropTypes.float,
};
