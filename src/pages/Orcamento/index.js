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
import { FaSearch } from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import moment from 'moment';
import { Container } from '../../styles/GlobalStyles';
import {
  CardBody,
  CardBox,
  CardDados,
  CardHeader,
  Header,
  Label,
  Listagem,
  TextBold,
} from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';
import CardComponent from '../../components/Card';
import ModalAddCliente from '../../components/ModalAddCliente';
import ComboBox from '../../components/ComboBox';
import * as colors from '../../config/colors';
import qtdeQuartos, { adultos, crianca } from '../../config/QtdeQuartos';

import 'moment/locale/pt-br';
import ModalBuscaCliente from '../../components/ModalBuscaCliente';
import ModalCrianca from '../../components/ModalCrianca';
import CardDetailQuarto from '../../components/CardDetailQuarto';
import ModalDadosClientePreserva from '../../components/ModalDadosClientePreserva';

export default function Orcamento() {
  const [show, setShow] = useState(false);
  const [showCliente, setShowCliente] = useState(false);
  const [showCrianca, setShowCrianca] = useState(false);
  const [
    showModalDadosClientePreserva,
    setShowModalDadosClientePreserva,
  ] = useState(false);

  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [tipoQuarto, setTipoQuarto] = useState('');
  const [valorFinal, setValorFinal] = useState(0);
  const [listMovimentacao, setListMovimentacao] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [hiddenResumoFinal, setHiddenResumoFinal] = useState(true);
  const [hiddenTotal, setHiddenTotal] = useState(false);
  const [
    hiddenButtonGrupSelectQuartoDetail,
    setHiddenButtonGrupSelectQuartoDetail,
  ] = useState(true);
  const [hiddenFormSelecaoPessoas, setHiddenFormSelecaoPessoas] = useState(
    true
  );
  const [disabledButton, setDisabledButton] = useState(false);

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
  const [quartoDetail, setQuartoDetail] = useState('');
  const [adultoDetail, setAdultoDetail] = useState('');
  const [criancaDetail, setCriancaDetail] = useState('');
  const [descricao, setDescricao] = useState('');
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
  const [radioValue, setRadioValue] = useState('');
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      setListQuartos(qtdeQuartos);

      const response = await axios.get('/tipoQuarto');
      setListTipoQuarto(response.data);
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
      setHiddenButtonGrupSelectQuartoDetail(false);
      setListQtdeQuartosOrcamento(listaReserva);
      console.log(listaReserva);
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
  const handleOnChangeNome = (e) => {
    setNomeCliente(e.target.value);
  };
  const handleOnChangeCelular = (e) => {
    setCelular(e.target.value);
  };
  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleCalcularReserva = (valor) => {
    let diarias = 0;
    const di = new Date(dataInicial);
    const df = new Date(dataFinal);
    diarias = df.getDate() - di.getDate();

    valor *= diarias;

    return valor;
  };
  const handleFinalizarOrcamento = async () => {
    setHiddenTotal(true);
    setDisabledButton(true);

    toast.warning('Enviando Pedido');

    let bodyHtml = '';
    listQuartosEscolhidos.map((dado, index) => {
      bodyHtml += `
      <div>
      <p><strong>Quarto: </strong><span>${index + 1}</span></p>
      <p><strong>Tipo quanto: </strong><span>${dado.tipo}</span></p>
      <p><strong>Adultos: </strong><span>${dado.adulto}</span></p>
      <p><strong>Criança: </strong><span>${dado.crianca}</span></p>
      <p><strong>Valor: </strong><span>${dado.valorReserva}</span></p>
      <br/>
      </div>`;
    });
    bodyHtml += `
    <div>
    <p><strong>Nome Cliente: </strong><span>${nomeCliente}</span></p>
    <p><strong>Telefone: </strong><span>${celular}</span></p>
    <p><strong>E-mail: </strong><span>${email}</span></p>
    </div>`;
    try {
      // const response = await axios.po', {
      //   bodyHtml,
      //   email,
      // });
      toast.success('Pedido de orçamento enviado com sucesso');
    } catch (error) {
      toast.error('Desculpe mas não foi possível enviar sua solicitaçãos');
    }
    setDisabledButton(true);
    setHiddenTotal(false);
    setShowModalDadosClientePreserva(false);
    salvaCliente();
  };
  const salvaCliente = () => {
    try {
      axios
        .post(`/cliente`, {
          nome: nomeCliente,
          data_nascimento: null,
          celular,
          email,
        })
        .then((response) => {
          salvaOrcamento(response.data.id);
        });

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
  const salvaOrcamento = async (idCliente) => {
    try {
      listQuartosEscolhidos.map((dado) => {
        const response = axios.post('/orcamento', {
          n_quarto: dado.n_quarto,
          cliente_id: idCliente,
          valor: dado.valorReserva,
          tipo_quarto: dado.tipo,
          data_entrada: moment(dado.data_entrada).format(),
          data_saida: moment(dado.data_saida).format(),
        });
        console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
    // toast.success('Orçamento finalizado com sucesso');
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
    console.log(qtc);
    setQuantidadeFilhos(qtc);
  };
  const handleIdadeCrianca = (e, quarto) => {
    const aux = [];
    quantidadeFilhos.map((dado, index) => {
      if (dado.id === quarto.id) {
        aux[index] = { ...quarto, idade: e.target.value };
        idadeFilhos.push({ ...quarto, idade: e.target.value });
      } else aux.push(dado);
    });
    setQuantidadeFilhos(aux);
    console.log(aux);

    setIdadeFilhos(idadeFilhos);
    console.log(idadeFilhos);
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
    setHiddenTotal(false);
    setHiddenFormSelecaoPessoas(false);
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
  const classificaoQuarto = (quarto) => {
    setIsLoading(true);
    const tipos = [];
    let bebe = false;
    let quantideCriancas = 0;
    const adultoTemp = parseInt(quarto.adulto);
    // apenas 1 adulto ou simples sem crianca
    if (adultoTemp === 1 && !quarto.crianca) tipos.push('Duplo');
    // apenas 1 adulto ou simples com crinca
    else if (adultoTemp === 1 && quarto.crianca) {
      idadeFilhos.map((idade) => {
        if (idade.quarto === quarto.id)
          if (parseInt(idade.idade) === 0) {
            bebe = true;
            quantideCriancas++;
          } else quantideCriancas++;
      });

      // com 1 adulto 1 crianca
      if (quantideCriancas === 1) {
        tipos.push('Duplo');
        tipos.push('Triplo');
      }
      // com 1 adulto 2 crianca
      else if (quantideCriancas === 2) {
        tipos.push('Triplo');
        tipos.push('Quádruplo');
      }
      // com 3 adultos apenas um filho bebe
      else if (quantideCriancas === 3) tipos.push('Quádruplo');
      else
        toast.error(
          'Limite de pessoas excedido aumente a quantidade de quartos'
        );
    }
    // apenas 2 adulto ou simples sem crianca
    else if (adultoTemp === 2 && !quarto.crianca) {
      tipos.push('Duplo');
    }
    // apenas 2 adulto ou simples com crinca
    else if (adultoTemp === 2 && quarto.crianca) {
      idadeFilhos.map((idade) => {
        if (idade.quarto === quarto.id)
          if (parseInt(idade.idade) === 0) {
            bebe = true;
            quantideCriancas++;
          } else quantideCriancas++;
      });

      // com 2 adulto 1 bebe
      if (quantideCriancas === 1 && bebe) {
        tipos.push('Duplo');
        tipos.push('Triplo');
      }
      // com 2 adulto 1 crianca
      else if (quantideCriancas === 1 && !bebe) {
        tipos.push('Triplo');
        tipos.push('Quádruplo');
      }
      // com 2 adulto 1 bebe e 1 crianca
      else if (quantideCriancas === 2 && bebe) {
        tipos.push('Triplo');
        tipos.push('Quádruplo');
      }
      // com 2 adulto 2 crianca
      else if (quantideCriancas === 2 && !bebe) tipos.push('Quádruplo');
      else
        toast.error(
          'Limite de pessoas excedido aumente a quantidade de quartos'
        );
    }
    // apenas 3 adulto ou simples sem crianca
    else if (adultoTemp === 3 && !quarto.crianca) {
      tipos.push('Triplo');
      tipos.push('Quádruplo');
    }
    // apenas 3 adulto ou simples com crinca
    else if (adultoTemp === 3 && quarto.crianca) {
      idadeFilhos.map((idade) => {
        if (idade.quarto === quarto.id)
          if (parseInt(idade.idade) === 0) {
            bebe = true;
            quantideCriancas++;
          } else quantideCriancas++;
      });

      // com 3 adulto 1 bebe
      if (quantideCriancas === 1 && bebe) {
        tipos.push('Triplo');
        tipos.push('Quádruplo');
      }
      // com 3 adulto 1 crianca
      else if (quantideCriancas === 1 && !bebe) {
        tipos.push('Quádruplo');
        tipos.push('Quíntuplo');
      }
      // com 3 adulto 1 bebe e 1 crianca
      else if (quantideCriancas === 2 && bebe) {
        tipos.push('Quádruplo');
        tipos.push('Quíntuplo');
      }
      // com 3 adulto 3 crianca
      else
        toast.error(
          'Limite de pessoas excedido aumente a quantidade de quartos'
        );
    }
    // apenas 4 adulto ou simples sem crianca
    else if (adultoTemp === 4 && !quarto.crianca) {
      tipos.push('Quádruplo');
    }
    // apenas 4 adulto ou simples com crinca
    else if (adultoTemp === 4 && quarto.crianca) {
      idadeFilhos.map((idade) => {
        if (idade.quarto === quarto.id)
          if (parseInt(idade.idade) === 0) {
            bebe = true;
            quantideCriancas++;
          } else quantideCriancas++;
      });

      // com 4 adulto 1 bebe
      if (quantideCriancas === 1 && bebe) {
        tipos.push('Quádruplo');
        tipos.push('Quíntuplo');
      }
      // com 4 adulto 1 crianca
      else if (quantideCriancas === 1 && !bebe) tipos.push('Quíntuplo');
      else
        toast.error(
          'Limite de pessoas excedido aumente a quantidade de quartos'
        );
    }
    // outros valores
    else toast.error('Limite de pessoas');

    setIdadeFilhos([]);
    handleQuartoDetail({ ...quarto, tipos });
  };
  const handleQuartoDetail = async (quarto) => {
    const novaList = [];
    console.log(quarto.tipos);
    listQtdeQuartosOrcamento.map(async (dado) => {
      if (quarto.id === dado.id) {
        listTipoQuarto.map((desc) => {
          quarto.tipos.map((tipo) => {
            if (desc.nome === tipo) {
              const va = parseFloat(desc.valor).toFixed(2);
              const valorReserva = handleCalcularReserva(va);
              novaList.push({
                ...dado,
                valorReserva,
                tipo: desc.nome,
                descricao: desc.descricao,
                escolhido: false,
                button: 'Escolher',
              });
            }
          });
        });
      }
    });
    console.log(novaList);
    setShowCardDetailQuarto(novaList);
    setIsLoading(false);
  };
  const handleEscolhaQuarto = (opcao) => {
    let novoValor = valorFinal;
    setHiddenResumoFinal(false);

    if (!opcao.escolhido) {
      const novaLista = [...listQuartosEscolhidos];
      novaLista.push(opcao);
      setListQuartosEscolhidos(novaLista);
      console.log(novaLista);

      showCardDetailQuarto.map((dado, index) => {
        if (dado.tipo === opcao.tipo) {
          showCardDetailQuarto[index] = {
            ...opcao,
            button: 'Remover',
            escolhido: true,
          };
          novoValor += opcao.valorReserva;
        }
      });
      setValorFinal(novoValor);

      setShowCardDetailQuarto(showCardDetailQuarto);
    } else {
      showCardDetailQuarto.map((dado, index) => {
        if (dado.tipo === opcao.tipo) {
          showCardDetailQuarto[index] = {
            ...opcao,
            button: 'Escolher',
            escolhido: false,
          };
        }
        novoValor -= opcao.valorReserva;
      });
      setValorFinal(novoValor);

      setShowCardDetailQuarto(showCardDetailQuarto);
      const aux = listQuartosEscolhidos.indexOf(opcao);
      const novaListQuartosEscolhidos = [...listQuartosEscolhidos];
      novaListQuartosEscolhidos.splice(aux, 1);
      setListQuartosEscolhidos(novaListQuartosEscolhidos);
    }
  };
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
        buttonCancel="Cancelar"
        buttonConfirm="Confirmar"
      />
      <ModalDadosClientePreserva
        title="Formulário de pré reserva"
        show={showModalDadosClientePreserva}
        buttonCancel="Cancelar"
        buttonConfirm="Enviar"
        handleFunctionConfirm={handleFinalizarOrcamento}
        handleClose={() => setShowModalDadosClientePreserva(false)}
        nomeCliente={nomeCliente}
        celular={celular}
        email={email}
        isLoading={isLoadingModal}
        onChangeNome={handleOnChangeNome}
        onChangeCelular={handleOnChangeCelular}
        onChangeEmail={handleOnChangeEmail}
        disabledButton={disabledButton}
      />
      <Header>
        <h1>Orçamento</h1>
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
      <section hidden={hiddenTotal}>
        <Form onSubmit={handleSubmit} hidden={hiddenFormSelecaoPessoas}>
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
              Verificar disponibilidade <FaSearch />
            </Button>
          </Col>
        </Form>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'space-around',
          }}
          hidden={hiddenButtonGrupSelectQuartoDetail}
        >
          {listQtdeQuartosOrcamento.map((radio, idx) => (
            <Button
              key={idx}
              id={`radio-${idx}`}
              type="button"
              variant={
                radioValue === radio.value ? 'success' : 'outline-success'
              }
              value={radio.value}
              onClick={(e) => {
                classificaoQuarto(radio);
                setRadioValue(e.currentTarget.value);
              }}
              style={{ margin: 5 }}
            >
              Quarto {radio.name}
            </Button>
          ))}
        </div>
        <CardDetailQuarto
          list={showCardDetailQuarto}
          listFilhos={idadeFilhos}
          handleQuartoDetail={classificaoQuarto}
          quartoDetail={quartoDetail}
          crianca={criancaDetail}
          adulto={adultoDetail}
          tipo={tipoQuarto}
          descricao={descricao}
          valor={valorFinal}
          show={showDetail}
          handleEscolhaQuarto={handleEscolhaQuarto}
        />
        <CardBox hidden={hiddenResumoFinal}>
          <Row>
            <Col sm={12} md={9}>
              <CardHeader>Resumo da Reserva</CardHeader>
              {listQuartosEscolhidos.map((dado) => (
                <CardBody key={dado.id}>
                  <CardDados>
                    <TextBold>
                      Quarto:
                      <span>{dado.name}</span>
                    </TextBold>
                  </CardDados>
                  <CardDados>
                    <TextBold>
                      Descrição:
                      <span>{dado.descricao}</span>
                    </TextBold>
                  </CardDados>
                  <CardDados>
                    <TextBold>
                      Adultos:
                      <span>{dado.adulto}</span>
                    </TextBold>
                  </CardDados>
                  <CardDados>
                    <TextBold>
                      Criança:
                      <span>{dado.crianca}</span>
                    </TextBold>
                  </CardDados>
                  <CardDados>
                    <TextBold>
                      Tipo:
                      <span>{dado.tipo}</span>
                    </TextBold>
                  </CardDados>
                  <CardDados>
                    <TextBold>
                      Data Checkin:
                      <span>{moment(dado.data_entrada).format('L')}</span>
                    </TextBold>
                  </CardDados>
                  <CardDados>
                    <TextBold>
                      Data Checkout:
                      <span>{moment(dado.data_saida).format('L')}</span>
                    </TextBold>
                  </CardDados>
                  <br />
                </CardBody>
              ))}
              <CardHeader>Valor total: {valorFinal}</CardHeader>
            </Col>
            <Col
              sm={12}
              md={3}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="success"
                size="lg"
                onClick={() => setShowModalDadosClientePreserva(true)}
              >
                Finalizar Pré-Reserva
              </Button>
            </Col>
          </Row>
        </CardBox>
      </section>
    </Container>
  );
}
Orcamento.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
