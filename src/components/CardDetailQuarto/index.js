/* eslint-disable array-callback-return */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Nav, Modal } from 'react-bootstrap';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import {
  CardBody,
  CardBox,
  CardHeader,
  TextBold,
  List,
  CardDados,
  CardButton,
} from './styled';
import { danger, primary, success } from '../../config/colors';
// eslint-disable-next-line react/prop-types
export default function CardDetailQuarto({
  disponibilidade,
  cliente,
  handleRedirect,
  list,
  listFilhos,
  entrada,
  saida,
  onClick,
  nQuarto,
  handleQuartoDetail,
  quartoDetail,
  crianca,
  descricao,
  adulto,
  tipo,
  valor,
  show,
  handleEscolhaQuarto,
}) {
  return (
    <>
      <div>
        {list.map((dado) => (
          <CardBox key={dado.tipo}>
            <CardHeader>
              <h2>{dado.tipo}</h2>
            </CardHeader>
            <CardBody>
              <CardDados>
                <p>
                  <strong>Adultos: </strong>
                  {dado.adulto},
                </p>
                <p>
                  <strong>Crianças: </strong>
                  {dado.crianca}
                </p>
                <p>
                  <strong>Descrição:</strong>
                </p>
                <p>{dado.descricao}</p>
              </CardDados>
              <CardButton>
                <strong>
                  <h2>R$ {dado.valorReserva}</h2>
                </strong>
                <Button
                  size="lg"
                  variant={dado.escolhido ? 'danger' : 'success'}
                  onClick={() => handleEscolhaQuarto(dado)}
                >
                  {dado.button}
                </Button>
              </CardButton>
            </CardBody>
            <TextBold>Ver detalhes e políticas de cancelamento</TextBold>
          </CardBox>
        ))}
      </div>
    </>
  );
}

CardDetailQuarto.defaultProps = {
  disponibilidade: '',
  cliente: '',
  entrada: '',
  crianca: '',
  adulto: '',
  tipo: '',
  descricao: '',
  quartoDetail: '',
  valor: '',
  saida: '',
  nQuarto: 0,
  list: [],
  show: false,
  listFilhos: [],
};
CardDetailQuarto.protoTypes = {
  disponibilidade: PropTypes.string,
  cliente: PropTypes.string,
  entrada: PropTypes.string,
  adulto: PropTypes.string,
  crianca: PropTypes.string,
  descricao: PropTypes.string,
  tipo: PropTypes.string,
  valor: PropTypes.string,
  quartoDetail: PropTypes.string,
  saida: PropTypes.string,
  handleRedirect: PropTypes.func,
  handleEscolhaQuarto: PropTypes.func,
  handleQuartoDetail: PropTypes.func,
  list: PropTypes.array,
  listFilhos: PropTypes.array,
  nQuarto: PropTypes.float,
  show: PropTypes.bool,
};
