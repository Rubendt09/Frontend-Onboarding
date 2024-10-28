/* eslint-disable */

import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function NotificationsTableRow({
  selected,
  title,
  message,
  urlImage,
  shippDate,
  forAll,
  onEdit,
  onDelete,
}) {
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

  const handleDeleteClick = () => {
    handleCloseMenu(); 
    onDelete(); 
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const Label = ({ color, children }) => (
    <Box
      sx={{
        display: 'inline-block',
        padding: '4px 8px',
        borderRadius: '4px',
        color: color === 'success' ? 'green' : 'red',
        backgroundColor: color === 'success' ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
        fontWeight: 'bold',
      }}
    >
      {children}
    </Box>
  );

  // Uso del componente
  <TableCell>
    <Label color={forAll ? 'success' : 'error'}>{forAll ? 'Todos' : 'Específico'}</Label>
  </TableCell>;

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{title}</TableCell>
        <TableCell>{message}</TableCell>
        <TableCell>
          <a
            href={urlImage}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline', color: 'inherit' }}
          >
            URL
          </a>
        </TableCell>
        <TableCell>{formatDate(shippDate)}</TableCell>
        <TableCell>
          <Label color={forAll ? 'success' : 'error'}>{forAll ? 'Todos' : 'Especifico'}</Label>
        </TableCell>

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
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Eliminar
        </MenuItem>
      </Popover>
    </>
  );
}

NotificationsTableRow.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  urlImage: PropTypes.string.isRequired,
  shippDate: PropTypes.string.isRequired,
  forAll: PropTypes.bool.isRequired, 

  onEdit: PropTypes.func.isRequired, 
  onDelete: PropTypes.func.isRequired, 
};
