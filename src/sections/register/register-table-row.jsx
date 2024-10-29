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

export default function RegisterTableRow({
  selected,
  fullName,
  email,
  courseCount,
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

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{fullName}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{courseCount}</TableCell>
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
        <MenuItem onClick={onEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Agregar cursos
        </MenuItem>

        <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Quitar cursos
        </MenuItem>
      </Popover>
    </>
  );
}

RegisterTableRow.propTypes = {
  id: PropTypes.string.isRequired, // Añade id como prop obligatoria
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  courseCount: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
