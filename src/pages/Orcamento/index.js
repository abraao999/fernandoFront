/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { AiFillPrinter } from 'react-icons/ai';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import {
  FaEdit,
  FaWindowClose,
  FaSearch,
  FaCalculator,
  FaPlus,
} from 'react-icons/fa';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import moment from 'moment';
import { Container } from '../../styles/GlobalStyles';
import { Header, Label, Listagem, Topo } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';
import { Impressao } from '../../printers/impRelatorioDizimoGeral';
import { getDataBanco } from '../../util';
import CardComponent from '../../components/Card';
import ModalAddCliente from '../../components/ModalAddCliente';
import ComboBox from '../../components/ComboBox';
import * as colors from '../../config/colors';
import qtdeQuartos, { adultos, crianca } from '../../config/QtdeQuartos';
import { listTaxaMaquina, listTiposPagamento } from '../../config/pagamento';

import 'moment/locale/pt-br';
import ModalBuscaCliente from '../../components/ModalBuscaCliente';
import ModalCrianca from '../../components/ModalCrianca';
import CardDetailQuarto from '../../components/CardDetailQuarto';

export default function Orcamento({ match }) {
  const id = get(match, 'params.id', '');

  const [show, setShow] = useState(false);
  const [showCliente, setShowCliente] = useState(false);
  const [showCrianca, setShowCrianca] = useState(false);

  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [valorDiaria, setValorDiaria] = useState('');
  const [tipoQuarto, setTipoQuarto] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState('');
  const [valorFinal, setValorFinal] = useState('');
  const [qtdeParcela, setQtdeParcelas] = useState('');
  const [taxaMaquina, setTaxaMaquina] = useState('');
  const [numeroQuarto, setNumeroQuarto] = useState('');
  const [qtdeAdultos, setQtdeAdultos] = useState('');

  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [hiddenParcelas, setHiddenParcelas] = useState(true);
  const [hiddenForm, setHiddenForm] = useState(true);

  const [quantidadeFilhos, setQuantidadeFilhos] = useState([]);
  const [listQuartos, setListQuartos] = useState([]);
  const [listClientes, setListCliente] = useState([]);
  const [listTipoQuarto, setListTipoQuarto] = useState([]);
  const [idadeFilhos, setIdadeFilhos] = useState([]);
  const [listQtdeQuartosOrcamento, setListQtdeQuartosOrcamento] = useState([]);
  const [listAdultos, setListAdultos] = useState(adultos);
  const [listCriancas, setListCriancas] = useState(crianca);

  const [idCliente, setIdCliente] = useState('');
  const [qtdeQuartosOrcamento, setQtdeQuartosOrcamento] = useState('');
  const quartos = [
    { id: 1, descricao: 1 },
    { id: 2, descricao: 2 },
    { id: 3, descricao: 3 },
    { id: 4, descricao: 4 },
    { id: 5, descricao: 5 },
    { id: 6, descricao: 6 },
    { id: 7, descricao: 7 },
    { id: 9, descricao: 9 },
    { id: 10, descricao: 10 },
    { id: 11, descricao: 11 },
    { id: 12, descricao: 12 },
  ];
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      setListQuartos(qtdeQuartos);
      if (id) {
        const response = await axios.get(`/orcamento/${id}`);
        console.log(response.data);
        const {
          cliente_id,
          n_quarto,
          data_entrada,
          data_saida,
          natureza,
          tipo_quarto,
          parcelas,
          valor,
        } = response.data;
        const response2 = await axios.get(`/cliente/${cliente_id}`);

        setHiddenParcelas(false);
        setHiddenForm(false);
        setIdCliente(cliente_id);
        setNomeCliente(response2.data.nome);
        setNumeroQuarto(n_quarto);
        setDataInicial(data_entrada);
        setDataFinal(data_saida);
        setTipoPagamento(natureza);
        setTipoQuarto(tipo_quarto);
        setQtdeParcelas(parcelas);
        setValorFinal(valor);
        verificaQuarto();
      }
      const response = await axios.get('/tipoQuarto');
      setListTipoQuarto(response.data);
      setIsLoading(false);
    }
    getData();
  }, []);
  const visualizarImpressao = async () => {
    const classeImpressao = new Impressao(listMovimentacao);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
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
        toast.warn('O quarto não está mais disponivel, verifique outro quarto');
        handleSubmit();
        setHidden(false);
      }
    } catch (e) {
      toast.error('Erro ao efetivar a reserva');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const novaList = [];
    const response = await axios.get('/reserva');
    if (dataInicial && dataFinal && dataInicial < dataFinal) {
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
        novaList.push(valor || quarto);
      });
    } else {
      toast.error('Escolha as datas de entrada e saída');
    }
    setIsLoading(false);
    setListQuartos(novaList);
  };
  const handleClose = () => {
    setShow(false);
    setIsLoading(false);
  };
  const handleFunctionConfirm = async () => {
    try {
      const response = await axios.post(`/cliente`, {
        nome: nomeCliente,
        data_nascimento: null,
        celular,
        email,
      });
      console.log(response);
      toast.success('Cliente adicionado com sucesso');

      // history.push('/listMembros');
      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao cadastrar um cliente');
      }
      setIsLoading(false);
    }
  };
  const handleOnChangeNome = (e) => {
    setNomeCliente(e.target.value);
  };
  const handleOnChangeCelular = (e) => {
    setCelular(e.target.value);
  };
  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleCalcularReserva = (e) => {
    e.preventDefault();
    let valor = 0;
    let diarias = 0;
    const di = new Date(dataInicial);
    const df = new Date(dataFinal);
    diarias = df.getDate() - di.getDate();

    valor = valorDiaria * diarias;

    setValorFinal(valor);
    console.log(diarias);
  };
  const handleTipoPagamento = (e) => {
    e.target.value === 'Parcelado' && setHiddenParcelas(false);
    setTipoPagamento(e.target.value);
  };
  const handleJurosMaquina = (e) => {
    listTaxaMaquina.map((dado) => {
      e.target.value === dado.descricao && setTaxaMaquina(dado.taxa);
    });
    setQtdeParcelas(e.target.value);
  };
  const handleFinalizarOrcamento = (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!id) {
        const response = axios.post('/orcamento', {
          n_quarto: numeroQuarto,
          cliente_id: idCliente,
          valor: valorFinal,
          natureza: tipoPagamento,
          tipo_quarto: tipoQuarto,
          parcelas: qtdeParcela,
          disponivel: false,
          data_entrada: moment(dataInicial).format(),
          data_saida: moment(dataFinal).format(),
        });
        toast.success('Orçamento finalizado com sucesso');
        console.log(response);
      } else {
        const response = axios.put(`/orcamento/${id}`, {
          n_quarto: numeroQuarto,
          cliente_id: idCliente,
          valor: valorFinal,
          natureza: tipoPagamento,
          tipo_quarto: tipoQuarto,
          parcelas: qtdeParcela,
          disponivel: false,
          data_entrada: moment(dataInicial).format(),
          data_saida: moment(dataFinal).format(),
        });
        toast.success('Orçamento finalizado com sucesso');
        console.log(response);
      }
      setIsLoading(false);
    } catch (err) {
      toast.error('Erro ao fazer o orçamento');
      console.log(err);
      setIsLoading(false);
    }
  };
  const handleIdCliente = async (idm) => {
    try {
      const response = await axios.get(`/cliente/${idm}`);
      console.log(response.data);
      setNomeCliente(response.data.nome);
      setIdCliente(response.data.id);
      setShowCliente(false);
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
  const handleTipoQuarto = (e) => {
    const tipo = e.target.value;
    listTipoQuarto.map((dado) => {
      if (tipo === dado.descricao) {
        setValorDiaria(dado.valor);
      }
    });
    setTipoQuarto(tipo);
  };
  const handleQtdeCrianca = (qtde, nQuarto) => {
    const qtc = [];
    for (let index = 0; index < qtde; index++) {
      qtc.push({
        id: index,
        descricao: `${index}`,
        idade: '',
        quarto: nQuarto,
      });
    }
    setShowCrianca(true);
    setQuantidadeFilhos(qtc);
  };
  const handleIdadeCrianca = (e, quarto) => {
    const aux = [];
    console.log(quarto);
    quantidadeFilhos.map((dado, index) => {
      if (dado.id === quarto.id)
        aux[index] = { ...quarto, idade: e.target.value };
      else aux.push(dado);
    });
    console.log(aux);
    setQuantidadeFilhos(aux);
  };
  const handleSelectQtdeQuartosOrcamento = (e) => {
    setQtdeQuartosOrcamento(e.target.value);
    const qtde = parseInt(e.target.value);
    const aux = [];
    for (let index = 0; index < qtde; index++) {
      aux.push({
        id: index,
        descricao: index + 1,
        adulto: '',
        crianca: '',
        idade: '',
        checked: false,
      });
    }
    setListQtdeQuartosOrcamento(aux);
  };
  const handleAlteraValorComboboxAdultos = (e, quarto) => {
    const aux = [];
    console.log(quarto);
    listQtdeQuartosOrcamento.map((dado, index) => {
      if (dado.id === quarto.id)
        aux[index] = { ...quarto, adulto: e.target.value };
      else aux.push(dado);
    });
    console.log(aux);
    setListQtdeQuartosOrcamento(aux);
  };
  const handleAlteraValorComboboxCrianca = (e, quarto) => {
    const aux = [];
    console.log(quarto);
    listQtdeQuartosOrcamento.map((dado, index) => {
      if (dado.id === quarto.id)
        aux[index] = { ...quarto, crianca: e.target.value };
      else aux.push(dado);
    });
    console.log(aux);
    setShowCrianca(true);
    handleQtdeCrianca(e.target.value, quarto.id);
    setListQtdeQuartosOrcamento(aux);
  };
  const handleDetailQuarto = (quarto) => {};
  return (
    <Container>
      <Loading isLoading={isLoading} />

      <ModalCrianca
        title="Selecione a(s) idade(s) da(s) criança(s)"
        list={quantidadeFilhos}
        show={showCrianca}
        idadeFilhos
        handleIdadeCrianca={handleIdadeCrianca}
        handleClose={() => setShowCrianca(false)}
        handleConfirm
        buttonCancel="Cancelar"
        buttonConfirm="Confirmar"
      />
      <ModalAddCliente
        title="Cadastro Parcial"
        handleClose={handleClose}
        show={show}
        onChangeNome={handleOnChangeNome}
        onChangeCelular={handleOnChangeCelular}
        onChangeEmail={handleOnChangeEmail}
        buttonCancel="Cancelar"
        buttonConfirm="Salvar"
        handleFunctionConfirm={handleFunctionConfirm}
      />
      <ModalBuscaCliente
        title="Selecione o membro"
        handleClose={() => setShowCliente(false)}
        show={showCliente}
        list={listClientes}
        buttonCancel="Fechar"
        handleIdCliente={handleIdCliente}
      />
      <Header>
        <h1>Orçamento</h1>
        <Button variant="success" onClick={visualizarImpressao}>
          <AiFillPrinter size={40} />
        </Button>
      </Header>
      <Form>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataInicial">Data Inicial</Form.Label>
            <Form.Control
              type="date"
              value={dataInicial}
              onChange={(e) => {
                setDataInicial(e.target.value);
              }}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="dataInicial">Data Final</Form.Label>
            <Form.Control
              type="date"
              value={dataFinal}
              onChange={(e) => {
                setDataFinal(e.target.value);
              }}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <ComboBox
              value={qtdeQuartosOrcamento}
              onChange={handleSelectQtdeQuartosOrcamento}
              title="Quantidade de Quartos"
              list={quartos}
            />
          </Col>
          <Col
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              marginBottom: '3px',
            }}
            sm={12}
            md={3}
          />
        </Row>
      </Form>
      <Form onSubmit={handleSubmit}>
        {listQtdeQuartosOrcamento.map((dado) => (
          <Row key={dado.id}>
            <strong>Quarto {dado.descricao}</strong>
            <Col sm={12} md={2} className="my-1">
              <Label htmlFor="congregacao">
                Aldultos
                <select
                  onChange={(e) => handleAlteraValorComboboxAdultos(e, dado)}
                  value={dado.adulto}
                >
                  <option value="">-</option>
                  {listAdultos.map((ad, index) => (
                    <option key={ad.id} value={ad.descricao}>
                      {ad.descricao}
                    </option>
                  ))}
                </select>
              </Label>
            </Col>
            <Col sm={12} md={2} className="my-1">
              <Label htmlFor="congregacao">
                Crianças
                <select
                  onChange={(e) => handleAlteraValorComboboxCrianca(e, dado)}
                  value={dado.crianca}
                >
                  <option value="">-</option>
                  {listCriancas.map((ad, index) => (
                    <option key={ad.id} value={ad.descricao}>
                      {ad.descricao}
                    </option>
                  ))}
                </select>
              </Label>
            </Col>
          </Row>
        ))}
        <Col
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            marginBottom: '3px',
          }}
        >
          <Button variant="success" type="submit">
            Velificar disponibilidade <FaSearch />
          </Button>
        </Col>
      </Form>

      <CardDetailQuarto list={listQtdeQuartosOrcamento} />
      <Row hidden={hidden}>
        <h3>Quartos Disponíveis</h3>
        {listQuartos.map((dado) => (
          <Col key={dado.n_quarto} sm={12} md={4} lg={4} className="my-1">
            <CardComponent
              disponibilidade={dado.disponivel}
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
              onClick={() => {
                setHiddenForm(false);
                setHidden(true);
                setNumeroQuarto(dado.n_quarto);
              }}
            />
          </Col>
        ))}
      </Row>
      <Form onSubmit={handleFinalizarOrcamento} hidden={hiddenForm}>
        <Row>
          <Col sm={6} md={2} className="my-1">
            <Form.Label htmlFor="nQuarto">Nº Quarto</Form.Label>
            <Form.Control
              type="text"
              value={numeroQuarto + 1}
              onChange={(e) => {
                setNomeCliente(e.target.value);
              }}
            />
          </Col>
          <Col sm={6} md={8} className="my-1">
            <Form.Label htmlFor="nomeCliente">Nome do Cliente</Form.Label>
            <Form.Control
              type="text"
              value={nomeCliente}
              onChange={(e) => {
                setNomeCliente(e.target.value);
              }}
            />
          </Col>
          <Col
            sm={3}
            md={2}
            className="my-1"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
            }}
          >
            <Button
              onClick={() => handleBuscaCliente()}
              type="button"
              value="Buscar"
              variant="success"
            >
              <FaSearch size={16} />
            </Button>
            <Button
              type="button"
              value="Adicionar"
              onClick={() => {
                setIsLoading(true);
                setShow(true);
              }}
              variant="success"
            >
              <FaPlus size={16} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Label htmlFor="congregacao">
              Selecione o mês
              <select onChange={handleTipoQuarto} value={tipoQuarto}>
                <option value="nada">Selecione o mês</option>
                {listTipoQuarto.map((dado) => (
                  <option key={dado.id} value={dado.descricao}>
                    {dado.descricao}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="Valor">Valor do diária</Form.Label>
            <Form.Control
              type="number"
              value={valorDiaria}
              onChange={(e) => {
                setValorDiaria(e.target.value);
              }}
            />
          </Col>
          <Col sm={12} md={3} className="my-1">
            <ComboBox
              title="Tipo de Pagamento"
              list={listTiposPagamento}
              text="Selecione o estado civil"
              value={tipoPagamento}
              onChange={(e) => {
                handleTipoPagamento(e);
              }}
            />
          </Col>
          <Col sm={12} md={3} className="my-1" hidden={hiddenParcelas}>
            <ComboBox
              title="Quantide de Parcelas"
              list={listTaxaMaquina}
              text="Selecione o estado civil"
              value={qtdeParcela}
              onChange={(e) => {
                handleJurosMaquina(e);
              }}
            />
          </Col>
          <Col
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              marginBottom: '3px',
            }}
          >
            <Button
              variant="success"
              type="button"
              onClick={handleCalcularReserva}
            >
              Calcular <FaCalculator />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="Valor">Valor final</Form.Label>
            <Form.Control
              type="number"
              value={valorFinal}
              onChange={(e) => {
                setValorFinal(e.target.value);
              }}
              disabled
            />
          </Col>
          <Col
            sm={12}
            md={3}
            className="my-1"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <Button
              variant="success"
              type="button"
              onClick={handleFinalizarOrcamento}
            >
              Reservar
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
Orcamento.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
