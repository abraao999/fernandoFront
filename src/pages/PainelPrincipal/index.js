/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { FaCalculator } from 'react-icons/fa';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Table } from 'react-bootstrap';
import moment from 'moment';
import { Container } from '../../styles/GlobalStyles';
import { Header } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';
import { Impressao } from '../../printers/impRelatorioDizimoGeral';
import { getDataBanco } from '../../util';
import ComboBox from '../../components/ComboBox';
import * as colors from '../../config/colors';
import qtdeQuartos, { listTipoQuarto } from '../../config/QtdeQuartos';
import { listTaxaMaquina, listTiposPagamento } from '../../config/pagamento';

import 'moment/locale/pt-br';
import CardPainelPrincipal from '../../components/CardPainelPrincipal';
import CardEntradaSaidaPainel from '../../components/CardEntradaSaidaPainel';

export default function PainelPrincipal() {
  const [show, setShow] = useState(false);
  const [showCliente, setShowCliente] = useState(false);
  const todayHeader = moment()
    .locale('pt-br')
    .format('dddd, D [de] MMMM [de] YYYY');

  const [isLoading, setIsLoading] = useState(false);

  const [listQuartos, setListQuartos] = useState([]);

  const [idCliente, setIdCliente] = useState('');

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      setListQuartos(qtdeQuartos);
      await buscaReservas();
      setIsLoading(false);
    }
    getData();
  }, []);

  const buscaReservas = async () => {
    setIsLoading(true);
    const novaList = [];
    const response = await axios.get('/reserva');
    let today = new Date();
    // today = moment(today).format('l');
    today = moment(today).format();
    console.log(today);
    qtdeQuartos.map((quarto) => {
      let valor = false;
      let entradaSaida = false;
      let aux = {};
      response.data.map((reserva) => {
        // testa se o dia atual e igual a entrada ou a saida

        const checkin = moment(reserva.data_entrada).format('l');
        const checkout = moment(reserva.data_saida).format('l');
        if (
          moment(today).format('l') === checkin &&
          quarto.n_quarto === reserva.n_quarto
        ) {
          if (entradaSaida) {
            valor = {
              ...aux,
              variante: 'duplo',
              nomeCheckin: reserva.cliente,
              entradaCheckin: reserva.data_entrada,
              saidaCheckin: reserva.data_saida,
              entradaSaida: true,
            };
          } else
            valor = {
              ...reserva,
              variante: 'checkin',
            };
          aux = { ...valor };
          console.log(valor);
          entradaSaida = true;
        } else if (
          moment(today).format('l') === checkout &&
          quarto.n_quarto === reserva.n_quarto
        ) {
          if (entradaSaida) {
            valor = {
              ...aux,
              variante: 'duplo',
              nomeCheckin: reserva.cliente,
              entradaCheckin: reserva.data_entrada,
              saidaCheckin: reserva.data_saida,
              entradaSaida: true,
            };
          } else
            valor = {
              ...reserva,
              variante: 'checkout',
            };
          aux = { ...valor };
          console.log(valor);
          entradaSaida = true;
        }
        // testa se o dia atual está entre a entrada e a saida
        else if (
          moment(today).isBetween(reserva.data_entrada, reserva.data_saida) &&
          quarto.n_quarto === reserva.n_quarto
        ) {
          valor = { ...reserva, variante: 'oculpado' };
        }
      });
      novaList.push(valor || { ...quarto, variante: 'vazio' });
    });

    setIsLoading(false);
    setListQuartos(novaList);
    console.log(novaList[4]);
    const teste = novaList.find((value) => {
      value.n_quarto === 4;
    });
    console.log(teste);
  };
  const handleDetailQuarto = (id) => {
    history.push(`/detailReserva/${id}`);
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Header>
        <h1>Calendário</h1>
        <h3>{todayHeader}</h3>
      </Header>

      <Row>
        {listQuartos.map((dado) => (
          <Col key={dado.n_quarto} sm={12} md={4} lg={4} className="my-1">
            {dado.entradaSaida ? (
              <CardEntradaSaidaPainel
                variante={dado.variante}
                tipoQuarto={dado.tipo_quarto}
                nQuarto={dado.n_quarto}
                cliente={dado.cliente}
                nomeCheckin={dado.nomeCheckin}
                entradaCheckin={
                  getDataBanco(new Date(dado.entradaCheckin)) !== 'NaN/NaN/NaN'
                    ? getDataBanco(new Date(dado.entradaCheckin))
                    : ''
                }
                saidaCheckin={
                  getDataBanco(new Date(dado.saidaCheckin)) !== 'NaN/NaN/NaN'
                    ? getDataBanco(new Date(dado.saidaCheckin))
                    : ''
                }
                entrada={
                  getDataBanco(new Date(dado.data_entrada)) !== 'NaN/NaN/NaN'
                    ? getDataBanco(new Date(dado.data_entrada))
                    : ''
                }
                saida={
                  getDataBanco(new Date(dado.data_saida)) !== 'NaN/NaN/NaN'
                    ? getDataBanco(new Date(dado.data_saida))
                    : ''
                }
                onClick={() => handleDetailQuarto(dado.id)}
              />
            ) : (
              <CardPainelPrincipal
                variante={dado.variante}
                tipoQuarto={dado.tipo_quarto}
                nQuarto={dado.n_quarto}
                cliente={dado.cliente}
                entrada={
                  getDataBanco(new Date(dado.data_entrada)) !== 'NaN/NaN/NaN'
                    ? getDataBanco(new Date(dado.data_entrada))
                    : ''
                }
                saida={
                  getDataBanco(new Date(dado.data_saida)) !== 'NaN/NaN/NaN'
                    ? getDataBanco(new Date(dado.data_saida))
                    : ''
                }
                onClick={() => handleDetailQuarto(dado.id)}
              />
            )}
          </Col>
        ))}
      </Row>
    </Container>
  );
}
