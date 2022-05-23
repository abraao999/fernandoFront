import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaWindowClose } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table, Button } from 'react-bootstrap';
import { Container } from '../../styles/GlobalStyles';
import Modal from '../../components/Modal';

import { Listagem } from './styled';
import axios from '../../services/axios';

import Loading from '../../components/Loading';
import history from '../../services/history';
// import * as actions from '../../store/modules/auth/actions';

export default function TipoQuarto({ match }) {
  const id = get(match, 'params.id', '');
  const [show, setShow] = useState(false);
  const [idParaDelecao, setIdParaDelecao] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');
  const [valor, setValor] = useState('');

  const [descricao, setDescricao] = useState('');
  const [nome, setNome] = useState('');
  const [descricaoList, setDescricaoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/tipoQuarto');
      console.log(response.data);
      setDescricaoList(response.data);
      // if(idFuncao){

      // }
      setIsLoading(false);
    }
    getData();
  }, [id]);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let formErrors = false;

    if (descricao.length < 3 || descricao.length > 255) {
      formErrors = true;
      toast.error('Campo descricao deve ter entre 3 e 255 caracteres');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post('/tipoQuarto', {
          nome,
          descricao,
          valor,
        });
        console.log(response);
        const novaLista = await axios.get('/tipoQuarto');
        setDescricaoList(novaLista.data);
        setNome('');
        setDescricao('');
        setValor('');
        toast.success('Tipo de quarto criada com sucesso');

        setIsLoading(false);
      } else {
        const response = await axios.put(`/tipoQuarto/${id}`, {
          nome,
          descricao,
          valor,
        });
        console.log(response);
        const novaLista = await axios.get('/tipoQuarto');
        setDescricaoList(novaLista.data);
        setNome('');
        setDescricao('');
        setValor('');
        toast.success('Tipo de quarto editado com sucesso');

        history.push('/tipoQuarto');
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir um quarto');
      }
      setIsLoading(false);
    }
  }
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setIdParaDelecao(idFuncao);
    setIndiceDelecao(index);
    setShow(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/cargo/${idParaDelecao}`);
      const novosFuncoes = [...descricaoList];
      novosFuncoes.splice(indiceDelecao, 1);
      setDescricaoList(novosFuncoes);
      toast.success('Cargo excluida com sucesso');
      setShow(false);

      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir a classe');
      }
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h1>{id ? 'Editar Quarto' : 'Novo Quarto'}</h1>
      <Loading isLoading={isLoading} />
      <Modal
        title="Atenção!!!"
        handleClose={handleClose}
        show={show}
        text="Deseja exluir esse registro"
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleFunctionConfirm}
      />
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Nome da quarto:</Form.Label>

            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Descrição"
            />
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="descricao">Valor do Quarto:</Form.Label>

            <Form.Control
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="valor"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={8} className="my-1">
            <Form.Label htmlFor="descricao">Nome da cargo:</Form.Label>

            <Form.Control
              as="textarea"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição"
            />
          </Col>
          <Col
            sm={12}
            md={4}
            className="my-1"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <Button variant="success" type="submit">
              Salvar
            </Button>
          </Col>
        </Row>
      </Form>
      <Listagem>
        <h3>Lista de Quartos</h3>
        <center>
          <Table
            responsive
            striped
            bordered
            hover
            style={{ textAlign: 'center', verticalAlign: 'middle' }}
          >
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Valor</th>
                <th scope="col">Descrição</th>
                <th scope="col">Alterar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {descricaoList.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.nome}</td>
                  <td>{dado.valor}</td>
                  <td>{dado.descricao}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={(e) => {
                        e.preventDefault();
                        setDescricao(dado.descricao);
                        setValor(dado.valor);
                        history.push(`/tipoQuarto/${dado.id}/edit`);
                      }}
                      to={`/tipoQuarto/${dado.id}/edit`}
                    >
                      <FaEdit size={20} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleShow(dado.id, index)}
                      to={`/tipoQuarto/${dado.id}/delete`}
                    >
                      <AiFillDelete size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
TipoQuarto.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
