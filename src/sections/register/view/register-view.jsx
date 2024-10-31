/* eslint-disable */

import React from 'react';
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

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import RegisterTableRow from '../register-table-row';
import RegisterTableHead from '../register-table-head';
import TableEmptyRows from '../table-empty-rows';
import RegisterTableToolbar from '../register-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { Checkbox, Divider, List, ListItem, ListItemText } from '@mui/material';

export default function RegisterView() {
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
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' para agregar, 'remove' para quitar

  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedCoursesToRemove, setSelectedCoursesToRemove] = useState([]);
  const [selectedCoursesToAdd, setSelectedCoursesToAdd] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get('https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/register/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const registrationData = response.data.map((user) => ({
          ...user,
          courseIds: user.courseIds || [], // Asegura que courseIds esté presente incluso si está vacío
        }));
        setUsers(registrationData);
        setLoading(false);
      } catch (fetchError) {
        console.error('Error al obtener las matrículas:', fetchError);
        setApiError('Error al cargar las matrículas');
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/courses/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const courseData = response.data.map((course) => ({ id: course.id, name: course.name }));
        setCourses(courseData);
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
      }
    };

    fetchCourses();
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

  const [currentRegisterId, setCurrentRegisterId] = useState('');

  const toggleDrawer = (open, mode, user) => (event) => {
    setOpenDrawer(open);
    setDrawerMode(mode);
    if (user) {
      setCurrentRegisterId(user.id);

      const existingCourses = courses.filter((course) => user.courseIds.includes(course.id));
      setRegisteredCourses(existingCourses);
      
      if (mode === 'add') {
        const available = courses.filter((course) => !user.courseIds.includes(course.id));
        setAvailableCourses(available);
      }
      
      setSelectedCoursesToRemove([]); 
      setSelectedCoursesToAdd([]); 
    }
  };

  const handleAddCourse = async () => {
    if (selectedCoursesToAdd.length === 0) {
      alert('Por favor, selecciona al menos un curso para agregar.');
      return;
    }

    try {
      await axios.post(
        `https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/register/add-courses/${currentRegisterId}`,
        selectedCoursesToAdd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setOpenDrawer(false);

      // Actualizar la lista de registros después de la edición
      const updatedUsersResponse = await axios.get('https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/register/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(updatedUsersResponse.data);
    } catch (error) {
      console.error('Error al agregar los cursos:', error);
      alert('Error al agregar los cursos, verifica la selección.');
    }
  };

  const handleRemoveCourses = async () => {
    if (selectedCoursesToRemove.length === 0) {
      alert('Por favor, selecciona al menos un curso para quitar.');
      return;
    }

    try {
      await axios.delete(`https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/register/remove-courses/${currentRegisterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: selectedCoursesToRemove, // Enviar la lista de IDs en el cuerpo de la solicitud
      });
      setOpenDrawer(false);

      // Actualizar la lista de registros después de la eliminación
      const updatedUsersResponse = await axios.get('https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/register/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(updatedUsersResponse.data);
      setSelectedCoursesToRemove([]);
    } catch (error) {
      console.error('Error al quitar los cursos:', error);
      alert('Error al quitar los cursos, por favor intente nuevamente.');
    }
  };

  const handleToggleCourseToAdd = (courseId) => {
    setSelectedCoursesToAdd((prevSelected) =>
      prevSelected.includes(courseId)
        ? prevSelected.filter((id) => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  const handleToggleCourseToRemove = (courseId) => {
    setSelectedCoursesToRemove((prevSelected) =>
      prevSelected.includes(courseId)
        ? prevSelected.filter((id) => id !== courseId)
        : [...prevSelected, courseId]
    );
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
        <Typography variant="h4">Lista de Matriculas</Typography>
      </Stack>

      <Card>
        <RegisterTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <RegisterTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'fullName', label: 'Nombre' },
                  { id: 'email', label: 'Email' },
                  { id: 'courseCount', label: 'Número de cursos' },
                  { id: '' },
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <RegisterTableRow
                      key={row.id}
                      id={row.id}
                      fullName={row.fullName}
                      email={row.email}
                      courseCount={row.courseCount}
                      selected={selected.indexOf(row.fullName) !== -1}
                      onEdit={toggleDrawer(true, 'add', row)}
                      onDelete={toggleDrawer(true, 'remove', row)}
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

      {/* Drawer para agregar o quitar cursos */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <Container sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {drawerMode === 'add' ? 'Agregar Cursos' : 'Quitar Cursos'}
          </Typography>

          {/* Lista de cursos ya registrados (Visible en ambos modos) */}
          <Typography variant="subtitle1" gutterBottom>
            Cursos Inscritos:
          </Typography>
          {registeredCourses.length > 0 ? (
            <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
              {registeredCourses.map((course) => (
                <React.Fragment key={course.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      drawerMode === 'remove' && (
                        <Checkbox
                          edge="end"
                          onChange={() => handleToggleCourseToRemove(course.id)}
                          checked={selectedCoursesToRemove.includes(course.id)}
                        />
                      )
                    }
                  >
                    <ListItemText
                      primary={course.name}
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          ID del curso: {course.id}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" mb={2}>
              No hay cursos inscritos.
            </Typography>
          )}

          {/* Lista de cursos disponibles para agregar (Solo visible en el modo "add") */}
          {drawerMode === 'add' && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Cursos Disponibles:
              </Typography>
              {availableCourses.length > 0 ? (
                <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
                  {availableCourses.map((course) => (
                    <React.Fragment key={course.id}>
                      <ListItem
                        alignItems="flex-start"
                        secondaryAction={
                          <Checkbox
                            edge="end"
                            onChange={() => handleToggleCourseToAdd(course.id)}
                            checked={selectedCoursesToAdd.includes(course.id)}
                          />
                        }
                      >
                        <ListItemText
                          primary={course.name}
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              ID del curso: {course.id}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" mb={2}>
                  No hay cursos disponibles para agregar.
                </Typography>
              )}
            </>
          )}

          {/* Botones de Agregar o Quitar cursos */}
          {drawerMode === 'add' ? (
            <Button
              variant="contained"
              onClick={handleAddCourse}
              disabled={selectedCoursesToAdd.length === 0}
            >
              Agregar Cursos
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={handleRemoveCourses}
              disabled={selectedCoursesToRemove.length === 0}
            >
              Quitar Cursos
            </Button>
          )}
        </Container>
      </Drawer>
    </Container>
  );
}
