/* eslint-disable */
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Table,
  Button,
  Container,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
  Drawer,
  TextField,
  Box,
  Divider,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import CourseTableRow from '../course-table-row';
import CourseTableHead from '../course-table-head';
import TableEmptyRows from '../table-empty-rows';
import CourseTableToolbar from '../course-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function CourseListView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingExam, setIsEditingExam] = useState(false);
  const [name, setName] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [urlVideo, setUrlVideo] = useState('');
  const [courseId, setCourseId] = useState('');
  const [examId, setExamId] = useState('');

  // Estado para las preguntas del examen
  const [questions, setQuestions] = useState([
    { question: '', answer: { answer1: '', answer2: '', answer3: '', answer4: '' } },
  ]);

  // Estado para manejar errores
  const [errors, setErrors] = useState({
    name: '',
    descripcion: '',
    urlVideo: '',
    questions: [],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          'https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/courses/all',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setCourses(response.data);
        setLoading(false);
      } catch (fetchError) {
        console.error('Error al obtener los cursos:', fetchError);
        setApiError('Error al cargar los cursos');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const dataFiltered = applyFilter({
    inputData: courses,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const toggleDrawer = (open, course = null, isExam = false) => {
    return (event) => {
      setOpenDrawer(open);
      setIsEditing(!!course && !isExam);
      setIsEditingExam(isExam);
      if (course) {
        if (isExam) {
          setCourseId(course.id);
          setExamId(course.exam?.id || '');
          const examQuestions = course.exam?.questions || [
            { question: '', answer: { answer1: '', answer2: '', answer3: '', answer4: '' } },
          ];
          setQuestions(examQuestions);
          setErrors((prevErrors) => ({
            ...prevErrors,
            questions: examQuestions.map(() => ({})),
          }));
        } else {
          setCourseId(course.id);
          setName(course.name);
          setDescripcion(course.descripcion);
          setUrlVideo(course.urlVideo);
          setExamId(course.exam?.id || '');
        }
      } else {
        setCourseId('');
        setName('');
        setDescripcion('');
        setUrlVideo('');
        setExamId('');
        const defaultQuestions = [
          { question: '', answer: { answer1: '', answer2: '', answer3: '', answer4: '' } },
        ];
        setQuestions(defaultQuestions);
        setErrors((prevErrors) => ({
          ...prevErrors,
          questions: defaultQuestions.map(() => ({})),
        }));
      }
    };
  };

  const handleInputChange = (index, field, value, subfield = null) => {
    const updatedQuestions = [...questions];
    if (subfield) {
      updatedQuestions[index].answer[subfield] = value; // Actualiza el subcampo dentro de 'answer'
    } else {
      updatedQuestions[index][field] = value; // Actualiza el campo de 'question'
    }
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', answer: { answer1: '', answer2: '', answer3: '', answer4: '' } },
    ]);
  };

  const handleDeleteLastQuestion = () => {
    if (questions.length > 1) {
      setQuestions(questions.slice(0, -1));
    }
  };

  const handleEditExam = (examId) => {
    const course = courses.find((course) => course.exam.id === examId);
    if (course) {
      toggleDrawer(true, course, true)();
    }
  };

  const handleCreateOrUpdateCourse = async () => {
    const courseupdatePayload = {
      name,
      descripcion,
      urlVideo,
      exam: {
        id: examId,
      },
    };

    const coursecreatePayload = {
      name,
      descripcion,
      urlVideo,
    };

    if (!validateCourse()) {
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/courses/update/${courseId}`,
          courseupdatePayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } else {
        const response = await axios.post(
          'https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/courses/create',
          coursecreatePayload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      }
      setOpenDrawer(false);
      const updatedCoursesResponse = await axios.get(
        'https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/courses/all',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCourses(updatedCoursesResponse.data);
    } catch (error) {
      console.error('Error al registrar o actualizar el curso:', error);
      alert('Error al registrar o actualizar el curso.');
    }
  };

  const handleUpdateExam = async () => {
    // Validación del examen
    if (!validateExam()) {
      return; // Si falla la validación, no continúa
    }

    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      answer: {
        answer1: q.answer.answer1,
        answer2: q.answer.answer2,
        answer3: q.answer.answer3,
        answer4: q.answer.answer4,
        correctAnswer: q.answer.answer4, // Siempre asumimos que la respuesta D es la correcta
      },
    }));

    try {
      await axios.put(
        `https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/exams/update/${examId}`,
        { questions: formattedQuestions },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setOpenDrawer(false);
      const updatedCoursesResponse = await axios.get(
        'https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/courses/all',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCourses(updatedCoursesResponse.data);
    } catch (error) {
      console.error('Error al actualizar el examen:', error);
      alert('Error al actualizar el examen.');
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(
        `https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/courses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const updatedCoursesResponse = await axios.get(
        'https://onboardngapi-gchdcgc4bafzhhef.centralus-01.azurewebsites.net/api/courses/all',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCourses(updatedCoursesResponse.data);
    } catch (error) {
      console.error('Error al eliminar el curso:', error);
      alert('Error al eliminar el curso.');
    }
  };

  // Función para validar el formulario de cursos
  const validateCourse = () => {
    let newErrors = {};
    if (!name) newErrors.name = 'Completar este campo';
    if (!descripcion) newErrors.descripcion = 'Completar este campo';
    if (!urlVideo) {
      newErrors.urlVideo = 'Completar este campo';
    } else if (!validateVideoUrl(urlVideo)) {
      newErrors.urlVideo = 'Ingresar una URL válida';
    }

    setErrors(newErrors);
    // Retorna verdadero si no hay errores
    return Object.keys(newErrors).length === 0;
  };

  // Función para validar el formulario de exámenes
  const validateExam = () => {
    let newErrors = { questions: [] };

    questions.forEach((question, index) => {
      let questionErrors = {};
      if (!question.question) questionErrors.question = 'Completar este campo';
      if (!question.answer.answer1) questionErrors.answer1 = 'Completar este campo';
      if (!question.answer.answer2) questionErrors.answer2 = 'Completar este campo';
      if (!question.answer.answer3) questionErrors.answer3 = 'Completar este campo';
      if (!question.answer.answer4) questionErrors.answer4 = 'Completar este campo';
      newErrors.questions[index] = questionErrors;
    });

    setErrors(newErrors);
    return questions.every(
      (q) =>
        q.question && q.answer.answer1 && q.answer.answer2 && q.answer.answer3 && q.answer.answer4
    );
  };

  // Función para validar si una URL es de video
  const validateVideoUrl = (url) => {
    const videoRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|vimeo\.com|dailymotion\.com|youtu\.be)\/.+$/;
    return videoRegex.test(url);
  };

  if (loading) {
    return <div>Cargando cursos...</div>;
  }

  if (apiError) {
    return <div>{apiError}</div>;
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Lista de Cursos</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={toggleDrawer(true)}
        >
          Crear nuevo Curso
        </Button>
      </Stack>

      <Card>
        <CourseTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CourseTableHead
                order={order}
                orderBy={orderBy}
                rowCount={courses.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'name', label: 'Nombre del Curso' },
                  { id: 'descripcion', label: 'Descripción' },
                  { id: 'urlVideo', label: 'URL Video' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CourseTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      descripcion={row.descripcion}
                      urlVideo={row.urlVideo}
                      examId={row.exam.id}
                      selected={selected.indexOf(row.name) !== -1}
                      onEdit={toggleDrawer(true, row)}
                      onDelete={() => handleDeleteCourse(row.id)}
                      onEditExam={handleEditExam}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, courses.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={courses.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Drawer para registrar o editar curso o examen */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <Container sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditingExam ? 'Editar Examen' : isEditing ? 'Editar Curso' : 'Registrar nuevo curso'}
          </Typography>

          {isEditingExam && (
            <Typography variant="body2" sx={{ color: 'red', mb: 4 }}>
              *Recuerda que la respuesta D es la correcta*
            </Typography>
          )}

          <Stack spacing={2}>
            {isEditingExam ? (
              <>
                {questions.map((question, index) => (
                  <Box key={index} sx={{ mb: 4 }}>
                    <TextField
                      sx={{ mb: 2 }}
                      label={`Pregunta ${index + 1}`}
                      fullWidth
                      value={question.question}
                      onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                      error={!!errors.questions[index]?.question}
                      helperText={errors.questions[index]?.question || ''}
                    />
                    <TextField
                      sx={{ mb: 2 }}
                      label="Respuesta A"
                      fullWidth
                      value={question.answer.answer1}
                      onChange={(e) =>
                        handleInputChange(index, 'answer', e.target.value, 'answer1')
                      }
                      error={!!errors.questions[index]?.answer1}
                      helperText={errors.questions[index]?.answer1 || ''}
                    />
                    <TextField
                      sx={{ mb: 2 }}
                      label="Respuesta B"
                      fullWidth
                      value={question.answer.answer2}
                      onChange={(e) =>
                        handleInputChange(index, 'answer', e.target.value, 'answer2')
                      }
                      error={!!errors.questions[index]?.answer2}
                      helperText={errors.questions[index]?.answer2 || ''}
                    />
                    <TextField
                      sx={{ mb: 2 }}
                      label="Respuesta C"
                      fullWidth
                      value={question.answer.answer3}
                      onChange={(e) =>
                        handleInputChange(index, 'answer', e.target.value, 'answer3')
                      }
                      error={!!errors.questions[index]?.answer3}
                      helperText={errors.questions[index]?.answer3 || ''}
                    />
                    <TextField
                      sx={{ mb: 2 }}
                      label="Respuesta D"
                      fullWidth
                      value={question.answer.answer4}
                      onChange={(e) =>
                        handleInputChange(index, 'answer', e.target.value, 'answer4')
                      }
                      error={!!errors.questions[index]?.answer4}
                      helperText={errors.questions[index]?.answer4 || ''}
                    />
                    <Divider sx={{ my: 3 }} />
                  </Box>
                ))}
                <Button variant="contained" onClick={handleAddQuestion}>
                  Agregar pregunta
                </Button>
                <Button variant="text" color="error" onClick={handleDeleteLastQuestion}>
                  Eliminar última pregunta
                </Button>
              </>
            ) : (
              <>
                <TextField
                  label="Nombre"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  label="Descripcion"
                  fullWidth
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                  multiline
                  rows={4}
                />
                <TextField
                  label="Url del Video"
                  fullWidth
                  value={urlVideo}
                  onChange={(e) => setUrlVideo(e.target.value)}
                  error={!!errors.urlVideo}
                  helperText={errors.urlVideo}
                />
              </>
            )}

            <Button
              variant="contained"
              onClick={isEditingExam ? handleUpdateExam : handleCreateOrUpdateCourse}
            >
              {isEditingExam ? 'Actualizar Examen' : isEditing ? 'Actualizar Curso' : 'Registrar'}
            </Button>
          </Stack>
        </Container>
      </Drawer>
    </Container>
  );
}
