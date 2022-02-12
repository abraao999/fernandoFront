/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import { get } from 'lodash';
import Form from 'react-bootstrap/Form';
import { Col, Row } from 'react-bootstrap';
import { Container } from '../../styles/GlobalStyles';
import { Label } from './styled';
import axios from '../../services/axios';
import Loading from '../../components/Loading';
import history from '../../services/history';
import { buscaCep } from '../../util';
// import * as actions from '../../store/modules/auth/actions';
export default function CadCliente({ match }) {
  const id = get(match, 'params.id', '');

  const [validated, setValidated] = useState(false);

  const [nome, setNome] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [pais, setPais] = useState('');
  const [cor, setCor] = useState('');
  const [carro, setCarro] = useState('');
  const [cep, setCep] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      const response = await axios.get(`/cliente/${id}`);
      console.log(id);
      if (id) {
        setNome(response.data.nome);
        setRg(response.data.rg);
        setCpf(response.data.cpf);
        setDataNascimento(response.data.data_nascimento);
        setTelefone(response.data.telefone);
        setCelular(response.data.celular);
        setEmail(response.data.email);
        setRua(response.data.rua);
        setNumero(response.data.numero);
        setBairro(response.data.bairro);
        setCidade(response.data.cidade);
        setEstado(response.data.estado);
        setCarro(response.data.carro);
        setCor(response.data.cor);
        setCep(response.data.cep);
      }

      setIsLoading(false);
    }
    getData();
  }, [id]);
  const limpaCampos = () => {
    setNome('');
    setRg('');
    setCpf('');
    setDataNascimento('');
    setTelefone('');
    setCelular('');
    setRua('');
    setNumero('');
    setBairro('');
    setCidade('');
    setEstado('');
    setPais('');
    setCep('');
    setCarro('');
    setCor('');
  };
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      // e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);

    setIsLoading(true);
    let formErrors = false;

    if (
      nome.length < 3 ||
      rg.length < 3 ||
      cpf.length < 11 ||
      celular.length < 11
    ) {
      formErrors = true;
      setIsLoading(false);
      toast.error('Preencha todos os campos');
    }
    if (formErrors) return;
    try {
      if (!id) {
        const response = await axios.post(`cliente`, {
          nome,
          rg,
          cpf,
          data_nascimento: dataNascimento || null,
          telefone,
          celular,
          email,
          rua,
          numero,
          bairro,
          cidade,
          estado,
          pais,
          carro,
          cor,
          cep,
        });
        console.log(response);
        limpaCampos();
        toast.success('Cliente criado com sucesso');
        history.push('/listaClientes');
        setIsLoading(false);
      } else {
        const response = await axios.put(`/cliente/${id}`, {
          nome,
          rg,
          cpf,
          data_nascimento: dataNascimento || null,
          telefone,
          celular,
          rua,
          numero,
          email,
          bairro,
          cidade,
          estado,
          pais,
          cep,
          carro,
          cor,
        });
        console.log(response);
        limpaCampos();
        toast.success('Cliente editado com sucesso');

        history.push('/listaClientes');
        setIsLoading(false);
      }
    } catch (error) {
      const status = get(error, 'response.data.status', 0);
      if (status === 401) {
        toast.error('Voce precisa fazer loggin');
      } else {
        toast.error('Erro ao cadastrar um cliente');
      }
      setIsLoading(false);
    }
  }
  const handleBuscaCep = async (e) => {
    setIsLoading(true);
    const textoForm = e.target.value;

    buscaCep(textoForm).then((response) => {
      console.log(response);
      setRua(response.logradouro || '');
      setBairro(response.bairro || '');
      setCidade(response.localidade || '');
      setEstado(response.uf || '');
      setPais('Brasil');
    });

    setIsLoading(false);
  };
  return (
    <Container>
      <h1> Cadastro de cliente completo</h1>
      <Loading isLoading={isLoading} />

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col sm={12} md={12} className="my-1">
            <Form.Label htmlFor="nome">Nome completo:</Form.Label>
            <Form.Control
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value.toLocaleUpperCase());
                // handleInput(e, 'nome');
              }}
              placeholder="Nome"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="rg">RG:</Form.Label>
            <Form.Control
              id="rg"
              type="text"
              value={rg}
              onChange={(e) => {
                setRg(e.target.value);
                // handleInput(e, 'rg');
              }}
              placeholder="RG"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Label htmlFor="cpf">
              CPF:
              <InputMask
                mask="999.999.999-99"
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => {
                  setCpf(e.target.value);
                  // handleInput(e, 'cpf');
                }}
                placeholder="000.000.000-00"
              />
              {/* <small>Minimo de 3 caracteres</small> */}
            </Label>
          </Col>
          <Col sm={12} md={4} className="my-1">
            <Form.Label htmlFor="dataNascimento">
              Data de Nascimento:
            </Form.Label>
            <Form.Control
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => {
                setDataNascimento(e.target.value);
              }}
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira uma data valida
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row className="align-items-center">
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
                  // handleInput(e, 'telefone');
                }}
                placeholder="(00) 00000-0000"
              />
              {/* <small>Insira um número válido</small> */}
            </Label>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Label htmlFor="celular">
              Telefone:
              <InputMask
                mask="(99) 99999-9999"
                id="celular"
                type="text"
                value={telefone}
                onChange={(e) => {
                  setTelefone(e.target.value);
                  // handleInput(e, 'telefone');
                }}
                placeholder="(00) 00000-0000"
              />
              {/* <small>Insira um número válido</small> */}
            </Label>
          </Col>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="email">E-mail:</Form.Label>
            <Form.Control
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLocaleLowerCase());
                // handleInput(e, 'email');
              }}
              placeholder="exemplo@email.com"
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira um e-mail válido
            </Form.Control.Feedback>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={3} className="my-1">
            <Label htmlFor="cep">
              CEP:
              <InputMask
                mask="99999-999"
                id="telefone"
                type="text"
                value={cep}
                onChange={(e) => {
                  setCep(e.target.value);
                  // handleInput(e, 'telefone');
                }}
                onBlur={(e) => handleBuscaCep(e)}
                placeholder="15400-000"
              />
              {/* <small>Insira um número válido</small> */}
            </Label>
          </Col>
          <Col sm={12} md={6} className="my-1">
            <Form.Label htmlFor="email">Rua:</Form.Label>
            <Form.Control
              id="rua"
              type="text"
              value={rua}
              onChange={(e) => {
                setRua(e.target.value.toUpperCase());
                // handleInput(e, 'email');
              }}
              placeholder="Nome da rua"
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira um nome de rua válido
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="numero">Número:</Form.Label>
            <Form.Control
              id="numero"
              type="text"
              value={numero}
              onChange={(e) => {
                setNumero(e.target.value);
                // handleInput(e, 'numero');
              }}
              placeholder="Número"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="bairro">Bairro:</Form.Label>
            <Form.Control
              id="bairro"
              type="text"
              value={bairro}
              onChange={(e) => {
                setBairro(e.target.value.toUpperCase());
                // handleInput(e, 'email');
              }}
              placeholder="Bairro"
              required
            />
            <Form.Control.Feedback type="invalid">
              Insira um nome de rua válido
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="cidade">Cidade:</Form.Label>
            <Form.Control
              id="cidade"
              type="text"
              value={cidade}
              onChange={(e) => {
                setCidade(e.target.value.toUpperCase());
                // handleInput(e, 'cidade');
              }}
              placeholder="Cidade"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="estado">Estado:</Form.Label>
            <Form.Control
              id="estado"
              type="text"
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value.toUpperCase());
                // handleInput(e, 'estado');
              }}
              placeholder="Estado"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="pais">Pais:</Form.Label>
            <Form.Control
              id="pais"
              type="text"
              value={pais}
              onChange={(e) => {
                setPais(e.target.value.toUpperCase());
                // handleInput(e, 'Pais');
              }}
              placeholder="Pais"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="Carro">Carro:</Form.Label>
            <Form.Control
              id="Carro"
              type="text"
              value={carro}
              onChange={(e) => {
                setCarro(e.target.value.toUpperCase());
                // handleInput(e, 'Carro');
              }}
              placeholder="Carro"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
          <Col sm={12} md={3} className="my-1">
            <Form.Label htmlFor="Cor">Cor:</Form.Label>
            <Form.Control
              id="Cor"
              type="text"
              value={cor}
              onChange={(e) => {
                setCor(e.target.value.toUpperCase());
                // handleInput(e, 'Cor');
              }}
              placeholder="Cor"
              required
            />
            <Form.Control.Feedback type="invalid">
              Minimo de 3 caracteres
            </Form.Control.Feedback>
          </Col>
        </Row>

        <button type="submit">Salvar</button>
      </Form>
    </Container>
  );
}
CadCliente.protoTypes = {
  match: PropTypes.shape({}).isRequired,
};
