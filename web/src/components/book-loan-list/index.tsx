import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getBookLoans } from '../../services/BookLoansService';

export function BookLoanList() {
  const [loans, setLoans] = useState<any[]>([])

  useEffect(() => {
    getBookLoans().then(setLoans)
  }, [])

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Autor</th>
            <th>Ano de publicação</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => (
            <tr key={loan.id}>
            <td>{loan.id}</td>
            <td>{loan.name}</td>
            <td>{loan.author}</td>
            <td></td>
          </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
