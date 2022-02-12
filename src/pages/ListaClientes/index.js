/* eslint-disable camelcase */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import { toast } from 'react-toastify';
import { FaEdit, FaInfo, FaSearch } from 'react-icons/fa';

import { useSelector } from 'react-redux';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { AiFillDelete } from 'react-icons/ai';
import { Container } from '../../styles/GlobalStyles';
import { Listagem } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import ModalComponent from '../../components/Modal';
import ModalBuscaCliente from '../../components/ModalBuscaCliente';
import history from '../../services/history';

export default function ListaCliente() {
  const [nomeCliente, setNomeCliente] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [idDelete, setIdDelete] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showCliente, setShowCliente] = useState(false);
  const [listaOrcamento, setListaOrcamento] = useState([]);
  const [listClientes, setListCliente] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('/cliente');
      renderizaLista(response.data);
    }
    getData();
  }, []);

  const renderizaLista = (list) => {
    const novaLista = [];
    list.map((dado) => {
      const dataNascimento = moment(dado.data_nascimento).format('l');
      novaLista.push({
        id: dado.id,
        cliente: dado.nome,
        email: dado.email,
        celular: dado.celular,
        dataNascimento,
      });
    });
    setListaOrcamento(novaLista);
  };

  const handleIdCliente = async (idm) => {
    try {
      const response = await axios.get(`/cliente/${idm}`);
      console.log(response.data);
      setNomeCliente(response.data.nome);
      setIdCliente(response.data.id);
      setShowCliente(false);
      const novaLista = [];
      listaOrcamento.map((dado) => {
        if (dado.idCliente === idm) novaLista.push(dado);
      });
      setListaOrcamento(novaLista);
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  const handleBuscaCliente = async () => {
    setShowCliente(true);
    console.log('aqui');
    try {
      const novaLista = [];
      const response = await axios.get('/cliente');
      response.data.map((dados) => {
        if (
          String(dados.nome)
            .toLowerCase()
            .includes(String(nomeCliente.toLowerCase()))
        ) {
          novaLista.push(dados);
        }
      });

      setListCliente(novaLista);
      console.log(novaLista);
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  const handleReservar = async (dado) => {
    let aux = {};
    let oculpado = false;
    try {
      const responseOrcamento = await axios.get('/orcamento');
      responseOrcamento.data.map((valor) => {
        if (valor.id === dado.id) aux = valor;
      });
      const response = await axios.get('/reserva');
      response.data.map((valor) => {
        if (moment(aux.data_entrada).isSame(valor.data_entrada)) {
          console.log(valor);
          oculpado = true;
        }
      });
      if (oculpado) {
        toast.warn('O quarto não está mais disponivel, verifique outro quarto');
        history.push('/reserva');
      } else {
        const {
          data_entrada,
          data_saida,
          n_quarto,
          cliente_id,
          valor,
          natureza,
          tipo_quarto,
          parcelas,
        } = aux;
        const response1 = axios.post('/reserva', {
          n_quarto,
          cliente_id,
          valor,
          natureza,
          tipo_quarto,
          parcelas,
          data_entrada,
          data_saida,
          checkin: data_entrada,
          checkout: data_saida,
          status: 'Reservado',
          disponivel: false,
        });
        toast.success('Reserva efetuada com sucesso');
      }
    } catch (e) {
      toast.error('Erro ao efetivar a reserva');
    }
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/reserva/${idDelete}`);
      toast.success('Reserva excluida com sucesso');
      const novaLista = await axios.get('/reserva');
      renderizaLista(novaLista.data);
      setShowModal(false);
    } catch (e) {
      toast.error('Erro ao excluir a reserva');
    }
  };
  return (
    <Container>
      <h1>Lista de Clientes </h1>
      <Loading isLoading={isLoading} />
      <ModalBuscaCliente
        title="Selecione o membro"
        handleClose={() => setShowCliente(false)}
        show={showCliente}
        list={listClientes}
        buttonCancel="Fechar"
        handleIdCliente={handleIdCliente}
      />
      <ModalComponent
        title="Alerta"
        text="Deseja realmente excluir essa reserva?"
        handleClose={() => setShowModal(false)}
        show={showModal}
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleDelete}
      />
      <Form>
        <Row>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="">Nome do Cliente</Form.Label>
            <Form.Control
              type="text"
              value={nomeCliente}
              onChange={(e) => {
                setNomeCliente(e.target.value);
              }}
              onBlur={(e) => {
                setNomeCliente(e.target.value);
                handleBuscaCliente();
              }}
              placeholder="Insira um nome para a pesquisa"
            />
          </Col>
          <Col
            sm={12}
            md={4}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Button
              variant="success"
              type="button"
              onClick={handleBuscaCliente}
            >
              Buscar <FaSearch />
            </Button>
          </Col>
        </Row>
      </Form>
      <Listagem hidden={false}>
        <h3>Reservas</h3>
        <center>
          <Table
            responsive
            striped
            bordered
            hover
            style={{ textAlign: 'center' }}
          >
            <thead>
              <tr>
                <th scope="col">Nome da Cliente</th>
                <th scope="col">Data de Aniversário</th>
                <th scope="col">Celular</th>
                <th scope="col">Email</th>
                <th scope="col">Editar</th>
                <th scope="col">Detalhes</th>
                <th scope="col">Excluir</th>

                {/* <th scope="col">Excluir</th> */}
              </tr>
            </thead>
            <tbody>
              {listaOrcamento.map((dado) => (
                <tr key={dado.id}>
                  <td>{dado.cliente}</td>
                  <td>{dado.dataNascimento}</td>
                  <td>{dado.celular}</td>
                  <td>{dado.email}</td>
                  <td>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={(e) => history.push(`/cadCliente/${dado.id}`)}
                    >
                      <FaEdit size={16} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      type="button"
                      onClick={(e) => history.push(`/detailReserva/${dado.id}`)}
                    >
                      <FaInfo size={16} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={(e) => {
                        setIdDelete(dado.id);
                        setShowModal(true);
                      }}
                    >
                      <AiFillDelete size={16} />
                    </Button>
                  </td>

                  {/* <td>
                    <Link
                      onClick={() => handleShow(dado.id, index)}
                      to="/relatorioPresencaEbd"
                    >
                      <FaWindowClose size={16} />
                    </Link>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
    </Container>
  );
}
