/* eslint-disable camelcase */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { AiTwotoneEdit } from 'react-icons/ai';

import { useSelector } from 'react-redux';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { Container } from '../../styles/GlobalStyles';
import { Listagem } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import ModalComponent from '../../components/Modal';
import ModalBuscaCliente from '../../components/ModalBuscaCliente';
import history from '../../services/history';

export default function ListaOrcamento() {
  const [nomeCliente, setNomeCliente] = useState('');
  const [idCliente, setIdCliente] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [showCliente, setShowCliente] = useState(false);
  const [listaOrcamento, setListaOrcamento] = useState([]);
  const [listClientes, setListCliente] = useState([]);
  const [idOrcamento, setIdOrcamento] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('/orcamento');
      renderizaLista(response.data);
    }
    getData();
  }, []);
  const renderizaLista = (list) => {
    const novaLista = [];
    list.map((dado) => {
      const dataEntrada = moment(dado.data_entrada).format('l');
      const dataSaida = moment(dado.data_saida).format('l');
      novaLista.push({
        id: dado.id,
        cliente: dado.cliente,
        idCliente: dado.cliente_id,
        valor: dado.valor,
        dataEntrada,
        dataSaida,
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
  const handleReservar = async () => {
    let aux = {};
    let oculpado = false;
    setIsLoading(true);
    try {
      const responseOrcamento = await axios.get('/orcamento');
      responseOrcamento.data.map((valor) => {
        if (valor.id === idOrcamento) aux = valor;
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
        setShowModal(false);
      }
    } catch (e) {
      toast.error('Erro ao efetivar a reserva');
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <h1>Lista de Orçamentos</h1>
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
        text="Deseja efetivar essa reserva?"
        handleClose={() => setShowModal(false)}
        show={showModal}
        buttonCancel="Não"
        buttonConfirm="Sim"
        handleFunctionConfirm={handleReservar}
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
        <h3>Orçamentos</h3>
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
                <th scope="col">Data de Entrada</th>
                <th scope="col">Data de Saida</th>
                <th scope="col">Valor</th>
                <th scope="col">Reservar</th>
                <th scope="col">Editar</th>

                {/* <th scope="col">Excluir</th> */}
              </tr>
            </thead>
            <tbody>
              {listaOrcamento.map((dado) => (
                <tr key={dado.id}>
                  <td>{dado.cliente}</td>
                  <td>{dado.dataEntrada}</td>
                  <td>{dado.dataSaida}</td>
                  <td>{dado.valor}</td>
                  <td>
                    <Button
                      variant="success"
                      type="button"
                      onClick={(e) => {
                        setIdOrcamento(dado.id);
                        setShowModal(true);
                      }}
                    >
                      <FaPlus size={16} />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      type="button"
                      onClick={(e) => {
                        history.push(`/orcamentoEdit/${dado.id}`);
                      }}
                    >
                      <AiTwotoneEdit size={16} />
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
