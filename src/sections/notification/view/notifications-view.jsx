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
import NotificationsTableRow from '../notifications-table-row';
import NotificationsTableHead from '../notifications-table-head';
import TableEmptyRows from '../table-empty-rows';
import NotificationsTableToolbar from '../notifications-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { Autocomplete, FormControl, InputLabel } from '@mui/material';

export default function NotificationView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('shippDate');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Estados de los campos
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [notificationId, setNotificationId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [urlImage, setUrlImage] = useState('');
  const [shippDate, setShippDate] = useState('');
  const [forAll, setForAll] = useState(false);
  const [userIds, setUserIds] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados de error para los campos
  const [titleError, setTitleError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [urlImageError, setUrlImageError] = useState(false);
  const [shippDateError, setShippDateError] = useState(false);
  const [forAllError, setForAllError] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/notifications/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (fetchError) {
        console.error('Error al obtener las notificaciones:', fetchError);
        setApiError('Error al cargar las notificaciones');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (event, value) => {
    // Actualizar la lista de IDs seleccionados
    setSelectedUsers(value);
    setSelectedUserIds(value.map((user) => user.id));
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
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
    inputData: notifications,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const toggleDrawer = (open, notification = null) => () => {
    setOpenDrawer(open);
    setIsEditing(!!notification);
  
    if (notification) {
      setNotificationId(notification.id);
      setTitle(notification.title);
      setMessage(notification.message);
      setUrlImage(notification.urlImage);
      setShippDate(notification.shippDate);
      setForAll(notification.forAll);
  
      // Cargar los usuarios seleccionados filtrando por sus IDs si forAll es false
      if (!notification.forAll && notification.userIds) {
        const selected = users.filter(user => notification.userIds.includes(user.id));
        setSelectedUsers(selected);
        setSelectedUserIds(notification.userIds);
      } else {
        setSelectedUsers([]);
        setSelectedUserIds([]);
      }
    } else {
      // Limpiar todos los campos para una nueva notificación
      setNotificationId('');
      setTitle('');
      setMessage('');
      setUrlImage('');
      setShippDate('');
      setForAll(true);
      setSelectedUsers([]);
      setSelectedUserIds([]);
    }
  
    // Reiniciar los errores al abrir el Drawer
    setTitleError(false);
    setMessageError(false);
    setUrlImageError(false);
    setShippDateError(false);
    setForAllError(false);
  };
  

  const validateNotificationForm = () => {
    let valid = true;

    if (!title) {
      setTitleError(true);
      valid = false;
    } else {
      setTitleError(false);
    }

    if (!message) {
      setMessageError(true);
      valid = false;
    } else {
      setMessageError(false);
    }

    if (!urlImage) {
      setUrlImageError(true);
      valid = false;
    } else {
      setUrlImageError(false);
    }

    setForAllError(false);

    return valid;
  };

  const handleCreateOrUpdateNotification = async () => {
    if (!validateNotificationForm()) return;
  
    const currentDate = new Date().toISOString();
  
    // Crear el payload para la notificación
    const notificationPayload = {
      id: notificationId,
      title,
      message,
      urlImage,
      shippDate: currentDate,
      forAll,
      userIds: forAll ? null : selectedUserIds, // Incluir userIds solo si forAll es false
    };
  
    try {
      if (isEditing) {
        // Endpoint para actualizar la notificación
        await axios.put(
          `http://localhost:8080/api/notifications/update/${notificationId}`,
          notificationPayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } else {
        // Lógica de creación (ya está en su lugar)
        if (forAll) {
          await axios.post('http://localhost:8080/api/notifications/createForAll', notificationPayload, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        } else {
          await axios.post(
            'http://localhost:8080/api/notifications/createForUsers',
            { ...notificationPayload, userIds: selectedUserIds },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
        }
      }
  
      // Cerrar el drawer tras la creación o actualización exitosa
      setOpenDrawer(false);
  
      // Actualizar la lista de notificaciones
      const updatedNotificationsResponse = await axios.get(
        'http://localhost:8080/api/notifications/all',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNotifications(updatedNotificationsResponse.data);
    } catch (error) {
      alert('Error al registrar o actualizar la notificación, por favor verifica los datos.');
    }
  };
  

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedNotificationsResponse = await axios.get(
        'http://localhost:8080/api/notifications/all',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNotifications(updatedNotificationsResponse.data);
    } catch (error) {
      alert('Error al eliminar la notificación.');
    }
  };

  if (loading) return <div>Cargando notificaciones...</div>;
  if (apiError) return <div>{apiError}</div>;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Lista de Notificaciones</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={toggleDrawer(true)}
        >
          Crear nueva notificación
        </Button>
      </Stack>

      <Card>
        <NotificationsTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <NotificationsTableHead
                order={order}
                orderBy={orderBy}
                rowCount={notifications.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'title', label: 'Title' },
                  { id: 'message', label: 'Mensaje' },
                  { id: 'urlImage', label: 'Url de la Imagen' },
                  { id: 'shippDate', label: 'Fecha de envío' },
                  { id: 'forAll', label: 'Alcance' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <NotificationsTableRow
                      key={row.id}
                      {...row}
                      selected={selected.indexOf(row.title) !== -1}
                      onEdit={toggleDrawer(true, row)}
                      onDelete={() => handleDeleteNotification(row.id)}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, notifications.length)}
                />
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={notifications.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <Container sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Editar notificación' : 'Registrar nueva notificación'}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Titulo"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={titleError}
              helperText={titleError ? 'Completar este campo' : ''}
            />
            <TextField
              label="Mensaje"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={messageError}
              helperText={messageError ? 'Completar este campo' : ''}
            />
            <TextField
              label="Url de la imagen"
              fullWidth
              value={urlImage}
              onChange={(e) => setUrlImage(e.target.value)}
              error={urlImageError}
              helperText={urlImageError ? 'Completar este campo' : ''}
            />
            <FormControl fullWidth>
              <InputLabel id="alcance-label">Alcance</InputLabel>
              <Select
                labelId="alcance-label"
                label="Alcance"
                value={forAll ? 'true' : 'false'}
                onChange={(e) => {
                  setForAll(e.target.value === 'true');
                  if (e.target.value === 'true') {
                    setSelectedUsers([]); // Limpiar los usuarios seleccionados si el alcance es 'Todos'
                    setSelectedUserIds([]);
                  }
                }}
              >
                <MenuItem value="true">Todos</MenuItem>
                <MenuItem value="false">Específico</MenuItem>
              </Select>
            </FormControl>

            {!forAll && (
              <Autocomplete
                multiple
                options={users}
                value={selectedUsers} // Aquí configuramos los usuarios seleccionados
                getOptionLabel={(option) => option.email}
                onChange={handleUserSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccionar usuarios"
                    placeholder="Buscar por email"
                  />
                )}
              />
            )}

            <Button variant="contained" onClick={handleCreateOrUpdateNotification}>
              {isEditing ? 'Actualizar' : 'Enviar '}
            </Button>
          </Stack>
        </Container>
      </Drawer>
    </Container>
  );
}
