import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Dashboard',
    path: '/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Cursos List',
    path: '/courselist',
    icon: icon('ic_courses'),
  },
  {
    title: 'Registro',
    path: '/register',
    icon: icon('ic_tuition'),
  },
  {
    title: 'Notificaciones',
    path: '/notification',
    icon: icon('ic_mail'),
  },
  {
    title: 'Eventos',
    path: '/event',
    icon: icon('ic_events'),
  },
  {
    title: 'Usuarios',
    path: '/user',
    icon: icon('ic_users'),
  },
  {/*

  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  */},
];

export default navConfig;
