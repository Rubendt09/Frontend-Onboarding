import { Helmet } from 'react-helmet-async';

import { RegisterView } from 'src/sections/register/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Register | Minimal UI </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
