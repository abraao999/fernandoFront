/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { FaEdit, FaSave } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import moment from 'moment';
import InputMask from 'react-input-mask';
import { Container } from '../../styles/GlobalStyles';
import { Header, Label } from './styled';

import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';

import ComboBox from '../../components/ComboBox';

import qtdeQuartos, { adultos, crianca } from '../../config/QtdeQuartos';

import 'moment/locale/pt-br';
import ModalBuscaCliente from '../../components/ModalBuscaCliente';
import ModalCrianca from '../../components/ModalCrianca';

export default function OrcamentoEdit({ match }) {
  const id = get(match, 'params.id', '');

  const [showCrianca, setShowCrianca] = useState(false);
  const [showModalCliente, setShowModalCliente] = useState(false);

  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [celular, setCelular] = useState('');

  const [tipoQuarto, setTipoQuarto] = useState('');
  const [valorFinal, setValorFinal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [editData, setEditData] = useState(false);
  const [editCliente, setEditCliente] = useState(false);

  const [hidden, setHidden] = useState(true);

  const [quantidadeFilhos, setQuantidadeFilhos] = useState([]);
  const [listQuartos, setListQuartos] = useState([]);
  const [listClientes, setListCliente] = useState([]);
  const [listTipoQuarto, setListTipoQuarto] = useState([]);
  const [idadeFilhos, setIdadeFilhos] = useState([]);
  const [listQtdeQuartosOrcamento, setListQtdeQuartosOrcamento] = useState([]);
  const [listAdultos, setListAdultos] = useState(adultos);
  const [listCriancas, setListCriancas] = useState(crianca);
  const [showCardDetailQuarto, setShowCardDetailQuarto] = useState([]);
  const [listQuartosEscolhidos, setListQuartosEscolhidos] = useState([]);
  const [qtdeQuartosOrcamento, setQtdeQuartosOrcamento] = useState('');

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      setListQuartos(qtdeQuartos);

      const response = await axios.get('/tipoQuarto');
      setListTipoQuarto(response.data);
      const response1 = await axios.get(`/orcamento/${id}`);
      setDataInicial(moment(response1.data.data_entrada).format('l'));
      setDataFinal(moment(response1.data.data_saida).format('l'));
      setValorFinal(response1.data.valor);
      setTipoQuarto(response1.data.tipo);
      setIdCliente(response1.data.cliente_id);

      const cliente = await axios.get(`/cliente/${response1.data.cliente_id}`);
      setNomeCliente(cliente.data.nome);
      setCelular(cliente.data.celular);

      const response2 = await axios.get('/cliente');
      setListCliente(response2.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const novaList = [];
    const listaReserva = [];
    const response = await axios.get('/reserva');
    if (
      dataInicial &&
      dataFinal &&
      dataInicial < dataFinal &&
      qtdeQuartosOrcamento
    ) {
      setHidden(false);

      qtdeQuartos.map((quarto) => {
        let valor = false;
        response.data.map((reserva) => {
          if (
            moment(dataInicial).isBetween(
              reserva.data_entrada,
              reserva.data_saida
            ) &&
            quarto.n_quarto === reserva.n_quarto
          ) {
            valor = reserva;
          }
          if (
            moment(reserva.data_entrada).isBetween(dataInicial, dataFinal) &&
            quarto.n_quarto === reserva.n_quarto
          ) {
            valor = reserva;
          }
          if (
            moment(dataInicial).isSameOrAfter(reserva.data_entrada) &&
            moment(dataInicial).isSameOrBefore(reserva.data_saida) &&
            !moment(dataInicial).isSame(reserva.data_saida) &&
            quarto.n_quarto === reserva.n_quarto
          ) {
            valor = reserva;
          }
        });
        novaList.push(quarto);
      });
      if (qtdeQuartosOrcamento <= novaList.length) {
        for (let index = 0; index < qtdeQuartosOrcamento; index++) {
          listaReserva.push({
            ...novaList[index],
            ...listQtdeQuartosOrcamento[index],
            data_entrada: dataInicial,
            data_saida: dataFinal,
            value: index.toString(),
            name: index + 1,
          });
        }
      }
      setListQtdeQuartosOrcamento(listaReserva);
      console.log(listaReserva);
    } else {
      toast.error('Escolha as datas de entrada e saída');
    }
    setIsLoading(false);
    setListQuartos(novaList);
  };
  const verificaQuarto = async () => {
    let aux = {};
    let oculpado = false;
    setIsLoading(true);
    try {
      const responseOrcamento = await axios.get('/orcamento');
      responseOrcamento.data.map((valor) => {
        if (valor.id === id) aux = valor;
      });
      const response = await axios.get('/reserva');
      response.data.map((valor) => {
        if (moment(aux.data_entrada).isSame(valor.data_entrada)) {
          console.log(valor);
          oculpado = true;
        }
      });
      if (oculpado) {
        toast.warn('O quarto não está mais disponível, verifique outro quarto');
        handleSubmit();
        setHidden(false);
      }
    } catch (e) {
      toast.error('Erro ao efetivar a reserva');
    }
  };
  const salvaOrcamento = async (idClienteSalve) => {
    try {
      const response = axios.put(`/orcamento/${id}`, {
        cliente_id: idClienteSalve,
        valor: valorFinal,
        tipo_quarto: tipoQuarto,
        data_entrada: moment(dataInicial).format(),
        data_saida: moment(dataFinal).format(),
      });
      toast.success('Orçamento alterado com sucesso');
    } catch (error) {
      console.log(error);
      toast.error('Falha na alteração');
    }
  };
  const handleIdCliente = (dado) => {
    setNomeCliente(dado.nome);
    setIdCliente(dado.id);
    setCelular(dado.celular);
    setShowModalCliente(false);
  };
  return (
    <Container>
      <Loading isLoading={isLoading} />
      <ModalBuscaCliente
        list={listClientes}
        show={showModalCliente}
        handleClose={() => setShowModalCliente(false)}
        buttonCancel="Cancelar"
        handleIdCliente={handleIdCliente}
      />
      <Header>
        <h1>Editar Orçamento</h1>
      </Header>
      <Form>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="nomeCliente">Nome do Cliente</Form.Label>
            <Form.Control
              type="text"
              value={nomeCliente}
              onChange={(e) => {
                setEditCliente(e.target.value);
              }}
              disabled={!editCliente}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Label htmlFor="telefone">
              Celular:
              <InputMask
                mask="(99) 99999-9999"
                id="telefone"
                type="text"
                value={celular}
                onChange={(e) => {
                  setCelular(e.target.value);
                }}
                placeholder="(00) 00000-0000"
                disabled={!editCliente}
              />
            </Label>
          </Col>
          <Col
            sm={12}
            md={3}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Button
              type="button"
              variant="warning"
              onClick={() => {
                setEditData(true);
                setShowModalCliente(true);
              }}
            >
              <FaEdit size={20} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataInicial">Data Inicial</Form.Label>
            <Form.Control
              type={editData ? 'date' : 'text'}
              value={dataInicial}
              onChange={(e) => {
                setDataInicial(e.target.value);
              }}
              disabled={!editData}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataInicial">Data Final</Form.Label>
            <Form.Control
              type={editData ? 'date' : 'text'}
              value={dataFinal}
              onChange={(e) => {
                setDataFinal(e.target.value);
              }}
              disabled={!editData}
            />
          </Col>
          <Col
            sm={12}
            md={3}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Button
              type="button"
              variant="warning"
              onClick={() => {
                setEditData(true);
              }}
            >
              <FaEdit size={20} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <ComboBox
              title="Tipo de Quarto"
              list={listTipoQuarto}
              value={tipoQuarto}
              onChange={(e) => setTipoQuarto(e.target.value)}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataInicial">Valor</Form.Label>
            <Form.Control
              type="text"
              value={valorFinal}
              onChange={(e) => {
                setValorFinal(e.target.value);
              }}
            />
          </Col>
          <Col
            sm={12}
            md={3}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Button
              type="button"
              variant="success"
              onClick={() => {
                salvaOrcamento();
              }}
              style={{ marginBottom: 5 }}
            >
              <FaSave size={20} />
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
OrcamentoEdit.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
