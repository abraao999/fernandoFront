/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import * as colors from '../../config/colors';
import { CancelarButton } from './styled';
// eslint-disable-next-line react/prop-types
export default function ModaComponent({
  title,
  text,
  handleClose,
  show,
  buttonCancel,
  buttonConfirm,
  handleFunctionConfirm,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body> {text}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            {buttonCancel}
          </Button>
          <Button
            variant="success"
            type="button"
            onClick={handleFunctionConfirm}
          >
            {buttonConfirm}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModaComponent.defaultProps = {
  title: '',
  text: '',
  buttonCancel: '',
  buttonConfirm: '',
  show: false,
};
ModaComponent.protoTypes = {
  nome: PropTypes.string,
  text: PropTypes.string,
  buttonConfirm: PropTypes.string,
  buttonCancel: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleFunctionConfirm: PropTypes.func,
};
