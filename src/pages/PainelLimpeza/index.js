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
import { AiFillCheckCircle } from 'react-icons/ai';
import { Container } from '../../styles/GlobalStyles';
import { Header } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';
import { Impressao } from '../../printers/impRelatorioDizimoGeral';
import { getDataBanco, getDay } from '../../util';
import ComboBox from '../../components/ComboBox';
import * as colors from '../../config/colors';
import qtdeQuartos, { listTipoQuarto } from '../../config/QtdeQuartos';
import { listTaxaMaquina, listTiposPagamento } from '../../config/pagamento';

import 'moment/locale/pt-br';
import CardPainelPrincipal from '../../components/CardPainelPrincipal';
import CardEntradaSaidaPainel from '../../components/CardEntradaSaidaPainel';

export default function PainelLimpeza() {
  const [show, setShow] = useState(false);
  const [showCliente, setShowCliente] = useState(false);
  const todayHeader = moment()
    .locale('pt-br')
    .format('dddd, D [de] MMMM [de] YYYY');

  const [isLoading, setIsLoading] = useState(false);

  const [listQuartos, setListQuartos] = useState([]);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      setListQuartos(qtdeQuartos);
      const today = new Date();

      console.log(today.getDate() % 2);
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
    today = moment(today).format();
    qtdeQuartos.map((quarto) => {
      let valor = false;
      let entradaSaida = false;
      let aux = {};
      response.data.map((reserva) => {
        // testa se o dia atual e igual a entrada ou a saida
        const a = moment(reserva.data_entrada);
        const b = moment(today);
        const diferenca = b.diff(a, 'days');
        const checkin = moment(reserva.data_entrada).format('l');
        const checkout = moment(reserva.data_saida).format('l');
        if (
          moment(today).format('l') === checkin &&
          quarto.n_quarto === reserva.n_quarto
        ) {
          if (entradaSaida) {
            valor = {
              ...aux,
              variante: 'oculpado',
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

          entradaSaida = true;
        } else if (
          moment(today).format('l') === checkout &&
          quarto.n_quarto === reserva.n_quarto
        ) {
          if (entradaSaida) {
            valor = {
              ...aux,
              variante: 'oculpado',
              nomeCheckin: reserva.cliente,
              entradaCheckin: reserva.data_entrada,
              saidaCheckin: reserva.data_saida,
              entradaSaida: true,
            };
          } else
            valor = {
              ...reserva,
              variante: 'oculpado',
            };
          aux = { ...valor };

          entradaSaida = true;
        }
        // testa se o dia atual está entre a entrada e a saida
        else if (
          moment(today).isBetween(reserva.data_entrada, reserva.data_saida) &&
          quarto.n_quarto === reserva.n_quarto &&
          !(diferenca % 2) &&
          today !== reserva.data_saida
        ) {
          valor = { ...reserva, variante: 'checkout' };
        } else if (
          moment(today).isBetween(reserva.data_entrada, reserva.data_saida) &&
          quarto.n_quarto === reserva.n_quarto
        ) {
          valor = { ...reserva, variante: 'checkin' };
        }
      });
      valor && novaList.push(valor);
    });

    setIsLoading(false);
    setListQuartos(novaList);
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
        <h1>Limpeza Diária</h1>
        <h3>{todayHeader}</h3>
      </Header>
      <h4>
        <strong>Legenda</strong>
      </h4>
      <h5 style={{ color: colors.primary }}>
        <AiFillCheckCircle style={{ marginRight: '3px' }} />
        Limpesa simples
      </h5>
      <h5 style={{ color: colors.warning }}>
        <AiFillCheckCircle style={{ marginRight: '3px' }} />
        Limpesa simples com troca de toalha
      </h5>
      <h5 style={{ color: colors.danger }}>
        <AiFillCheckCircle style={{ marginRight: '3px' }} />
        Limpesa completa
      </h5>
      <Row>
        {listQuartos.map((dado) => (
          <Col key={dado.n_quarto} sm={12} md={4} lg={4} className="my-1">
            {dado.entradaSaida ? (
              <CardEntradaSaidaPainel
                variante={dado.variante}
                nQuarto={dado.n_quarto}
                tipoQuarto={dado.tipo_quarto}
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
                nQuarto={dado.n_quarto}
                cliente={dado.cliente}
                tipoQuarto={dado.tipo_quarto}
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
