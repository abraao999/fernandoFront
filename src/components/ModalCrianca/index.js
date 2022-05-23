/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as colors from '../../config/colors';
import { CancelarButton, Label, Table } from './styled';
// eslint-disable-next-line react/prop-types
export default function ModalCrianca({
  title,
  list,
  handleClose,
  handleConfirm,
  show,
  idadeFilhos,
  handleIdadeCrianca,
  buttonCancel,
  buttonConfirm,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {list.map((dado) => (
            <Label key={dado.id} htmlFor="congregacao">
              Crianças {dado.descricao}
              <select
                onChange={(e) => handleIdadeCrianca(e, dado)}
                value={dado.idade}
              >
                <option value="-">-</option>
                <option value="0">menos que 1</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </Label>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            {buttonCancel}
          </Button>
          <Button variant="success" onClick={handleClose}>
            {buttonConfirm}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalCrianca.defaultProps = {
  title: '',
  list: [],
  buttonCancel: '',
  buttonConfirm: '',
  idadeFilhos: '',
  show: false,
};
ModalCrianca.protoTypes = {
  idadeFilhos: PropTypes.string,
  list: PropTypes.array,
  handleIdadeCrianca: PropTypes.func,
  buttonCancel: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func,
};
