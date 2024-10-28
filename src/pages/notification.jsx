import { Helmet } from 'react-helmet-async';

import { NotificationsView } from 'src/sections/notification/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Notificaciones | Minimal UI </title>
      </Helmet>

      <NotificationsView />
    </>
  );
}
