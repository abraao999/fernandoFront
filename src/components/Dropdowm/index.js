/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
export default function DropdownComponent({ nome, opcoes }) {
  return (
    <Dropdown style={{ padding: '0 16px' }}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {nome}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {opcoes.map((opcao) => (
          <Dropdown.Item href={opcao.path}> {opcao.desc}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

DropdownComponent.defaultProps = {
  nome: '',
  opcoes: [],
};
DropdownComponent.protoTypes = {
  nome: PropTypes.string,
  opcoes: PropTypes.array,
};
