/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import * as colors from '../../config/colors';
import { CancelarButton, Label } from './styled';
import Loading from '../Loading';

// eslint-disable-next-line react/prop-types
export default function ModalDadosClientePreserva({
  title,
  nomeCliente,
  celular,
  email,
  handleClose,
  show,
  buttonCancel,
  buttonConfirm,
  handleFunctionConfirm,
  onChangeNome,
  onChangeCelular,
  onChangeEmail,
  disabledButton,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label htmlFor="nomeCliente">Nome Completo</Form.Label>
            <Form.Control
              type="text"
              value={nomeCliente}
              onChange={(e) => {
                onChangeNome(e);
              }}
            />
            <Label htmlFor="telefone">
              Celular:
              <InputMask
                mask="(99) 99999-9999"
                id="telefone"
                type="text"
                value={celular}
                onChange={(e) => {
                  onChangeCelular(e);
                }}
                placeholder="(00) 00000-0000"
              />
            </Label>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                onChangeEmail(e);
              }}
              placeholder="seuemail@seuemail.com"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            {buttonCancel}
          </Button>
          <Button
            type="submit"
            variant="success"
            onClick={handleFunctionConfirm}
            disabled={disabledButton}
          >
            {buttonConfirm}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalDadosClientePreserva.defaultProps = {
  title: '',
  text: '',
  buttonCancel: '',
  buttonConfirm: '',
  show: false,
  disabledButton: false,
  nomeCliente: '',
  celular: '',
  email: '',
};
ModalDadosClientePreserva.protoTypes = {
  nome: PropTypes.string,
  text: PropTypes.string,
  buttonConfirm: PropTypes.string,
  buttonCancel: PropTypes.string,
  show: PropTypes.bool,
  disabledButton: PropTypes.bool,
  handleClose: PropTypes.func,
  handleFunctionConfirm: PropTypes.func,
  onChangeNome: PropTypes.func,
  onChangeCelular: PropTypes.func,
  onChangeEmail: PropTypes.func,
  nomeCliente: PropTypes.string,
  celular: PropTypes.string,
  email: PropTypes.string,
};
