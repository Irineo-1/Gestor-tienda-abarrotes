import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../componentes/Header';
import Modal from '../componentes/Modal';
import Navbar from '../componentes/Navbar';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}))

describe('Header', () => {
  it('renderiza el título y el botón de menú', () => {
    render(<Header />);

    const btnCerrarSesion = screen.getByRole("button", {name: /Cerrar sesion/i})
    fireEvent.click(btnCerrarSesion)

    expect(screen.getByText("¿Desea cerrar sesion?")).toBeInTheDocument()
  });
});

describe('Modal', () => {
  it('muestra el título y el contenido', () => {
    render(
      <Modal open={true} setOpen={() => {}} titulo="Título de prueba">
        <div>Contenido de prueba</div>
      </Modal>
    );
    expect(screen.getByText('Título de prueba')).toBeInTheDocument();
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });
});

describe('Navbar', () => {
  it('renderiza los enlaces principales', () => {
    render(<Navbar />);
    expect(screen.getByText('Caja')).toBeInTheDocument();
    expect(screen.getByText('Ventas')).toBeInTheDocument();
    expect(screen.getByText('Inventario')).toBeInTheDocument();
    expect(screen.getByText('Gestion de usuarios')).toBeInTheDocument();
  });
});
