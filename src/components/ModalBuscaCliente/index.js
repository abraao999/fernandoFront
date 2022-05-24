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
import { CancelarButton, Table } from './styled';
// eslint-disable-next-line react/prop-types
export default function ModalBuscaCliente({
  title,
  list,
  handleClose,
  show,
  handleIdCliente,
  buttonCancel,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Selecione</th>
              </tr>
            </thead>
            <tbody>
              {list.map((dado) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nome}</td>
                  <td>
                    <FaCheck
                      onClick={() => {
                        handleIdCliente(dado);
                      }}
                      size={16}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            {buttonCancel}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalBuscaCliente.defaultProps = {
  title: '',
  list: [],
  buttonCancel: '',
  buttonConfirm: '',
  show: false,
};
ModalBuscaCliente.protoTypes = {
  nome: PropTypes.string,
  list: PropTypes.array,
  handleIdCliente: PropTypes.func,
  buttonCancel: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};
