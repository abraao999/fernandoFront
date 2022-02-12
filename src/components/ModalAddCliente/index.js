/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import * as colors from '../../config/colors';
import { CancelarButton, Label } from './styled';

// eslint-disable-next-line react/prop-types
export default function ModalAddCliente({
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
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label htmlFor="nomeCliente">Nome do Cliente</Form.Label>
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
            <Form.Label htmlFor="email">Nome do Cliente</Form.Label>
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
          >
            {buttonConfirm}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalAddCliente.defaultProps = {
  title: '',
  text: '',
  buttonCancel: '',
  buttonConfirm: '',
  show: false,
};
ModalAddCliente.protoTypes = {
  nome: PropTypes.string,
  text: PropTypes.string,
  buttonConfirm: PropTypes.string,
  buttonCancel: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleFunctionConfirm: PropTypes.func,
};
