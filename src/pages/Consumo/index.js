/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import {
  FaEdit,
  FaWindowClose,
  FaSearch,
  FaSave,
  FaCheck,
} from 'react-icons/fa';

import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { AiFillDelete, AiFillPrinter } from 'react-icons/ai';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useSelector } from 'react-redux';
import { Container } from '../../styles/GlobalStyles';
import { Header, Label, Listagem } from './styled';
import axios from '../../services/axios';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import ComboBox from '../../components/ComboBox';

// import * as actions from '../../store/modules/auth/actions';

import { Impressao } from '../../printers/impRelatorioDiario';
import qtdeQuartos from '../../config/QtdeQuartos';

export default function Consumo() {
  const dataUser = useSelector((state) => state.auth.user);

  const [show, setShow] = useState(false);
  const [idProduto, setIdProduto] = useState('');
  const [indiceDelecao, setIndiceDelecao] = useState('');

  const [valor, setValor] = useState('');
  const [quantidade, setQuantidae] = useState('');
  const [descricao, setDescricao] = useState('');
  const [pagamento, setPagamento] = useState('');
  const [nQuarto, setnQuarto] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [dataFiltro, setDataFiltro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [hidden, setHidden] = useState(true);
  const listPagamento = [
    { id: 0, descricao: 'No Local' },
    { id: 1, descricao: 'Checkout' },
  ];
  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      const response = await axios.get('/produto');
      setProdutos(response.data);
      setIsLoading(false);
    }
    getData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!idProduto) {
        const response = await axios.post('/produto/', {
          descricao,
          valor,
          quantidade,
        });
        toast.success('Produto cadastrado com sucesso');
      } else {
        const response = await axios.put(`/produto/${idProduto}`, {
          descricao,
          valor,
          quantidade,
        });
        toast.success('Produto alterado com sucesso');
      }
      const response = await axios.get('/produto');
      setProdutos(response.data);
    } catch (er) {
      toast.error('Erro ao adicionar ou editar o produto');
    }

    setIsLoading(false);
  }
  const visualizarImpressao = async () => {
    const novaLista = [];
    produtos.map((dado) => {
      novaLista.push({
        id: dado.id,
        descricao: dado.descricao,
        nNota: dado.nNota,
        dataOp: dado.dataOp,
        valor: dado.valor,
        tipo: dado.tipo ? 'Entrada' : 'Saída',
        investimento: dado.investimento ? 'Investimento' : 'Despesa',
        idDepartamento: dado.departamento_id,
        idSetor: dado.setor_id,
        descDepartamento: dado.desc_departamento,
        descSetor: dado.desc_setor,
      });
    });
    const classeImpressao = new Impressao(novaLista);
    const documento = await classeImpressao.PreparaDocumento();
    pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (idFuncao, index) => {
    setIdProduto(index);
    setShow(true);
  };
  const handleFunctionConfirm = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/produto/${idProduto}`);
      const novaList = [...produtos];
      novaList.splice(indiceDelecao, 1);
      setProdutos(novaList);
      toast.success('Produto excluido com sucesso');
      setShow(false);
      setIsLoading(false);
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao excluir o produto');
      }
      setIsLoading(false);
    }
  };
  const handleBuscaProduto = async () => {
    try {
      const novaLista = [];
      const response = await axios.get('/produto');
      response.data.map((dados) => {
        if (
          String(dados.descricao)
            .toLowerCase()
            .includes(String(descricao.toLowerCase()))
        ) {
          novaLista.push(dados);
        }
      });

      setProdutos(novaLista);
      console.log(novaLista);
    } catch (e) {
      toast.error('Condigo não existe');
      console.log(e);
    }
  };
  return (
    <Container>
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
      <Header>
        <h2>Consumo</h2>
        <Button variant="success" type="button" onClick={visualizarImpressao}>
          <AiFillPrinter size={35} />
        </Button>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="valor">Pesquisa:</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              onBlur={(e) => handleBuscaProduto()}
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
              onClick={handleBuscaProduto}
            >
              <FaSearch size={30} />
            </Button>
          </Col>
        </Row>
      </Form>
      <Listagem>
        <h3>Estoque</h3>
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
                <th scope="col">Descricao</th>
                <th scope="col">Valor</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Selecionar</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((dado, index) => (
                <tr key={String(dado.id)}>
                  <td>{dado.descricao}</td>
                  <td>{dado.valor}</td>
                  <td>{dado.quantidade}</td>

                  <td>
                    <Button
                      variant="success"
                      onClick={(e) => {
                        setIdProduto(dado.id);
                        setDescricao(dado.descricao);
                        setValor(dado.valor);
                        setQuantidae(dado.quantidade);
                      }}
                    >
                      <FaCheck size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </center>
      </Listagem>
      <Form>
        <h3>Finalizar Compra</h3>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="valor">Pesquisa:</Form.Label>
            <Form.Control
              id="input"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              onBlur={(e) => handleBuscaProduto()}
            />
          </Col>
          <Col sm={12} md={2} className="my-1">
            <Form.Label htmlFor="valor">Quantidade:</Form.Label>
            <Form.Control
              id="input"
              type="number"
              value={quantidade}
              onChange={(e) => setDescricao(e.target.value)}
              onBlur={(e) => handleBuscaProduto()}
            />
          </Col>
          <Col sm={12} md={2} className="my-1">
            <ComboBox
              title="Pagamento"
              onChange={(e) => setPagamento(e.target.vlue)}
              value={pagamento}
              list={listPagamento}
            />
          </Col>
          <Col sm={12} md={2} className="my-1">
            <Label htmlFor="congregacao">
              <label htmlFor="">Nº Quarto</label>
              <select
                onChange={(e) => setnQuarto(e.target.value)}
                value={nQuarto}
              >
                <option value="nada">Nº Quarto</option>
                {qtdeQuartos.map((dado) => (
                  <option key={dado.n_quarto} value={dado.n_quarto}>
                    {dado.n_quarto + 1}
                  </option>
                ))}
              </select>
            </Label>
          </Col>
          <Col
            sm={12}
            md={2}
            className="my-1"
            style={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <Button
              type="button"
              variant="success"
              onClick={handleBuscaProduto}
            >
              <FaSearch size={30} />
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
