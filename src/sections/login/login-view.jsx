/* eslint-disable */

import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import myImage from '../../../public/assets/icons/logo/pacifico-logo.svg';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import axios from 'axios'; // Usando axios para simplificar la solicitud

export default function LoginView() {
  const router = useRouter();

  // Estados para email, password y loading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/user/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        router.push('/app');
      }
    } catch (error) {
      console.error('Error en el login', error);
      alert('Login fallido, por favor revisa tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link
          variant="subtitle2"
          underline="hover"
          href="https://sd.pacifico.com.pe/pacificoportal?id=landing_pacifico"
        >
          Si olvidaste tu contraseña comunícate con la mesa de ayuda
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={loading} // Mostrar estado de carga
        onClick={handleClick} // Llamar a la función de login
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Ingresa con tus credenciales corporativas</Typography>

          <img
            src={myImage}
            style={{ width: '400px', height: '100px', marginTop: '40px', marginBottom: '40px' }}
            alt="Logo"
          />

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
