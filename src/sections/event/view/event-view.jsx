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

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import EventTableRow from '../event-table-row';
import EventTableHead from '../event-table-head';
import TableEmptyRows from '../table-empty-rows';
import EventTableToolbar from '../event-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function EventView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [urlImage, setUrlImage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  // Estados de error para los campos
  const [titleError, setTitleError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [urlImageError, setUrlImageError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/events', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEvents(response.data);
        setLoading(false);
      } catch (fetchError) {
        console.error('Error al obtener los eventos:', fetchError);
        setApiError('Error al cargar los eventos');
        setLoading(false);
      }
    };

    fetchEvents();
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
    inputData: events,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const toggleDrawer = (open, event = null) => () => {
    setOpenDrawer(open);
    setIsEditing(!!event);
    setCurrentEventId(event ? event.id : null);
  
    if (event) {
      const formattedDate = event.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16) // Formato 'YYYY-MM-DDTHH:MM'
        : '';
  
      setTitle(event.title || '');
      setMessage(event.message || '');
      setUrlImage(event.urlImage || '');
      setStartDate(formattedDate); 
    } else {
      setTitle('');
      setMessage('');
      setUrlImage('');
      setStartDate('');
    }
  
    setTitleError(false);
    setMessageError(false);
    setUrlImageError(false);
    setStartDateError(false);
  };
  
  
  const validateEventForm = () => {
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

    if (!startDate) {
      setStartDateError(true);
      valid = false;
    } else {
      setStartDateError(false);
    }

    return valid;
  };

  const handleCreateOrUpdateEvent = async () => {
    if (!validateEventForm()) return;
  
    const eventPayload = {
      title,
      message,
      urlImage,
      startDate,
    };
  
    try {
      if (isEditing && currentEventId) {
        // Solo llama a actualizar si hay un `currentEventId` válido
        await axios.put(`http://localhost:8080/api/events/update/${currentEventId}`, eventPayload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        // Si no está en modo edición, realiza la creación
        await axios.post('http://localhost:8080/api/events/create', eventPayload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }
  
      setOpenDrawer(false);
  
      // Actualiza la lista de eventos después de crear o actualizar
      const updatedEventsResponse = await axios.get('http://localhost:8080/api/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(updatedEventsResponse.data);
    } catch (createOrUpdateEventError) {
      console.error('Error al registrar o actualizar el evento:', createOrUpdateEventError);
      alert('Error al registrar o actualizar el evento, por favor verifica los datos.');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedEventsResponse = await axios.get('http://localhost:8080/api/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(updatedEventsResponse.data);
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      alert('Error al eliminar el evento.');
    }
  };

  if (loading) return <div>Cargando eventos...</div>;
  if (apiError) return <div>{apiError}</div>;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Lista de Eventos</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={toggleDrawer(true)}
        >
          Crear nuevo evento
        </Button>
      </Stack>

      <Card>
        <EventTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <EventTableHead
                order={order}
                orderBy={orderBy}
                rowCount={events.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'title', label: 'Título' },
                  { id: 'message', label: 'Mensaje' },
                  { id: 'startDate', label: 'Fecha de inicio' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <EventTableRow
                      key={row.id}
                      title={row.title}
                      message={row.message}
                      startDate={row.startDate}
                      id={row.id}
                      selected={selected.indexOf(row.title) !== -1}
                      onEdit={toggleDrawer(true, row)}
                      onDelete={() => handleDeleteEvent(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, events.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Drawer para registrar o editar evento */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <Container sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Editar evento' : 'Registrar nuevo evento'}
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Título"
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
              label="URL de la imagen"
              fullWidth
              value={urlImage}
              onChange={(e) => setUrlImage(e.target.value)}
              error={urlImageError}
              helperText={urlImageError ? 'Completar este campo' : ''}
            />
            <TextField
              label="Fecha de inicio"
              fullWidth
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={startDateError}
              helperText={startDateError ? 'Completar este campo' : ''}
              InputLabelProps={{
                shrink: true, 
              }}
            />

            <Button variant="contained" onClick={handleCreateOrUpdateEvent}>
              {isEditing ? 'Actualizar' : 'Registrar'}
            </Button>
          </Stack>
        </Container>
      </Drawer>
    </Container>
  );
}
