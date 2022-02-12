/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { get } from 'lodash';
import { Col, Row, Form, Button } from 'react-bootstrap';
import { Container } from '../../styles/GlobalStyles';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';
import 'moment/locale/pt-br';

export default function DetailReserva({ match }) {
  const id = get(match, 'params.id', '');

  const [nomeCliente, setNomeCliente] = useState('');
  const [clienteCelular, setClienteCelular] = useState('');
  const [dataEntrada, setDataEntrada] = useState('');
  const [dataSaida, setDataSaida] = useState('');
  const [nQuarto, setnQuarto] = useState('');
  const [valor, setValor] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [tipoQuarto, setTipoQuarto] = useState('');
  const [pagamento, setPagamento] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      axios.get(`/reserva/${id}`).then((dados) => {
        renderizaDados(dados.data);
        console.log(dados.data);
      });

      setIsLoading(false);
    }
    getData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    history.push(`/cadMembro/${id}/edit`);
  }
  const renderizaDados = (list) => {
    const di = moment(list.data_entrada).format('l');
    const df = moment(list.data_saida).format('l');
    console.log(list.cliente);
    setNomeCliente(list.cliente);
    setValor(list.valor);
    setDataEntrada(di);
    setDataSaida(df);
    setnQuarto(list.n_quarto);
    setClienteCelular(list.clienteCelular);
    setClienteEmail(list.clienteEmail);
    setTipoQuarto(list.tipo_quarto);
    setPagamento(list.natureza);

    // setListaOrcamento(novaLista);
  };
  return (
    <Container>
      <h1> Detalhes da Reserva</h1>
      <Loading isLoading={isLoading} />

      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={1} className="my-1">
            <Form.Label htmlFor="dataBatismo">Nº Quarto:</Form.Label>
            <Form.Control
              id="estadoCivil"
              type="text"
              value={nQuarto + 1}
              disabled
            />
          </Col>
          <Col sm={12} md={2} className="my-1">
            <Form.Label htmlFor="dataBatismo">Tipo Quarto:</Form.Label>
            <Form.Control
              id="estadoCivil"
              type="text"
              value={tipoQuarto}
              disabled
            />
          </Col>

          <Col sm={12} md={9} className="my-1">
            <Form.Label htmlFor="nome">Nome:</Form.Label>
            <Form.Control id="nome" type="text" value={nomeCliente} disabled />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataEntrada">Data de Entrada:</Form.Label>
            <Form.Control
              id="dataNascimento"
              type="text"
              value={dataEntrada}
              disabled
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataSaida">Data de Saida:</Form.Label>
            <Form.Control
              id="dataSaida"
              type="text"
              value={dataSaida}
              disabled
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataBatismo">Celular:</Form.Label>
            <Form.Control
              id="clienteCelular"
              type="text"
              value={clienteCelular}
              disabled
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataBatismo">Pagamento:</Form.Label>
            <Form.Control id="" type="text" value={pagamento} disabled />
          </Col>
        </Row>

        {/* <center>
          <Row>
            <Col sm={6} md={6} className="my-1">
              <Button
                variant="success"
                type="button"
                onClick={() => history.push('/listMembros')}
              >
                Voltar
              </Button>
            </Col>
          </Row>
        </center> */}
      </Form>
    </Container>
  );
}
DetailReserva.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
