/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { CardBody, CardBox, CardHeader, TextBold, List } from './styled';
import { danger, primary, success, warning } from '../../config/colors';
// eslint-disable-next-line react/prop-types
export default function CardPainelPrincipal({
  variante,
  cliente,
  entrada,
  saida,
  onClick,
  nQuarto,
  disponivel,
  tipoQuarto,
}) {
  return (
    <>
      <CardBox>
        {variante === 'checkin' && (
          <CardHeader style={{ background: primary }}>
            <span>Quarto {nQuarto + 1}</span>
          </CardHeader>
        )}
        {variante === 'checkout' && (
          <CardHeader style={{ background: warning }}>
            <span>Quarto {nQuarto + 1}</span>
          </CardHeader>
        )}
        {variante === 'oculpado' && (
          <CardHeader style={{ background: danger }}>
            <span>Quarto {nQuarto + 1}</span>
          </CardHeader>
        )}
        {variante === 'vazio' && (
          <CardHeader style={{ background: success }}>
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
          {variante === 'checkin' && (
            <Button variant="outline-primary" onClick={onClick}>
              Detalhes
            </Button>
          )}
          {variante === 'checkout' && (
            <Button variant="outline-warning" onClick={onClick}>
              Detalhes
            </Button>
          )}
          {variante === 'oculpado' && (
            <Button variant="outline-danger" onClick={onClick}>
              Detalhes
            </Button>
          )}
          {variante === 'vazio' && (
            <Button variant="outline-success" disabled onClick={onClick}>
              Detalhes
            </Button>
          )}
        </CardBody>
      </CardBox>
    </>
  );
}

CardPainelPrincipal.defaultProps = {
  variante: '',
  cliente: '',
  disponivel: '',
  entrada: '',
  saida: '',
  nQuarto: 0,
  tipoQuarto: '',
  list: [],
};
CardPainelPrincipal.protoTypes = {
  variante: PropTypes.string,
  disponivel: PropTypes.string,
  cliente: PropTypes.string,
  entrada: PropTypes.string,
  saida: PropTypes.string,
  handleRedirect: PropTypes.func,
  list: PropTypes.array,
  nQuarto: PropTypes.float,
  tipoQuarto: PropTypes.string,
};
