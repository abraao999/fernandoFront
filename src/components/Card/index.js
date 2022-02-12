/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { CardBody, CardBox, CardHeader, TextBold, List } from './styled';
import { danger, primary, success } from '../../config/colors';
// eslint-disable-next-line react/prop-types
export default function CardComponent({
  disponibilidade,
  cliente,
  handleRedirect,
  list,
  entrada,
  saida,
  onClick,
  nQuarto,
}) {
  return (
    <>
      <CardBox>
        <CardHeader style={{ background: disponibilidade ? success : danger }}>
          <span>Quarto {nQuarto + 1}</span>
        </CardHeader>
        <CardBody>
          <TextBold>
            Cliente: <span>{cliente}</span>
          </TextBold>
          <TextBold>
            Data Entrada: <span>{entrada}</span>
          </TextBold>
          <TextBold>
            Data Saída: <span>{saida}</span>
          </TextBold>
          <Button
            variant={disponibilidade ? 'outline-success' : 'danger'}
            disabled={!disponibilidade}
            onClick={onClick}
          >
            Simulação
          </Button>
        </CardBody>
      </CardBox>
    </>
  );
}

CardComponent.defaultProps = {
  disponibilidade: '',
  cliente: '',
  entrada: '',
  saida: '',
  nQuarto: 0,
  list: [],
};
CardComponent.protoTypes = {
  disponibilidade: PropTypes.string,
  cliente: PropTypes.string,
  entrada: PropTypes.string,
  saida: PropTypes.string,
  handleRedirect: PropTypes.func,
  list: PropTypes.array,
  nQuarto: PropTypes.float,
};
