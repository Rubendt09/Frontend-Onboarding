/* eslint-disable */

import { useState } from 'react';
import PropTypes from 'prop-types';

// import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CourseTableRow({ selected, name, descripcion, urlVideo, examId, onEdit, onDelete, onEditExam }) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEditClick = () => {
    handleCloseMenu(); 
    onEdit(); 
  };

  const handleEditExamClick = () => {
    handleCloseMenu(); 
    onEditExam(examId);
  };

  const handleDeleteClick = () => {
    handleCloseMenu(); 
    onDelete(); 
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
      <TableCell>{name}</TableCell> {/* Nombre del curso */}
        <TableCell>{descripcion}</TableCell> {/* Descripción del curso */}
        <TableCell>{urlVideo}</TableCell> {/* URL del video */}
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 180 },
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar Curso
        </MenuItem>

        <MenuItem onClick={handleEditExamClick}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar Examen
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Eliminar
        </MenuItem>
      </Popover>
    </>
  );
}

CourseTableRow.propTypes = {
  name: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
  urlVideo: PropTypes.string.isRequired,
  examId: PropTypes.string.isRequired, 
  selected: PropTypes.bool,
  onEdit: PropTypes.func.isRequired, 
  onDelete: PropTypes.func.isRequired, 
  onEditExam: PropTypes.func.isRequired,
};