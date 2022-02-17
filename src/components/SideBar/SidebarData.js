import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SidebarData = [
  {
    title: 'Hoje',
    path: '/',
    icon: <FaIcons.FaCalendarAlt />,
  },
  {
    title: 'Orçamentos',
    path: '#',
    icon: <FaIcons.FaCalculator />,
    iconClosed: <RiIcons.RiArrowDownCircleLine />,
    iconOpened: <RiIcons.RiArrowDownCircleLine />,

    subNav: [
      {
        title: 'Novo Orçamento',
        path: '/orcamento',
        icon: <FaIcons.FaCalculator />,
        cName: 'sub-nav',
      },
      {
        title: 'Lista de Orçamentos',
        path: '/listaOrcamento',
        icon: <FaIcons.FaList />,
        cName: 'sub-nav',
      },
    ],
  },
  {
    title: 'Reservas',
    path: '#',
    icon: <RiIcons.RiPencilLine />,

    iconClosed: <RiIcons.RiArrowDownCircleLine />,
    iconOpened: <RiIcons.RiArrowDownCircleLine />,

    subNav: [
      {
        title: 'Nova Reserva',
        path: '/reserva',
        icon: <FaIcons.FaPlus />,
      },
      {
        title: 'Buscar Reserva',
        path: '/listaReservas',
        icon: <FaIcons.FaSearch />,
      },
    ],
  },
  {
    title: 'Limpeza',
    path: '/painelLimpeza',
    icon: <AiIcons.AiOutlineClear />,
  },
  {
    title: 'Clientes',
    path: '#',
    icon: <IoIcons.IoMdPerson />,

    iconClosed: <RiIcons.RiArrowDownCircleLine />,
    iconOpened: <RiIcons.RiArrowDownCircleLine />,

    subNav: [
      {
        title: 'Nova Cliente',
        path: '/reserva',
        icon: <FaIcons.FaAddressBook />,
      },
      {
        title: 'Lista de Clientes',
        path: '/listaClientes',
        icon: <FaIcons.FaListAlt />,
      },
    ],
  },
  {
    title: 'Produtos',
    path: '#',
    icon: <FaIcons.FaCartPlus />,
    iconClosed: <RiIcons.RiArrowDownCircleLine />,
    iconOpened: <RiIcons.RiArrowDownCircleLine />,

    subNav: [
      {
        title: 'Estoque',
        path: '/estoque',
        icon: <FaIcons.FaList />,
      },
      {
        title: 'Consumo',
        path: '/consumo',
        icon: <FaIcons.FaCartPlus />,
      },
    ],
  },
  {
    title: 'Configurações',
    path: '#',
    icon: <AiIcons.AiFillSetting />,
    iconClosed: <RiIcons.RiArrowDownCircleLine />,
    iconOpened: <RiIcons.RiArrowDownCircleLine />,

    subNav: [
      {
        title: 'Configuração de Quartos',
        path: '/tipoQuarto',
        icon: <AiIcons.AiFillSetting />,
      },
      {
        title: 'Consumo',
        path: '/consumo',
        icon: <FaIcons.FaCartPlus />,
      },
    ],
  },

  {
    title: 'Support',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />,
  },
];
