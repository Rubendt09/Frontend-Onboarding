/* eslint-disable */

import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function UserView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('default');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Estados de error para los campos
  const [nameError, setNameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [rolError, setRolError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (fetchError) {
        console.error('Error al obtener los usuarios:', fetchError);
        setApiError('Error al cargar los usuarios');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const toggleDrawer =
    (open, user = null) =>
    (event) => {
      setOpenDrawer(open);
      setIsEditing(!!user);

      if (user) {
        setName(user.name);
        setLastname(user.lastname);
        setEmail(user.email);
        setRol(user.rol);
        setPassword('');
      } else {
        setName('');
        setLastname('');
        setEmail('');
        setRol('colaborador');
        setPassword('');
      }

      // Reiniciar los errores al abrir el Drawer
      setNameError(false);
      setLastnameError(false);
      setEmailError(false);
      setRolError(false);
      setPasswordError(false);
    };

  const validateUserForm = () => {
    let valid = true;

    if (!name) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }

    if (!lastname) {
      setLastnameError(true);
      valid = false;
    } else {
      setLastnameError(false);
    }

    if (!email) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!rol || rol === '') {
      setRolError(true);
      valid = false;
    } else {
      setRolError(false);
    }

    if (!password) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    return valid;
  };

  const handleCreateOrUpdateUser = async () => {
    // Verificar si el formulario es válido
    if (!validateUserForm()) {
      return; // Si hay errores, no continua con la creación/actualización
    }

    const userPayload = {
      name,
      lastname,
      email,
      password,
      rol,
    };

    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:8080/api/user/${email}`, userPayload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        const response = await axios.post('http://localhost:8080/api/user/register', userPayload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      setOpenDrawer(false);

      const updatedUsersResponse = await axios.get('http://localhost:8080/api/user/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(updatedUsersResponse.data);
    } catch (createOrUpdateUserError) {
      console.error('Error al registrar o actualizar el usuario:', createOrUpdateUserError);
      alert('Error al registrar o actualizar el usuario, por favor verifica los datos.');
    }
  };

  const handleDeleteUser = async (email) => {
    try {
      await axios.delete(`http://localhost:8080/api/user/${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert(`Usuario ${email} eliminado exitosamente.`);
      const updatedUsersResponse = await axios.get('http://localhost:8080/api/user/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(updatedUsersResponse.data); 
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Error al eliminar el usuario.');
    }
  };

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  if (apiError) {
    return <div>{apiError}</div>;
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Lista de Usuarios</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={toggleDrawer(true)}
        >
          Crear nuevo usuario
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'role', label: 'Role' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.email}
                      name={row.name}
                      lastname={row.lastname}
                      role={row.rol}
                      email={row.email}
                      selected={selected.indexOf(row.name) !== -1}
                      onEdit={toggleDrawer(true, row)}
                      onDelete={() => handleDeleteUser(row.email)} 
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Drawer para registrar o editar usuario */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <Container sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Editar usuario' : 'Registrar nuevo usuario'}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Nombre"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
              helperText={nameError ? 'Completar este campo' : ''}
            />
            <TextField
              label="Apellidos"
              fullWidth
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              error={lastnameError}
              helperText={lastnameError ? 'Completar este campo' : ''}
            />
            <TextField
              label="Correo electrónico"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? 'Completar este campo' : ''}
            />

            <Select
              label="Rol"
              fullWidth
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              error={rolError}
              helperText={rolError ? 'Completar este campo' : ''}
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="tutor">Tutor</MenuItem>
              <MenuItem value="colaborador">Colaborador</MenuItem>
            </Select>

            <TextField
              label="Contraseña"
              fullWidth
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? 'Completar este campo' : ''}
            />

            <Button variant="contained" onClick={handleCreateOrUpdateUser}>
              {isEditing ? 'Actualizar' : 'Registrar'}
            </Button>
          </Stack>
        </Container>
      </Drawer>
    </Container>
  );
}